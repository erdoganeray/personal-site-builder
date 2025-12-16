import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  checkAndResetEditCounter,
  hasRemainingEdits,
  incrementEditCounter,
  getRemainingEdits,
} from "@/lib/subscription-utils";
import { getPlanLimits, PlanType } from "@/lib/plan-constants";
import { analyzeRevisionRequest } from "@/lib/revision-analyzer";
import {
  addComponent,
  removeComponent,
  reorderComponents,
  changeComponentTemplate,
  validateComponentAddition,
  DesignPlan,
} from "@/lib/revision-operations";
import { regeneratePreviewContent } from "@/lib/regenerate-preview";
import { getRedirectMessage } from "@/lib/chat-suggestions";
import { getFontPairById } from "@/lib/font-registry";

/**
 * POST /api/site/revise
 * Template-based site revision using LLM analysis
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    // 2. Get request body
    const { siteId, message } = await req.json();

    if (!siteId || !message) {
      return NextResponse.json(
        { error: "siteId and message are required" },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message must be a non-empty string" },
        { status: 400 }
      );
    }

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Find site and verify ownership
    const site = await prisma.site.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    if (site.userId !== user.id) {
      return NextResponse.json(
        { error: "You don't have permission to revise this site" },
        { status: 403 }
      );
    }

    // 5. Check and reset monthly edit counter if needed
    const userWithResetCounter = await checkAndResetEditCounter(user.id);

    // 7. Validate site has required content
    if (!site.designPlan || !site.cvContent) {
      return NextResponse.json(
        { error: "Site is missing design plan or CV content" },
        { status: 400 }
      );
    }

    // 8. Analyze user's revision request with LLM
    let operation;
    try {
      operation = await analyzeRevisionRequest(
        message.trim(),
        site.designPlan as unknown as DesignPlan,
        site.cvContent as any
      );
    } catch (analysisError) {
      console.error("Revision analysis error:", analysisError);
      return NextResponse.json(
        {
          error: "Talebinizi analiz edemedik. Lütfen daha açık bir şekilde belirtin.",
          details:
            analysisError instanceof Error
              ? analysisError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }

    // 9. Handle operation based on type
    let updatedDesignPlan = site.designPlan as unknown as DesignPlan;
    let responseMessage = "";
    let shouldRegeneratePreview = false;
    let shouldIncrementQuota = true;

    switch (operation.type) {
      case "REDIRECT_TO_MYINFO":
        // Don't increment quota for redirects
        shouldIncrementQuota = false;
        responseMessage = getRedirectMessage(operation.field);

        return NextResponse.json({
          success: true,
          operation,
          message: responseMessage,
          redirectToMyInfo: true,
          myInfoField: operation.field,
          subscription: {
            editsUsed: userWithResetCounter.editsThisMonth,
            editsLimit: getPlanLimits(userWithResetCounter.planType as PlanType)
              .editsPerMonth,
            editsRemaining: getRemainingEdits(
              userWithResetCounter.planType,
              userWithResetCounter.editsThisMonth
            ),
            resetDate: userWithResetCounter.editsResetDate,
          },
        });

      case "UNSUPPORTED":
        // Don't increment quota for unsupported operations
        shouldIncrementQuota = false;
        responseMessage = operation.message;

        return NextResponse.json({
          success: false,
          operation,
          message: responseMessage,
          subscription: {
            editsUsed: userWithResetCounter.editsThisMonth,
            editsLimit: getPlanLimits(userWithResetCounter.planType as PlanType)
              .editsPerMonth,
            editsRemaining: getRemainingEdits(
              userWithResetCounter.planType,
              userWithResetCounter.editsThisMonth
            ),
            resetDate: userWithResetCounter.editsResetDate,
          },
        });

      case "CHAT":
        // Don't increment quota for chat messages
        shouldIncrementQuota = false;
        responseMessage = operation.message;

        return NextResponse.json({
          success: true,
          operation,
          message: responseMessage,
          subscription: {
            editsUsed: userWithResetCounter.editsThisMonth,
            editsLimit: getPlanLimits(userWithResetCounter.planType as PlanType)
              .editsPerMonth,
            editsRemaining: getRemainingEdits(
              userWithResetCounter.planType,
              userWithResetCounter.editsThisMonth
            ),
            resetDate: userWithResetCounter.editsResetDate,
          },
        });

      case "ADD_COMPONENT":
        // Check quota before actual revision
        if (
          !hasRemainingEdits(
            userWithResetCounter.planType,
            userWithResetCounter.editsThisMonth
          )
        ) {
          const limits = getPlanLimits(userWithResetCounter.planType as PlanType);
          return NextResponse.json(
            {
              error: `Bu ay için düzenleme hakkınız doldu (${limits.editsPerMonth}/${limits.editsPerMonth}). Yeni ay başında hakkınız yenilenecek.`,
              resetDate: userWithResetCounter.editsResetDate,
            },
            { status: 400 }
          );
        }

        // Validate component can be added
        const validation = validateComponentAddition(
          site.cvContent as any,
          operation.category
        );

        if (!validation.isValid) {
          shouldIncrementQuota = false;
          return NextResponse.json({
            success: false,
            operation,
            message: `❌ ${operation.category} bölümü eklenemedi: ${validation.reason}`,
            subscription: {
              editsUsed: userWithResetCounter.editsThisMonth,
              editsLimit: getPlanLimits(
                userWithResetCounter.planType as PlanType
              ).editsPerMonth,
              editsRemaining: getRemainingEdits(
                userWithResetCounter.planType,
                userWithResetCounter.editsThisMonth
              ),
              resetDate: userWithResetCounter.editsResetDate,
            },
          });
        }

        // Debug: Log component addition
        console.log("\n➕ COMPONENT ADD DEBUG:");
        console.log(`   Category: ${operation.category}`);
        console.log(`   Template: ${operation.templateId}`);
        console.log(`   Position: ${operation.position ?? 'end'}\n`);

        updatedDesignPlan = addComponent(
          updatedDesignPlan,
          operation.category,
          operation.templateId,
          operation.position
        );
        shouldRegeneratePreview = true;
        responseMessage = `✅ ${operation.category} bölümü eklendi`;
        break;

      case "REMOVE_COMPONENT":
        // Check quota before actual revision
        if (
          !hasRemainingEdits(
            userWithResetCounter.planType,
            userWithResetCounter.editsThisMonth
          )
        ) {
          const limits = getPlanLimits(userWithResetCounter.planType as PlanType);
          return NextResponse.json(
            {
              error: `Bu ay için düzenleme hakkınız doldu (${limits.editsPerMonth}/${limits.editsPerMonth}). Yeni ay başında hakkınız yenilenecek.`,
              resetDate: userWithResetCounter.editsResetDate,
            },
            { status: 400 }
          );
        }
        // Debug: Log component removal
        const removedComponent = updatedDesignPlan.selectedComponents.find(
          (c) => c.category === operation.category
        );
        console.log("\n➖ COMPONENT REMOVE DEBUG:");
        console.log(`   Category: ${operation.category}`);
        console.log(`   Template: ${removedComponent?.templateId || 'NOT FOUND'}\n`);

        updatedDesignPlan = removeComponent(
          updatedDesignPlan,
          operation.category
        );
        shouldRegeneratePreview = true;
        responseMessage = `✅ ${operation.category} bölümü kaldırıldı`;
        break;

      case "REORDER_COMPONENTS":
        // Check quota before actual revision
        if (
          !hasRemainingEdits(
            userWithResetCounter.planType,
            userWithResetCounter.editsThisMonth
          )
        ) {
          const limits = getPlanLimits(userWithResetCounter.planType as PlanType);
          return NextResponse.json(
            {
              error: `Bu ay için düzenleme hakkınız doldu (${limits.editsPerMonth}/${limits.editsPerMonth}). Yeni ay başında hakkınız yenilenecek.`,
              resetDate: userWithResetCounter.editsResetDate,
            },
            { status: 400 }
          );
        }
        // Debug: Log component reordering
        const currentOrder = updatedDesignPlan.selectedComponents.map(c => c.category).join(', ');
        console.log("\n⇅ COMPONENT REORDER DEBUG:");
        console.log(`   Old Order: ${currentOrder}`);
        console.log(`   New Order: ${operation.newOrder.join(', ')}\n`);

        updatedDesignPlan = reorderComponents(
          updatedDesignPlan,
          operation.newOrder
        );
        shouldRegeneratePreview = true;
        responseMessage = `✅ Bölüm sıralaması güncellendi`;
        break;

      case "CHANGE_TEMPLATE":
        // Check quota before actual revision
        if (
          !hasRemainingEdits(
            userWithResetCounter.planType,
            userWithResetCounter.editsThisMonth
          )
        ) {
          const limits = getPlanLimits(userWithResetCounter.planType as PlanType);
          return NextResponse.json(
            {
              error: `Bu ay için düzenleme hakkınız doldu (${limits.editsPerMonth}/${limits.editsPerMonth}). Yeni ay başında hakkınız yenilenecek.`,
              resetDate: userWithResetCounter.editsResetDate,
            },
            { status: 400 }
          );
        }

        // Debug: Log old template before change
        const oldComponent = updatedDesignPlan.selectedComponents.find(
          (c) => c.category === operation.category
        );
        console.log("\n🔄 TEMPLATE CHANGE DEBUG:");
        console.log(`   Category: ${operation.category}`);
        console.log(`   Old Template: ${oldComponent?.templateId || 'NOT FOUND'}`);
        console.log(`   New Template: ${operation.newTemplateId}`);

        updatedDesignPlan = changeComponentTemplate(
          updatedDesignPlan,
          operation.category,
          operation.newTemplateId
        );

        // Debug: Verify change was applied
        const newComponent = updatedDesignPlan.selectedComponents.find(
          (c) => c.category === operation.category
        );
        console.log(`   ✅ Verified New Template: ${newComponent?.templateId}\n`);

        shouldRegeneratePreview = true;
        responseMessage = `✅ ${operation.category} template'i değiştirildi`;
        break;

      case "UPDATE_THEME":
        // Check quota before actual revision
        if (
          !hasRemainingEdits(
            userWithResetCounter.planType,
            userWithResetCounter.editsThisMonth
          )
        ) {
          const limits = getPlanLimits(userWithResetCounter.planType as PlanType);
          return NextResponse.json(
            {
              error: `Bu ay için düzenleme hakkınız doldu (${limits.editsPerMonth}/${limits.editsPerMonth}). Yeni ay başında hakkınız yenilenecek.`,
              resetDate: userWithResetCounter.editsResetDate,
            },
            { status: 400 }
          );
        }

        // Debug: Log theme color update
        console.log("\n🎨 THEME UPDATE DEBUG:");
        console.log(`   Old Colors:`, updatedDesignPlan.themeColors);
        console.log(`   New Colors from Gemini:`, operation.colors);
        console.log(`   Theme:`, (operation as any).theme);

        // Merge TÜM renkleri (Gemini'den gelenler öncelikli)
        const currentColors: any = updatedDesignPlan.themeColors || {};
        const updatedThemeColors = {
          // Base colors
          primary: operation.colors.primary || currentColors.primary,
          secondary: operation.colors.secondary || currentColors.secondary,
          accent: operation.colors.accent || currentColors.accent,
          neutral: operation.colors.neutral || (currentColors as any).neutral,

          // Derived colors - Gemini'den gelirse kullan
          background: operation.colors.background || currentColors.background,
          surface: (operation.colors as any).surface || (currentColors as any).surface,
          text: operation.colors.text || currentColors.text,
          textSecondary: (operation.colors as any).textSecondary || (currentColors as any).textSecondary,
          border: (operation.colors as any).border || (currentColors as any).border,
          hover: (operation.colors as any).hover || (currentColors as any).hover,
          iconPrimary: (operation.colors as any).iconPrimary || (currentColors as any).iconPrimary,
          iconSecondary: (operation.colors as any).iconSecondary || (currentColors as any).iconSecondary,

          // Keep fonts
          fontHeading: currentColors.fontHeading,
          fontBody: currentColors.fontBody,
        };

        updatedDesignPlan.themeColors = updatedThemeColors as any;

        // Update theme if provided
        if ((operation as any).theme) {
          (updatedDesignPlan as any).theme = (operation as any).theme;
        }

        console.log(`   ✅ Final Theme Colors:`, updatedDesignPlan.themeColors);
        console.log("");

        shouldRegeneratePreview = true;
        responseMessage = `✅ Tema renkleri güncellendi`;
        break;

      case "CHANGE_FONTS":
        // Check quota before actual revision
        if (
          !hasRemainingEdits(
            userWithResetCounter.planType,
            userWithResetCounter.editsThisMonth
          )
        ) {
          const limits = getPlanLimits(userWithResetCounter.planType as PlanType);
          return NextResponse.json(
            {
              error: `Bu ay için düzenleme hakkınız doldu (${limits.editsPerMonth}/${limits.editsPerMonth}). Yeni ay başında hakkınız yenilenecek.`,
              resetDate: userWithResetCounter.editsResetDate,
            },
            { status: 400 }
          );
        }

        // Debug: Log font change
        console.log("\n🔤 FONT CHANGE DEBUG:");
        console.log(`   Old Font Style: ${updatedDesignPlan.fontStyle || 'professional'}`);
        console.log(`   Old Font Pair ID: ${updatedDesignPlan.fontPairId || 'professional-1'}`);
        console.log(`   New Font Style: ${operation.fontStyle}`);
        console.log(`   New Font Pair ID: ${operation.fontPairId}`);

        // Get font pair
        const fontPair = getFontPairById(operation.fontPairId);
        if (!fontPair) {
          shouldIncrementQuota = false;
          return NextResponse.json({
            success: false,
            operation,
            message: `❌ Font çifti bulunamadı: ${operation.fontPairId}`,
            subscription: {
              editsUsed: userWithResetCounter.editsThisMonth,
              editsLimit: getPlanLimits(
                userWithResetCounter.planType as PlanType
              ).editsPerMonth,
              editsRemaining: getRemainingEdits(
                userWithResetCounter.planType,
                userWithResetCounter.editsThisMonth
              ),
              resetDate: userWithResetCounter.editsResetDate,
            },
          });
        }

        // Keep current colors, only update fonts

        // Manually update fonts in themeColors
        if (updatedDesignPlan.themeColors) {
          updatedDesignPlan.themeColors.fontHeading = fontPair.heading;
          updatedDesignPlan.themeColors.fontBody = fontPair.body;
        }

        // Update font style and pair ID
        updatedDesignPlan.fontStyle = operation.fontStyle;
        updatedDesignPlan.fontPairId = operation.fontPairId;

        console.log(`   ✅ Fonts Updated: ${fontPair.heading} / ${fontPair.body}`);
        console.log("");

        shouldRegeneratePreview = true;
        responseMessage = `✅ Fontlar güncellendi: ${fontPair.heading}`;
        break;

      default:
        shouldIncrementQuota = false;
        return NextResponse.json({
          success: false,
          operation,
          message: "Bilinmeyen işlem tipi",
        });
    }

    // 10. Regenerate preview content if needed
    if (shouldRegeneratePreview) {
      try {
        // First update the designPlan in the database
        await prisma.site.update({
          where: { id: siteId },
          data: { designPlan: updatedDesignPlan as any },
        });

        // Then regenerate preview content from the updated designPlan
        await regeneratePreviewContent(siteId);
      } catch (regenerateError) {
        console.error("Preview regeneration error:", regenerateError);
        return NextResponse.json(
          {
            error: "Preview oluşturulurken hata oluştu",
            details:
              regenerateError instanceof Error
                ? regenerateError.message
                : "Unknown error",
          },
          { status: 500 }
        );
      }
    }

    // 11. Increment edit counter
    const updatedUser = shouldIncrementQuota
      ? await incrementEditCounter(user.id)
      : userWithResetCounter;

    // 12. Get updated site
    const updatedSite = await prisma.site.findUnique({
      where: { id: siteId },
      select: {
        id: true,
        designPlan: true,
      },
    });

    // 13. Return success response
    const limits = getPlanLimits(updatedUser.planType as PlanType);
    const remainingEdits = getRemainingEdits(
      updatedUser.planType,
      updatedUser.editsThisMonth
    );

    return NextResponse.json({
      success: true,
      operation,
      message: responseMessage,
      site: {
        id: updatedSite?.id,
        designPlan: updatedSite?.designPlan,
      },
      subscription: {
        editsUsed: updatedUser.editsThisMonth,
        editsLimit: limits.editsPerMonth,
        editsRemaining: remainingEdits,
        resetDate: updatedUser.editsResetDate,
      },
    });
  } catch (error) {
    console.error("Error in /api/site/revise:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

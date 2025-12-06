/**
 * Change Detection Utilities for Published Sites
 * 
 * This module provides utilities to detect if a published site has unpublished changes
 * and to generate summaries of those changes for user notifications.
 */

interface Site {
  id: string;
  status: string;
  htmlContent: string | null;
  cssContent: string | null;
  jsContent: string | null;
  cvContent: any;
  publishedHtmlContent?: string | null;
  publishedCssContent?: string | null;
  publishedJsContent?: string | null;
  publishedCvContent?: any;
}

interface ChangeInfo {
  hasChanges: boolean;
  changedFields: string[];
  summary: string;
}

/**
 * Checks if a published site has unpublished changes
 * @param site - The site object with current and published content
 * @returns true if site is published and has changes, false otherwise
 */
export function hasUnpublishedChanges(site: Site): boolean {
  // Only check if site is published
  if (site.status !== "published") {
    return false;
  }

  // If no published snapshots exist, consider it as having changes
  if (!site.publishedHtmlContent && !site.publishedCssContent && !site.publishedJsContent) {
    return false; // No published version to compare against
  }

  // Check if any content differs from published version
  const htmlChanged = site.htmlContent !== site.publishedHtmlContent;
  const cssChanged = site.cssContent !== site.publishedCssContent;
  const jsChanged = site.jsContent !== site.publishedJsContent;

  return htmlChanged || cssChanged || jsChanged;
}

/**
 * Gets detailed information about what has changed
 * @param site - The site object with current and published content
 * @returns ChangeInfo object with details about changes
 */
export function getChangeInfo(site: Site): ChangeInfo {
  const changedFields: string[] = [];

  if (site.status !== "published") {
    return {
      hasChanges: false,
      changedFields: [],
      summary: "Site is not published",
    };
  }

  // Check each content type
  if (site.htmlContent !== site.publishedHtmlContent) {
    changedFields.push("HTML");
  }
  if (site.cssContent !== site.publishedCssContent) {
    changedFields.push("CSS");
  }
  if (site.jsContent !== site.publishedJsContent) {
    changedFields.push("JavaScript");
  }

  const hasChanges = changedFields.length > 0;

  // Generate summary message
  let summary = "";
  if (hasChanges) {
    if (changedFields.length === 1) {
      summary = `${changedFields[0]} içeriği değişti`;
    } else if (changedFields.length === 2) {
      summary = `${changedFields[0]} ve ${changedFields[1]} içerikleri değişti`;
    } else {
      summary = "Site içeriği değişti";
    }
  } else {
    summary = "Yayınlanan site güncel";
  }

  return {
    hasChanges,
    changedFields,
    summary,
  };
}

/**
 * Detailed diff item for displaying changes
 */
export interface DiffItem {
  field: string;
  label: string;
  oldValue: string;
  newValue: string;
}

/**
 * Gets a user-friendly change summary for CV content
 * Compares current cvContent with published snapshot to detect data changes
 * @param site - The site object
 * @returns Array of change descriptions
 */
export function getCvContentChanges(site: Site): string[] {
  const changes: string[] = [];

  if (site.status !== "published" || !site.publishedCvContent) {
    return changes;
  }

  const current = site.cvContent || {};
  const published = site.publishedCvContent || {};

  // Check personal info changes
  const currentInfo = current.personalInfo || {};
  const publishedInfo = published.personalInfo || {};

  if (currentInfo.name !== publishedInfo.name) {
    changes.push("İsim değişti");
  }
  if (currentInfo.jobTitle !== publishedInfo.jobTitle) {
    changes.push("Meslek ünvanı değişti");
  }
  if (currentInfo.email !== publishedInfo.email) {
    changes.push("E-posta değişti");
  }
  if (currentInfo.phone !== publishedInfo.phone) {
    changes.push("Telefon değişti");
  }

  // Check sections
  if (JSON.stringify(current.experience) !== JSON.stringify(published.experience)) {
    changes.push("İş deneyimi güncellendi");
  }
  if (JSON.stringify(current.education) !== JSON.stringify(published.education)) {
    changes.push("Eğitim bilgileri güncellendi");
  }
  if (JSON.stringify(current.skills) !== JSON.stringify(published.skills)) {
    changes.push("Yetenekler güncellendi");
  }
  if (JSON.stringify(current.portfolio) !== JSON.stringify(published.portfolio)) {
    changes.push("Portfolyo güncellendi");
  }
  if (JSON.stringify(current.languages) !== JSON.stringify(published.languages)) {
    changes.push("Dil bilgileri güncellendi");
  }

  return changes;
}

/**
 * Extracts visible text content from HTML for comparison
 * @param html - HTML string
 * @returns Extracted text content
 */
function extractTextFromHtml(html: string): string {
  if (!html) return "";
  // Remove script and style tags completely
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Decode HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  // Normalize whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

/**
 * Calculates similarity percentage between two strings
 * @param str1 - First string
 * @param str2 - Second string
 * @returns Similarity percentage (0-100)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  if (len1 === 0 && len2 === 0) return 100;
  if (len1 === 0 || len2 === 0) return 0;
  
  const maxLen = Math.max(len1, len2);
  const minLen = Math.min(len1, len2);
  
  // Simple similarity based on length difference
  return Math.round((minLen / maxLen) * 100);
}

/**
 * Gets detailed diff information including HTML content changes
 * Shows old vs new values for changed fields and HTML text content
 * @param site - The site object
 * @returns Array of DiffItem objects
 */
export function getDetailedDiff(site: Site): DiffItem[] {
  const diffs: DiffItem[] = [];

  if (site.status !== "published") {
    return diffs;
  }

  // Check HTML content changes (for design changes)
  if (site.htmlContent !== site.publishedHtmlContent) {
    const currentText = extractTextFromHtml(site.htmlContent || "");
    const publishedText = extractTextFromHtml(site.publishedHtmlContent || "");
    
    // If text content is similar but HTML is different, it's a design change
    const similarity = calculateSimilarity(currentText, publishedText);
    
    if (similarity > 90) {
      diffs.push({
        field: "design",
        label: "Tasarım",
        oldValue: "Önceki tasarım",
        newValue: "Yeni tasarım uygulandı",
      });
    } else {
      // Text content also changed
      const oldPreview = publishedText.substring(0, 100) + (publishedText.length > 100 ? "..." : "");
      const newPreview = currentText.substring(0, 100) + (currentText.length > 100 ? "..." : "");
      
      diffs.push({
        field: "content",
        label: "İçerik",
        oldValue: oldPreview || "-",
        newValue: newPreview || "-",
      });
    }
  }

  // Check CSS changes
  if (site.cssContent !== site.publishedCssContent) {
    diffs.push({
      field: "css",
      label: "Stil (CSS)",
      oldValue: "Önceki stiller",
      newValue: "Yeni stiller uygulandı",
    });
  }

  // Check JS changes
  if (site.jsContent !== site.publishedJsContent) {
    diffs.push({
      field: "js",
      label: "JavaScript",
      oldValue: "Önceki kod",
      newValue: "Yeni kod uygulandı",
    });
  }

  // If no published CV content exists, skip CV comparison
  if (!site.publishedCvContent) {
    return diffs;
  }

  const current = site.cvContent || {};
  const published = site.publishedCvContent || {};

  // Check personal info changes
  const currentInfo = current.personalInfo || {};
  const publishedInfo = published.personalInfo || {};

  if (currentInfo.name !== publishedInfo.name) {
    diffs.push({
      field: "name",
      label: "İsim",
      oldValue: publishedInfo.name || "-",
      newValue: currentInfo.name || "-",
    });
  }
  if (currentInfo.jobTitle !== publishedInfo.jobTitle) {
    diffs.push({
      field: "jobTitle",
      label: "Meslek Ünvanı",
      oldValue: publishedInfo.jobTitle || "-",
      newValue: currentInfo.jobTitle || "-",
    });
  }
  if (currentInfo.email !== publishedInfo.email) {
    diffs.push({
      field: "email",
      label: "E-posta",
      oldValue: publishedInfo.email || "-",
      newValue: currentInfo.email || "-",
    });
  }
  if (currentInfo.phone !== publishedInfo.phone) {
    diffs.push({
      field: "phone",
      label: "Telefon",
      oldValue: publishedInfo.phone || "-",
      newValue: currentInfo.phone || "-",
    });
  }
  if (currentInfo.location !== publishedInfo.location) {
    diffs.push({
      field: "location",
      label: "Konum",
      oldValue: publishedInfo.location || "-",
      newValue: currentInfo.location || "-",
    });
  }

  // Check social links
  if (currentInfo.linkedin !== publishedInfo.linkedin) {
    diffs.push({
      field: "linkedin",
      label: "LinkedIn",
      oldValue: publishedInfo.linkedin || "-",
      newValue: currentInfo.linkedin || "-",
    });
  }
  if (currentInfo.github !== publishedInfo.github) {
    diffs.push({
      field: "github",
      label: "GitHub",
      oldValue: publishedInfo.github || "-",
      newValue: currentInfo.github || "-",
    });
  }

  // Check summary
  if (current.summary !== published.summary) {
    const oldSummary = published.summary || "-";
    const newSummary = current.summary || "-";
    diffs.push({
      field: "summary",
      label: "Özet",
      oldValue: oldSummary.length > 100 ? oldSummary.substring(0, 100) + "..." : oldSummary,
      newValue: newSummary.length > 100 ? newSummary.substring(0, 100) + "..." : newSummary,
    });
  }

  // Check sections (count changes)
  const currentExpCount = (current.experience || []).length;
  const publishedExpCount = (published.experience || []).length;
  if (currentExpCount !== publishedExpCount) {
    diffs.push({
      field: "experience",
      label: "İş Deneyimi Sayısı",
      oldValue: `${publishedExpCount} adet`,
      newValue: `${currentExpCount} adet`,
    });
  }

  const currentEduCount = (current.education || []).length;
  const publishedEduCount = (published.education || []).length;
  if (currentEduCount !== publishedEduCount) {
    diffs.push({
      field: "education",
      label: "Eğitim Sayısı",
      oldValue: `${publishedEduCount} adet`,
      newValue: `${currentEduCount} adet`,
    });
  }

  const currentSkillsCount = (current.skills || []).length;
  const publishedSkillsCount = (published.skills || []).length;
  if (currentSkillsCount !== publishedSkillsCount) {
    diffs.push({
      field: "skills",
      label: "Yetenek Sayısı",
      oldValue: `${publishedSkillsCount} adet`,
      newValue: `${currentSkillsCount} adet`,
    });
  }

  const currentPortCount = (current.portfolio || []).length;
  const publishedPortCount = (published.portfolio || []).length;
  if (currentPortCount !== publishedPortCount) {
    diffs.push({
      field: "portfolio",
      label: "Portfolyo Öğesi Sayısı",
      oldValue: `${publishedPortCount} adet`,
      newValue: `${currentPortCount} adet`,
    });
  }

  return diffs;
}

/**
 * Generates a complete change summary for display
 * @param site - The site object
 * @returns Formatted change summary string
 */
export function getChangeSummary(site: Site): string {
  const changeInfo = getChangeInfo(site);
  
  if (!changeInfo.hasChanges) {
    return "Yayınlanan site güncel";
  }

  const cvChanges = getCvContentChanges(site);
  
  if (cvChanges.length > 0) {
    return `${cvChanges.length} değişiklik: ${cvChanges.slice(0, 3).join(", ")}${cvChanges.length > 3 ? "..." : ""}`;
  }

  return changeInfo.summary;
}

/**
 * Checks if site needs republishing
 * Returns true if published and has changes
 * @param site - The site object
 * @returns true if republish is recommended
 */
export function needsRepublish(site: Site): boolean {
  return site.status === "published" && hasUnpublishedChanges(site);
}

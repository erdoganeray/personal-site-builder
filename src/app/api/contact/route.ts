import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Rate limiting store (in-memory, simple approach)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Validation schema
const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message is too long'),
    siteOwnerEmail: z.string().email('Invalid site owner email'),
    honeypot: z.string().optional(), // Bot trap
});

export async function POST(request: NextRequest) {
    try {
        // 1. Rate limiting check
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const now = Date.now();
        const rateLimit = rateLimitStore.get(ip);

        if (rateLimit && rateLimit.resetTime > now) {
            if (rateLimit.count >= 5) {
                return NextResponse.json(
                    { error: 'Too many requests. Please try again later.' },
                    { status: 429 }
                );
            }
            rateLimit.count++;
        } else {
            rateLimitStore.set(ip, { count: 1, resetTime: now + 3600000 }); // 1 hour
        }

        // 2. Parse and validate request body
        const body = await request.json();

        // 3. Honeypot check (if filled, it's a bot)
        if (body.honeypot && body.honeypot.trim() !== '') {
            console.log('[Contact API] Bot detected via honeypot');
            return NextResponse.json({ success: true }); // Fake success for bots
        }

        const validatedData = contactSchema.parse(body);

        // 4. Initialize Resend
        const resendApiKey = process.env.RESEND_API_KEY;

        if (!resendApiKey) {
            console.error('[Contact API] RESEND_API_KEY not found in environment variables');
            return NextResponse.json(
                { error: 'Email service is not configured. Please contact the administrator.' },
                { status: 500 }
            );
        }

        const resend = new Resend(resendApiKey);

        // 5. Send email
        const { data, error } = await resend.emails.send({
            from: 'Contact Form <onboarding@resend.dev>', // Using Resend test domain
            to: validatedData.siteOwnerEmail,
            replyTo: validatedData.email,
            subject: `New Contact Form Message from ${validatedData.name}`,
            html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #555; }
              .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">📧 New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">From:</div>
                  <div class="value">${validatedData.name}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${validatedData.email}">${validatedData.email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${validatedData.message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="footer">
                  <p>This email was sent from your personal website contact form.</p>
                  <p>You can reply directly to this email to respond to ${validatedData.name}.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
        });

        if (error) {
            console.error('[Contact API] Resend error:', error);
            return NextResponse.json(
                { error: 'Failed to send email. Please try again later.' },
                { status: 500 }
            );
        }

        console.log('[Contact API] Email sent successfully:', data?.id);
        return NextResponse.json({
            success: true,
            messageId: data?.id
        });

    } catch (error) {
        console.error('[Contact API] Error:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid form data',
                    details: error.issues.map((issue) => ({ field: issue.path.join('.'), message: issue.message }))
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        );
    }
}

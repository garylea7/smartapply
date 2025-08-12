import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || 'noreply@smartapply.ai',
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export function generateMagicLinkEmail(email: string, magicLink: string): string {
  const brandName = process.env.BRAND_NAME || 'SmartApply';
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Magic Link Sign In</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .button {
            display: inline-block;
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
          }
          .button:hover {
            background: #2563eb;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            font-size: 14px;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <h2>Welcome to ${brandName}!</h2>
        <p>Click the button below to sign in to your account:</p>
        <p style="margin: 30px 0;">
          <a href="${magicLink}" class="button">Sign In</a>
        </p>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all;">${magicLink}</p>
        <p>This link will expire in 15 minutes for security reasons.</p>
        <div class="footer">
          <p>If you didn't request this email, you can safely ignore it.</p>
          <p>© 2024 ${brandName}. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;
}
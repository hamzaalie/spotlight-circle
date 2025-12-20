import { NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      )
    }

    // Send test email
    const result = await sendEmail({
      to: email,
      subject: "Test Email from Spotlight Circle",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
              .success { background: #d1fae5; border: 2px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Email Test Successful!</h1>
              </div>
              <div class="content">
                <div class="success">
                  <strong>✅ Resend API is working correctly!</strong>
                </div>
                <p>Hello!</p>
                <p>This is a test email from your Spotlight Circle application. If you're seeing this message, it means:</p>
                <ul>
                  <li>Your Resend API key is configured correctly</li>
                  <li>Email sending functionality is operational</li>
                  <li>Partner invitation emails will work</li>
                  <li>Notification emails are ready to send</li>
                </ul>
                <p>You can now use all email features in your application including:</p>
                <ul>
                  <li>Partner invitations</li>
                  <li>Referral notifications</li>
                  <li>Welcome emails</li>
                  <li>Contact form responses</li>
                </ul>
                <p>Happy networking!</p>
                <p><strong>- The Spotlight Circle Team</strong></p>
              </div>
              <div class="footer">
                <p>This is an automated test email from Spotlight Circle</p>
                <p>Powered by Resend</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully! Check your inbox.",
        emailId: result.data?.id,
        from: process.env.EMAIL_FROM || 'noreply@spotlightcircles.com',
        to: email,
      })
    } else {
      console.error("Email send failed:", result.error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to send email",
          details: result.error,
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Test email error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send test email",
        message: error.message,
      },
      { status: 500 }
    )
  }
}


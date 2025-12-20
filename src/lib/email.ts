import { Resend } from 'resend'
import { prisma } from './prisma'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  const from = process.env.EMAIL_FROM || 'noreply@spotlightcircles.com'
  const textContent = text || html.replace(/<[^>]*>/g, '')
  
  // Create email log entry
  const emailLog = await prisma.emailLog.create({
    data: {
      to,
      from,
      subject,
      htmlBody: html,
      textBody: textContent,
      status: 'PENDING',
    },
  })

  try {
    const result = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text: textContent,
    })
    
    console.log('Email sent successfully:', result)
    
    // Update log with success status
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'SENT',
        resendId: result.data?.id || null,
        sentAt: new Date(),
      },
    })
    
    return { success: true, data: result, logId: emailLog.id }
  } catch (error: any) {
    console.error('Email send error:', error)
    
    // Update log with error
    await prisma.emailLog.update({
      where: { id: emailLog.id },
      data: {
        status: 'FAILED',
        error: error.message || 'Unknown error',
      },
    })
    
    return { success: false, error, logId: emailLog.id }
  }
}

export function getPartnerInvitationEmail(
  senderName: string,
  inviteLink: string
): { subject: string; html: string } {
  const subject = `${senderName} invited you to join their Spotlight Circle`
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You're Invited!</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p><strong>${senderName}</strong> has invited you to join their professional referral network on <strong>Spotlight Circles</strong>.</p>
            <p>By accepting this invitation, you'll be able to:</p>
            <ul>
              <li>Exchange referrals with trusted professionals</li>
              <li>Grow your network across industries</li>
              <li>Track referral outcomes and analytics</li>
              <li>Build your own circle of partners</li>
            </ul>
            <center>
              <a href="${inviteLink}" class="button">Accept Invitation</a>
            </center>
            <p>If you have any questions, feel free to reach out to ${senderName} directly.</p>
            <p>Best regards,<br>The Spotlight Circles Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spotlight Circles. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
  return { subject, html }
}

export function getReferralNotificationEmail(
  receiverName: string,
  senderName: string,
  clientName: string,
  clientEmail: string,
  clientNotes?: string
): { subject: string; html: string } {
  const subject = `New Referral from ${senderName}`
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .info-box { background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Referral Received!</h1>
          </div>
          <div class="content">
            <p>Hi ${receiverName},</p>
            <p><strong>${senderName}</strong> has sent you a new referral through Spotlight Circles.</p>
            <div class="info-box">
              <h3>Client Information:</h3>
              <p><strong>Name:</strong> ${clientName}</p>
              <p><strong>Email:</strong> ${clientEmail}</p>
              ${clientNotes ? `<p><strong>Notes:</strong> ${clientNotes}</p>` : ''}
            </div>
            <p>Please reach out to this client as soon as possible. Remember to update the referral status in your dashboard.</p>
            <p>Best regards,<br>The Spotlight Circles Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spotlight Circles. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
  return { subject, html }
}

export function getSubscriptionConfirmationEmail(
  userName: string,
  plan: string,
  amount: number
): { subject: string; html: string } {
  const planName = plan === 'annual' ? 'Annual' : 'Monthly'
  const subject = `Payment Confirmed - Welcome to Spotlight Circles ${planName} Plan!`
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4a90a4 0%, #f5c563 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: #4a90a4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .info-box { background: #f0f7f9; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #4a90a4; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .checkmark { color: #10b981; font-size: 48px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="checkmark">✓</div>
            <h1>Payment Successful!</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Thank you for subscribing to Spotlight Circles! Your payment has been processed successfully.</p>
            <div class="info-box">
              <h3>Subscription Details:</h3>
              <p><strong>Plan:</strong> ${planName} Plan</p>
              <p><strong>Amount:</strong> $${(amount / 100).toFixed(2)} ${plan === 'annual' ? '/year' : '/month'}</p>
              <p><strong>Status:</strong> Active</p>
            </div>
            <p>Your account is now fully activated and you have access to all premium features!</p>
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
            </center>
            <p>If you have any questions, please don't hesitate to reach out to our support team.</p>
            <p>Best regards,<br>The Spotlight Circles Team</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Spotlight Circles. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
  return { subject, html }
}

export function getWelcomeEmail(
  userName: string,
  plan: string
): { subject: string; html: string } {
  const subject = `Welcome to Spotlight Circles! Let's Get Started 🚀`
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4a90a4 0%, #f5c563 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
          .button { display: inline-block; background: #4a90a4; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .step { background: #f0f7f9; padding: 15px; border-radius: 6px; margin: 10px 0; }
          .step-number { display: inline-block; width: 30px; height: 30px; background: #4a90a4; color: white; border-radius: 50%; text-align: center; line-height: 30px; margin-right: 10px; font-weight: bold; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Spotlight Circles! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>We're thrilled to have you on board! You're now part of a growing community of professionals who are building powerful referral networks.</p>
            
            <h2 style="color: #4a90a4; margin-top: 30px;">Get Started in 3 Easy Steps:</h2>
            
            <div class="step">
              <span class="step-number">1</span>
              <strong>Complete Your Profile</strong>
              <p style="margin: 5px 0 0 40px;">Add your bio, services, and contact information to make a great first impression.</p>
            </div>
            
            <div class="step">
              <span class="step-number">2</span>
              <strong>Invite Your First Partners</strong>
              <p style="margin: 5px 0 0 40px;">Connect with professionals in complementary fields to start exchanging referrals.</p>
            </div>
            
            <div class="step">
              <span class="step-number">3</span>
              <strong>Send Your First Referral</strong>
              <p style="margin: 5px 0 0 40px;">Start growing your network's businesses by sending quality referrals!</p>
            </div>
            
            <center>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/onboarding" class="button">Complete Your Profile</a>
            </center>
            
            <h3 style="color: #4a90a4; margin-top: 30px;">What You Get:</h3>
            <ul>
              <li>✅ Unlimited partner invitations</li>
              <li>✅ Unlimited referral exchanges</li>
              <li>✅ QR code & shareable links</li>
              <li>✅ Analytics dashboard</li>
              <li>✅ AI-powered bio generator</li>
              <li>✅ Marketing tools</li>
              ${plan === 'annual' ? '<li>✅ Priority support</li><li>✅ Advanced analytics</li>' : ''}
            </ul>
            
            <p style="margin-top: 30px;">Need help getting started? Reply to this email and we'll be happy to assist you!</p>
            
            <p>Here's to your success! 🚀</p>
            <p>Best regards,<br>The Spotlight Circles Team</p>
          </div>
          <div class="footer">
            <p>Questions? Contact us at support@spotlightcircles.com</p>
            <p>&copy; ${new Date().getFullYear()} Spotlight Circles. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `
  return { subject, html }
}

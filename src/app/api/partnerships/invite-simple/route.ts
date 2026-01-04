import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { firstName, lastName, email, subject, message } = await req.json()

    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    // Get sender's profile
    const senderProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!senderProfile) {
      return NextResponse.json(
        { error: "Please complete your profile first" },
        { status: 400 }
      )
    }

    // Check if recipient user exists
    const recipientUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Check for existing partnership invitation to this email
    const existingInvite = await prisma.partnership.findFirst({
      where: {
        initiatorId: session.user.id,
        invitedEmail: email.toLowerCase(),
      },
    })

    if (existingInvite) {
      return NextResponse.json(
        { error: "You've already sent an invitation to this email" },
        { status: 400 }
      )
    }

    // Create partnership record
    const partnership = await prisma.partnership.create({
      data: {
        initiatorId: session.user.id,
        receiverId: recipientUser?.id || null,
        invitedEmail: email.toLowerCase(),
        category: "Professional", // Default category for simple invite
        status: "PENDING",
      },
    })

    // Generate invite link
    const inviteLink = `${process.env.NEXTAUTH_URL}/invite/${partnership.id}`
    
    // Replace [link] placeholder with actual link in the message
    const finalMessage = message.replace(/\[link\]/g, inviteLink)

    // Send email directly using Resend (same as working endpoints)
    try {
      console.log(`Attempting to send email to: ${email}`)
      console.log(`Using API Key: ${process.env.RESEND_API_KEY?.substring(0, 15)}...`)
      
      const emailResult = await resend.emails.send({
        from: 'Spotlight Circles <noreply@spotlightcircles.com>',
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Spotlight Circles</h1>
            </div>
            
            <div style="padding: 30px; background: white;">
              <div style="white-space: pre-wrap; color: #374151; font-size: 15px;">
${finalMessage}
              </div>
            </div>
            
            <div style="padding: 20px; background: #f9fafb; text-align: center; border-top: 1px solid #e5e7eb;">
              <a href="${inviteLink}" style="display: inline-block; background: #f59e0b; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 10px 0;">
                Accept Invitation
              </a>
              <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
                This invitation was sent via Spotlight Circles
              </p>
            </div>
          </div>
        `,
      })

      console.log("Email API Response:", JSON.stringify(emailResult, null, 2))
      
      if (emailResult.error) {
        throw new Error(emailResult.error.message || 'Email sending failed')
      }
      
      // Log email in database
      await prisma.emailLog.create({
        data: {
          to: email,
          from: 'noreply@spotlightcircles.com',
          subject: subject,
          htmlBody: finalMessage,
          textBody: finalMessage,
          status: "SENT",
          resendId: emailResult.data?.id || null,
          sentAt: new Date(),
        },
      })

    } catch (emailError: any) {
      console.error("Email sending failed:", emailError)
      
      // Log failed email
      await prisma.emailLog.create({
        data: {
          to: email,
          from: 'noreply@spotlightcircles.com',
          subject: subject,
          htmlBody: finalMessage,
          textBody: finalMessage,
          status: "FAILED",
          error: emailError.message || 'Unknown error',
        },
      })
      
      return NextResponse.json({
        success: false,
        error: "Failed to send email invitation",
        details: emailError.message,
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Invitation sent successfully",
      partnershipId: partnership.id,
    })

  } catch (error: any) {
    console.error("Error sending simple invite:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send invitation" },
      { status: 500 }
    )
  }
}

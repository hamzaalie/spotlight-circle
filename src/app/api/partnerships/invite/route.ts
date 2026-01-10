import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { email, category, notes } = await req.json()

    if (!email || !category) {
      return NextResponse.json(
        { error: "Email and category are required" },
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

    // Prevent self-invitation
    if (session.user.email?.toLowerCase() === email.toLowerCase()) {
      return NextResponse.json(
        { error: "You cannot invite yourself as a partner" },
        { status: 400 }
      )
    }

    // Check if recipient user exists
    const recipientUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
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

    let partnership

    if (!recipientUser) {
      // User doesn't exist yet - create invitation with email only
      partnership = await prisma.partnership.create({
        data: {
          initiatorId: session.user.id,
          invitedEmail: email.toLowerCase(),
          category,
          notes: notes || null,
          status: "PENDING",
        },
      })

      // Send invitation email to non-registered user
      await sendEmail({
        to: email,
        subject: `${senderProfile.firstName} ${senderProfile.lastName} invited you to join Spotlight Circle`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
            <p>Hi there,</p>
            
            <p>It's ${senderProfile.firstName}, from ${senderProfile.profession}. Clients often ask me for referrals I trust—and you're someone I'm always comfortable recommending.</p>
            
            <p>I've joined Spotlight Circles, a private referral platform for trusted, non-competing professionals. It simply formalizes the kind of referrals we already give—no ads, no selling, just trusted introductions.</p>
            
            <p>I'd like to include you in my personal referral circle.</p>
            
            <p><strong>You can learn more here:</strong><br/>
            <a href="https://www.spotlightcircles.com" style="color: #7c3aed;">www.spotlightcircles.com</a></p>
            
            <p><strong>To accept my invitation:</strong></p>
            <p>
              <a href="${process.env.NEXTAUTH_URL}/auth/signup?email=${encodeURIComponent(email)}&invited_by=${senderProfile.userId}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Accept Invitation
              </a>
            </p>
            
            <p>No obligation—just an easy way to share and receive referrals.</p>
            
            <p>Best,<br/>
            ${senderProfile.firstName} ${senderProfile.lastName}</p>
            
            <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
              — Sent via Spotlight Circles
            </p>
          </div>
        `,
      })
    } else {
      // User exists - check for duplicate partnership
      if (recipientUser.id === session.user.id) {
        return NextResponse.json(
          { error: "You cannot invite yourself" },
          { status: 400 }
        )
      }

      const existingPartnership = await prisma.partnership.findFirst({
        where: {
          OR: [
            { initiatorId: session.user.id, receiverId: recipientUser.id },
            { initiatorId: recipientUser.id, receiverId: session.user.id },
          ],
        },
      })

      if (existingPartnership) {
        // If partnership is ACCEPTED, don't allow duplicate
        if (existingPartnership.status === "ACCEPTED") {
          return NextResponse.json(
            { error: "You already have an active partnership with this user" },
            { status: 400 }
          )
        }
        
        // If partnership is PENDING, don't allow duplicate
        if (existingPartnership.status === "PENDING") {
          return NextResponse.json(
            { error: "Partnership invitation already pending for this user" },
            { status: 400 }
          )
        }
        
        // If it was DECLINED, update it to PENDING and resend
        if (existingPartnership.status === "DECLINED") {
          partnership = await prisma.partnership.update({
            where: { id: existingPartnership.id },
            data: {
              initiatorId: session.user.id,
              receiverId: recipientUser.id,
              status: "PENDING",
              category,
              notes: notes || null,
              updatedAt: new Date(),
            },
          })
          
          // Send email notification
          if (recipientUser.profile) {
            await sendEmail({
              to: email,
              subject: `${senderProfile.firstName} ${senderProfile.lastName} invited you to join their referral circle`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                  <p>Hi ${recipientUser.profile.firstName},</p>
                  
                  <p>It's ${senderProfile.firstName}, from ${senderProfile.profession}. Clients often ask me for referrals I trust—and you're someone I'm always comfortable recommending.</p>
                  
                  <p>I've joined Spotlight Circles, a private referral platform for trusted, non-competing professionals. It simply formalizes the kind of referrals we already give—no ads, no selling, just trusted introductions.</p>
                  
                  <p>I'd like to include you in my personal referral circle.</p>
                  
                  <p><strong>You can learn more here:</strong><br/>
                  <a href="https://www.spotlightcircles.com" style="color: #7c3aed;">www.spotlightcircles.com</a></p>
                  
                  <p><strong>To accept my invitation:</strong></p>
                  <p style="margin: 20px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/invite/${partnership.id}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Accept Invitation
                    </a>
                  </p>
                  
                  <p>No obligation—just an easy way to share and receive referrals.</p>
                  
                  <p>Best,<br/>
                  ${senderProfile.firstName} ${senderProfile.lastName}</p>
                  
                  <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                    — Sent via Spotlight Circles
                  </p>
                </div>
              `,
            })
          }
          
          return NextResponse.json({ partnership })
        }
      }

      // Create partnership invitation
      partnership = await prisma.partnership.create({
        data: {
          initiatorId: session.user.id,
          receiverId: recipientUser.id,
          invitedEmail: email.toLowerCase(),
          category,
          notes: notes || null,
          status: "PENDING",
        },
      })

      // Send email notification to existing user
      if (recipientUser.profile) {
        await sendEmail({
          to: email,
          subject: `${senderProfile.firstName} ${senderProfile.lastName} invited you to join their referral circle`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.6;">
              <p>Hi ${recipientUser.profile.firstName},</p>
              
              <p>It's ${senderProfile.firstName}, from ${senderProfile.profession}. Clients often ask me for referrals I trust—and you're someone I'm always comfortable recommending.</p>
              
              <p>I've joined Spotlight Circles, a private referral platform for trusted, non-competing professionals. It simply formalizes the kind of referrals we already give—no ads, no selling, just trusted introductions.</p>
              
              <p>I'd like to include you in my personal referral circle.</p>
              
              <p><strong>You can learn more here:</strong><br/>
              <a href="https://www.spotlightcircles.com" style="color: #7c3aed;">www.spotlightcircles.com</a></p>
              
              <p><strong>To accept my invitation:</strong></p>
              <p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/partners" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Accept Invitation
                </a>
              </p>
              
              <p>No obligation—just an easy way to share and receive referrals.</p>
              
              <p>Best,<br/>
              ${senderProfile.firstName} ${senderProfile.lastName}</p>
              
              <p style="color: #6b7280; font-size: 12px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px;">
                — Sent via Spotlight Circles
              </p>
            </div>
          `,
        })
      }
    }

    return NextResponse.json({
      message: recipientUser 
        ? "Invitation sent successfully" 
        : "Invitation sent! They'll receive an email to join Spotlight Circle.",
      partnershipId: partnership.id,
    })
  } catch (error: any) {
    console.error("Partnership invitation error:", error)
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    )
  }
}


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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #7c3aed;">You're Invited to Spotlight Circle!</h2>
            <p>Hi there,</p>
            <p><strong>${senderProfile.firstName} ${senderProfile.lastName}</strong> (${senderProfile.profession}) wants to partner with you on Spotlight Circle - a professional referral network.</p>
            
            ${notes ? `<p style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">"${notes}"</p>` : ''}
            
            <p><strong>Category:</strong> ${category}</p>
            
            <p>Spotlight Circle helps professionals like you exchange quality referrals and grow your business together.</p>
            
            <p><strong>Create your free account to accept this invitation:</strong></p>
            <p>
              <a href="${process.env.NEXTAUTH_URL}/auth/signup?email=${encodeURIComponent(email)}&invited_by=${senderProfile.userId}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Join Spotlight Circle
              </a>
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Once you create your account and complete your profile, you'll be able to connect with ${senderProfile.firstName} and start exchanging referrals.
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
              subject: `${senderProfile.firstName} ${senderProfile.lastName} wants to partner with you!`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #7c3aed;">Partnership Invitation</h2>
                  <p>Hi ${recipientUser.profile.firstName},</p>
                  <p><strong>${senderProfile.firstName} ${senderProfile.lastName}</strong> (${senderProfile.profession}) has invited you to join their referral network on Spotlight Circle!</p>
                  
                  ${notes ? `<p style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">"${notes}"</p>` : ''}
                  
                  <p style="margin: 30px 0;">
                    <a href="${process.env.NEXTAUTH_URL}/invite/${partnership.id}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      View Invitation
                    </a>
                  </p>
                  
                  <p style="color: #6b7280; font-size: 14px;">
                    Category: ${category}
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
          subject: `${senderProfile.firstName} ${senderProfile.lastName} wants to partner with you!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">Partnership Invitation</h2>
              <p>Hi ${recipientUser.profile.firstName},</p>
              <p><strong>${senderProfile.firstName} ${senderProfile.lastName}</strong> (${senderProfile.profession}) has invited you to join their referral network on Spotlight Circle!</p>
              
              ${notes ? `<p style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">"${notes}"</p>` : ''}
              
              <p><strong>Category:</strong> ${category}</p>
              
              <p>Log in to your account to accept or decline this invitation:</p>
              <p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/partners" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Invitation
                </a>
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Building your referral network helps you exchange quality leads and grow your business together.
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


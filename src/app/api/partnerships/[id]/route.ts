import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get partnership with initiator profile details
    const partnership = await prisma.partnership.findUnique({
      where: { id: params.id },
      include: {
        initiator: { 
          include: { 
            profile: {
              select: {
                firstName: true,
                lastName: true,
                profession: true,
                companyName: true,
                photo: true,
              }
            }
          } 
        },
      },
    })

    if (!partnership) {
      return NextResponse.json(
        { error: "Partnership not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      partnership: {
        id: partnership.id,
        status: partnership.status,
        category: partnership.category,
        notes: partnership.notes,
        initiator: partnership.initiator.profile,
      }
    })
  } catch (error) {
    console.error("Get partnership error:", error)
    return NextResponse.json(
      { error: "Failed to get partnership" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { status } = await req.json()

    if (!["ACCEPTED", "DECLINED"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Get partnership with user details
    const partnership = await prisma.partnership.findUnique({
      where: { id: params.id },
      include: {
        initiator: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    })

    if (!partnership) {
      return NextResponse.json(
        { error: "Partnership not found" },
        { status: 404 }
      )
    }

    // Verify user is the receiver (either by ID or by email for pending invitations)
    const isReceiver = partnership.receiverId === session.user.id || 
                      partnership.invitedEmail === session.user.email

    if (!isReceiver) {
      return NextResponse.json(
        { error: "You can only respond to invitations sent to you" },
        { status: 403 }
      )
    }

    // Update partnership status and link receiver if this was a pending invitation
    const updatedPartnership = await prisma.partnership.update({
      where: { id: params.id },
      data: {
        status: status as any,
        receiverId: session.user.id, // Link the receiver ID if it wasn't already set
        updatedAt: new Date(),
      },
    })

    // If accepted, update analytics for both users
    if (status === "ACCEPTED") {
      await Promise.all([
        prisma.userAnalytics.upsert({
          where: { userId: partnership.initiatorId },
          update: { totalPartners: { increment: 1 } },
          create: { userId: partnership.initiatorId, totalPartners: 1 },
        }),
        prisma.userAnalytics.upsert({
          where: { userId: session.user.id },
          update: { totalPartners: { increment: 1 } },
          create: { userId: session.user.id, totalPartners: 1 },
        }),
      ])

      // Get receiver profile for email
      const receiverProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      })

      // Send acceptance email to initiator
      if (partnership.initiator.profile && receiverProfile) {
        await sendEmail({
          to: partnership.initiator.email,
          subject: `${receiverProfile.firstName} accepted your partnership invitation!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #10b981;">Partnership Accepted! 🎉</h2>
              <p>Great news, ${partnership.initiator.profile.firstName}!</p>
              <p><strong>${receiverProfile.firstName} ${receiverProfile.lastName}</strong> (${receiverProfile.profession}) has accepted your partnership invitation.</p>
              
              <p>You can now:</p>
              <ul>
                <li>Send referrals to each other</li>
                <li>Track your mutual business growth</li>
                <li>Build a stronger professional network together</li>
              </ul>
              
              <p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/partners" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Your Partners
                </a>
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Start exchanging referrals and growing your business together!
              </p>
            </div>
          `,
        })
      }
    } else if (status === "DECLINED") {
      // Get receiver profile for email
      const receiverProfile = await prisma.profile.findUnique({
        where: { userId: session.user.id },
      })

      // Send decline notification to initiator
      if (partnership.initiator.profile && receiverProfile) {
        await sendEmail({
          to: partnership.initiator.email,
          subject: `Partnership invitation update`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #6b7280;">Partnership Invitation</h2>
              <p>Hi ${partnership.initiator.profile.firstName},</p>
              <p>${receiverProfile.firstName} ${receiverProfile.lastName} has declined your partnership invitation at this time.</p>
              
              <p>Don't worry – you can continue building your network by inviting other professionals!</p>
              
              <p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard/partners/invite" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Invite More Partners
                </a>
              </p>
            </div>
          `,
        })
      }
    }

    return NextResponse.json({
      message: `Invitation ${status.toLowerCase()}`,
      partnership: updatedPartnership,
    })
  } catch (error: any) {
    console.error("Partnership update error:", error)
    return NextResponse.json(
      { error: "Failed to update partnership" },
      { status: 500 }
    )
  }
}

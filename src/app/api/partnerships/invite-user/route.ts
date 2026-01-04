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

    const { receiverUserId } = await req.json()

    if (!receiverUserId) {
      return NextResponse.json(
        { error: "Receiver user ID is required" },
        { status: 400 }
      )
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverUserId },
      include: { profile: true },
    })

    if (!receiver || !receiver.profile) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if partnership already exists
    const existingPartnership = await prisma.partnership.findFirst({
      where: {
        OR: [
          {
            initiatorId: session.user.id,
            receiverId: receiverUserId,
          },
          {
            initiatorId: receiverUserId,
            receiverId: session.user.id,
          },
        ],
      },
    })

    if (existingPartnership) {
      return NextResponse.json(
        { error: "Partnership invitation already exists or is active" },
        { status: 400 }
      )
    }

    // Create partnership invitation
    const partnership = await prisma.partnership.create({
      data: {
        initiatorId: session.user.id,
        receiverId: receiverUserId,
        status: "PENDING",
        category: receiver.profile.profession,
      },
      include: {
        initiator: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    })

    // Send email notification to receiver
    if (receiver.email && partnership.initiator.profile) {
      const initiatorName = `${partnership.initiator.profile.firstName} ${partnership.initiator.profile.lastName}`
      const initiatorProfession = partnership.initiator.profile.profession || "Professional"
      
      await sendEmail({
        to: receiver.email,
        subject: `${initiatorName} wants to connect with you on Spotlight Circles`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">New Partnership Request 🤝</h2>
            <p>Hi ${receiver.profile.firstName},</p>
            <p><strong>${initiatorName}</strong> (${initiatorProfession}) wants to connect with you on Spotlight Circles!</p>
            
            <div style="background: #f0fdfa; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0d9488;">
              <p style="margin: 0; color: #134e4a; font-weight: 500;">Why connect?</p>
              <ul style="margin: 10px 0; color: #134e4a;">
                <li>Exchange referrals and grow your business</li>
                <li>Build your professional network</li>
                <li>Track mutual business growth</li>
              </ul>
            </div>
            
            <p>
              <a href="${process.env.NEXTAUTH_URL}/dashboard/partners" style="background: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Partnership Request
              </a>
            </p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              You can accept or decline this request from your Partners dashboard.
            </p>
          </div>
        `,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Partnership invitation sent successfully",
      partnership,
    })
  } catch (error: any) {
    console.error("Invite user error:", error)
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    )
  }
}

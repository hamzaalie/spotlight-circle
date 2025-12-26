import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

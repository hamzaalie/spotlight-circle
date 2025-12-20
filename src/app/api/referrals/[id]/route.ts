import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

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

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const validStatuses = ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "LOST"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    // Find the referral and verify the user is the receiver
    const referral = await prisma.referral.findUnique({
      where: { id: params.id },
    })

    if (!referral) {
      return NextResponse.json(
        { error: "Referral not found" },
        { status: 404 }
      )
    }

    if (referral.receiverId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update referrals sent to you" },
        { status: 403 }
      )
    }

    // Update the referral
    const updateData: any = { status }

    // Set completedAt timestamp if status is COMPLETED
    if (status === "COMPLETED" && !referral.completedAt) {
      updateData.completedAt = new Date()
    }

    const updatedReferral = await prisma.referral.update({
      where: { id: params.id },
      data: updateData,
      include: {
        sender: {
          include: { profile: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      referral: updatedReferral,
    })
  } catch (error: any) {
    console.error("Error updating referral:", error)
    return NextResponse.json(
      { error: "Failed to update referral" },
      { status: 500 }
    )
  }
}

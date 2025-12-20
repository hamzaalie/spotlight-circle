import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      )
    }

    // Fetch the referral request
    const referralRequest = await prisma.referralRequest.findUnique({
      where: { id: requestId },
    })

    if (!referralRequest) {
      return NextResponse.json(
        { error: "Referral request not found" },
        { status: 404 }
      )
    }

    // Verify the current user is the profile owner
    if (referralRequest.profileOwnerId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to decline this request" },
        { status: 403 }
      )
    }

    // Update referral request status
    await prisma.referralRequest.update({
      where: { id: requestId },
      data: {
        status: "DECLINED",
      },
    })

    return NextResponse.json({
      success: true,
      message: "Referral request declined",
    })
  } catch (error: any) {
    console.error("Error declining referral request:", error)
    return NextResponse.json(
      { error: "Failed to decline referral request", details: error.message },
      { status: 500 }
    )
  }
}

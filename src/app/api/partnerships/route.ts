import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all accepted partnerships for this user
    const partnerships = await prisma.partnership.findMany({
      where: {
        OR: [
          { initiatorId: session.user.id },
          { receiverId: session.user.id },
        ],
        status: "ACCEPTED",
      },
      include: {
        initiator: {
          include: { profile: true },
        },
        receiver: {
          include: { profile: true },
        },
      },
    })

    // Format the partners list
    const partners = partnerships.map((partnership) => {
      const isInitiator = partnership.initiatorId === session.user.id
      const partnerUser = isInitiator ? (partnership as any).receiver : (partnership as any).initiator
      const profile = partnerUser.profile

      return {
        id: partnerUser.id,
        profile: {
          firstName: profile?.firstName || "",
          lastName: profile?.lastName || "",
          profession: profile?.profession || "",
          city: profile?.city || "",
          state: profile?.state || "",
        },
      }
    }).filter(partner => partner.profile.firstName) // Filter out partners without profiles

    return NextResponse.json({
      success: true,
      partners,
    })
  } catch (error: any) {
    console.error("Error fetching partnerships:", error)
    return NextResponse.json(
      { error: "Failed to fetch partnerships" },
      { status: 500 }
    )
  }
}


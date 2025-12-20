import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { profileSlug } = await req.json()

    if (!profileSlug) {
      return NextResponse.json(
        { error: "Profile slug is required" },
        { status: 400 }
      )
    }

    // Find the profile
    const profile = await prisma.profile.findFirst({
      where: { referralSlug: profileSlug },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Get the user's IP to find their most recent click
    const headersList = req.headers
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
      headersList.get("x-real-ip") ||
      "unknown"

    // Find the most recent click from this IP that hasn't converted yet
    const recentClick = await prisma.linkClick.findFirst({
      where: {
        profileId: profile.id,
        ipAddress: {
          startsWith: ipAddress.substring(0, 20), // Match IP prefix
        },
        converted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    if (recentClick) {
      // Mark as converted
      await prisma.linkClick.update({
        where: { id: recentClick.id },
        data: {
          converted: true,
          conversionDate: new Date(),
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Conversion tracking error:", error)
    return NextResponse.json(
      { error: "Failed to track conversion" },
      { status: 500 }
    )
  }
}


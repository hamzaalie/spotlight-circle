import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { template, customText, includeQR, includePhoto } = await req.json()

    // Get user profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: { email: true },
        },
      },
    })

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Generate QR code if requested
    let qrCodeDataUrl = null
    if (includeQR) {
      const profileUrl = `${process.env.NEXTAUTH_URL}/p/${profile.referralSlug}`
      qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
        width: 400,
        margin: 2,
        color: {
          dark: "#7c3aed", // Purple
          light: "#ffffff",
        },
      })
    }

    // Return poster data
    return NextResponse.json({
      success: true,
      posterData: {
        template,
        profile: {
          firstName: profile.firstName,
          lastName: profile.lastName,
          profession: profile.profession,
          companyName: profile.companyName,
          phone: profile.phone,
          website: profile.website,
          email: profile.user.email,
          photo: includePhoto ? profile.photo : null,
          city: profile.city,
          state: profile.state,
        },
        customText: customText || "",
        qrCode: qrCodeDataUrl,
        profileUrl: `${process.env.NEXTAUTH_URL}/p/${profile.referralSlug}`,
      },
    })
  } catch (error: any) {
    console.error("Poster generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate poster data" },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import QRCode from "qrcode"

function generateSlug(firstName: string, lastName: string): string {
  const base = `${firstName}-${lastName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  
  const random = Math.random().toString(36).substring(2, 6)
  return `${base}-${random}`
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      firstName,
      lastName,
      phone,
      photo,
      companyName,
      profession,
      categoryId,
      yearBusinessStarted,
      services,
      clientBaseSize,
      city,
      state,
      zipCode,
      latitude,
      longitude,
      biography,
      website,
    } = body

    // Check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 400 }
      )
    }

    // Generate unique referral slug
    const referralSlug = generateSlug(firstName, lastName)
    
    // Generate QR code
    const profileUrl = `${process.env.NEXTAUTH_URL}/p/${referralSlug}`
    const qrCodeDataUrl = await QRCode.toDataURL(profileUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: "#7c3aed", // purple-600
        light: "#ffffff",
      },
    })

    // Create profile
    const profile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        firstName,
        lastName,
        phone: phone || null,
        photo: photo || null,
        companyName: companyName || null,
        profession,
        categoryId: categoryId || null,
        yearBusinessStarted: yearBusinessStarted ? parseInt(yearBusinessStarted) : null,
        services,
        clientBaseSize: clientBaseSize ? parseInt(clientBaseSize) : null,
        city,
        state: state || null,
        zipCode,
        latitude,
        longitude,
        biography: biography || null,
        website: website || null,
        referralSlug,
        qrCodeUrl: qrCodeDataUrl,
      },
    })

    // Create analytics record
    await prisma.userAnalytics.create({
      data: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      message: "Profile created successfully",
      profile: {
        id: profile.id,
        referralSlug: profile.referralSlug,
      },
    })
  } catch (error: any) {
    console.error("Profile creation error:", error)
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const [user, profile] = await Promise.all([
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, role: true },
      }),
      prisma.profile.findUnique({
        where: { userId: session.user.id },
      }),
    ])

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      success: true,
      user,
      profile 
    })
  } catch (error: any) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      firstName,
      lastName,
      phone,
      photo,
      banner,
      website,
      city,
      state,
      zipCode,
      companyName,
      profession,
      categoryId,
      yearBusinessStarted,
      biography,
    } = await req.json()

    // Check if profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!existingProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        photo: photo || undefined,
        banner: banner || undefined,
        website: website || null,
        city,
        state: state || null,
        zipCode,
        companyName: companyName || null,
        profession,
        categoryId: categoryId || undefined,
        yearBusinessStarted: yearBusinessStarted ? parseInt(yearBusinessStarted) : undefined,
        biography: biography || null,
      },
    })

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    })
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { geocodeLocation } from "@/lib/geocoding"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { profileId, city, state, zipCode } = await req.json()

    // If profileId is provided, verify ownership
    if (profileId) {
      const profile = await prisma.profile.findUnique({
        where: { id: profileId },
        select: { userId: true },
      })

      if (!profile || profile.userId !== session.user.id) {
        return NextResponse.json(
          { error: "Profile not found or unauthorized" },
          { status: 404 }
        )
      }
    }

    // Geocode the location
    const result = await geocodeLocation(city, state, zipCode)

    if (!result) {
      return NextResponse.json(
        { error: "Could not geocode location" },
        { status: 400 }
      )
    }

    // Update profile with coordinates if profileId provided
    if (profileId) {
      await prisma.profile.update({
        where: { id: profileId },
        data: {
          latitude: result.latitude,
          longitude: result.longitude,
        },
      })
    }

    return NextResponse.json({
      success: true,
      latitude: result.latitude,
      longitude: result.longitude,
      formatted: result.formatted,
    })
  } catch (error: any) {
    console.error("Geocoding error:", error)
    return NextResponse.json(
      { error: "Failed to geocode location" },
      { status: 500 }
    )
  }
}

// Batch geocode all profiles (admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get all profiles without coordinates
    const profiles = await prisma.profile.findMany({
      where: {
        OR: [
          { latitude: null },
          { longitude: null },
        ],
      },
      select: {
        id: true,
        city: true,
        state: true,
        zipCode: true,
      },
    })

    let successCount = 0
    let errorCount = 0

    for (const profile of profiles) {
      try {
        const result = await geocodeLocation(
          profile.city,
          profile.state || undefined,
          profile.zipCode
        )

        if (result) {
          await prisma.profile.update({
            where: { id: profile.id },
            data: {
              latitude: result.latitude,
              longitude: result.longitude,
            },
          })
          successCount++
        } else {
          errorCount++
        }

        // Rate limiting delay (Nominatim requires 1 req/sec)
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Failed to geocode profile ${profile.id}:`, error)
        errorCount++
      }
    }

    return NextResponse.json({
      success: true,
      total: profiles.length,
      successCount,
      errorCount,
    })
  } catch (error: any) {
    console.error("Batch geocoding error:", error)
    return NextResponse.json(
      { error: "Failed to batch geocode profiles" },
      { status: 500 }
    )
  }
}


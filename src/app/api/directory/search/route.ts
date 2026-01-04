import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const profession = searchParams.get("profession")
    const state = searchParams.get("state")
    const city = searchParams.get("city")
    const zipCode = searchParams.get("zipCode")
    const search = searchParams.get("search")

    // Build where clause
    const where: any = {}

    if (profession && profession !== "all") {
      where.profession = profession
    }

    if (state && state !== "all") {
      where.state = state
    }

    if (city) {
      where.city = {
        contains: city,
        mode: "insensitive",
      }
    }

    if (zipCode) {
      where.zipCode = zipCode
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { profession: { contains: search, mode: "insensitive" } },
        { companyName: { contains: search, mode: "insensitive" } },
        { services: { contains: search, mode: "insensitive" } },
      ]
    }

    const professionals = await prisma.profile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    })

    return NextResponse.json({
      professionals,
      count: professionals.length,
    })
  } catch (error: any) {
    console.error("Directory search error:", error)
    return NextResponse.json(
      { error: "Failed to search directory" },
      { status: 500 }
    )
  }
}


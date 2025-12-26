import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/users - Get all users with filters
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (adminUser?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const role = searchParams.get("role")
    const hasProfile = searchParams.get("hasProfile")

    const where: any = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { profile: { firstName: { contains: search, mode: "insensitive" } } },
        { profile: { lastName: { contains: search, mode: "insensitive" } } },
      ]
    }

    if (role) {
      where.role = role
    }

    if (hasProfile !== null && hasProfile !== undefined) {
      where.hasProfile = hasProfile === "true"
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            profession: true,
            city: true,
            state: true,
            photo: true,
          },
        },
        _count: {
          select: {
            referralsSent: true,
            referralsReceived: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

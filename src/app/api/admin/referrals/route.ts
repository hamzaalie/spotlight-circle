import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

// GET /api/admin/referrals - Get all referrals with filters
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
    const status = searchParams.get("status")
    const dateRange = searchParams.get("dateRange")

    const where: any = {}

    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: "insensitive" } },
        { clientEmail: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (dateRange && dateRange !== "all") {
      const now = new Date()
      let startDate: Date

      switch (dateRange) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0))
          break
        case "week":
          startDate = new Date(now.setDate(now.getDate() - 7))
          break
        case "month":
          startDate = new Date(now.setMonth(now.getMonth() - 1))
          break
        default:
          startDate = new Date(0)
      }

      where.createdAt = { gte: startDate }
    }

    const referrals = await prisma.referral.findMany({
      where,
      include: {
        sender: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        receiver: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ referrals })
  } catch (error) {
    console.error("Error fetching referrals:", error)
    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    )
  }
}

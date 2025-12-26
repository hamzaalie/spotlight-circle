import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/users/[id] - Get user details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        profile: true,
        subscription: true,
        analytics: true,
        referralsSent: {
          include: {
            receiver: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        referralsReceived: {
          include: {
            sender: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            referralsSent: true,
            referralsReceived: true,
            partnersInitiated: true,
            partnersReceived: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users/[id] - Update user
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const body = await req.json()
    const { role, status } = body

    const updateData: any = {}

    if (role) {
      updateData.role = role
    }

    if (status !== undefined) {
      // For future implementation with status field
      // updateData.status = status
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        profile: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/[id] - Delete user
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Delete user and all related data (cascade)
    await prisma.user.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    )
  }
}

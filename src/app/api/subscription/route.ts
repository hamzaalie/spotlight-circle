import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ subscription })
  } catch (error: any) {
    console.error("Subscription fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    )
  }
}


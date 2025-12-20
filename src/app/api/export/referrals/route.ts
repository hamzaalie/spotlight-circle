import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const format = searchParams.get("format") || "csv" // csv or json
  const status = searchParams.get("status") // filter by status
  const startDate = searchParams.get("startDate") // YYYY-MM-DD
  const endDate = searchParams.get("endDate") // YYYY-MM-DD
  const type = searchParams.get("type") || "all" // sent, received, or all

  try {
    // Build query filters
    const where: any = {
      OR: [],
    }

    if (type === "sent") {
      where.OR.push({ senderId: session.user.id })
    } else if (type === "received") {
      where.OR.push({ receiverId: session.user.id })
    } else {
      where.OR.push(
        { senderId: session.user.id },
        { receiverId: session.user.id }
      )
    }

    if (status) {
      where.status = status
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        where.createdAt.gte = new Date(startDate)
      }
      if (endDate) {
        where.createdAt.lte = new Date(new Date(endDate).setHours(23, 59, 59))
      }
    }

    // Fetch referrals with partner information
    const referrals = await prisma.referral.findMany({
      where,
      include: {
        sender: {
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
              },
            },
          },
        },
        receiver: {
          include: {
            profile: {
              select: {
                firstName: true,
                lastName: true,
                companyName: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (format === "json") {
      return NextResponse.json({ referrals })
    }

    // Generate CSV
    const csvRows = [
      [
        "Date",
        "Type",
        "Client Name",
        "Client Email",
        "Client Phone",
        "Partner Name",
        "Partner Company",
        "Status",
        "Notes",
        "Completed Date",
      ].join(","),
    ]

    referrals.forEach((ref) => {
      const isSent = ref.senderId === session.user.id
      const partner = isSent ? ref.receiver : ref.sender
      const partnerProfile = partner.profile
      const partnerName = partnerProfile
        ? `${partnerProfile.firstName} ${partnerProfile.lastName}`
        : partner.email

      const row = [
        new Date(ref.createdAt).toLocaleDateString(),
        isSent ? "Sent" : "Received",
        `"${ref.clientName || ""}"`,
        `"${ref.clientEmail || ""}"`,
        `"${ref.clientPhone || ""}"`,
        `"${partnerName}"`,
        `"${partnerProfile?.companyName || ""}"`,
        ref.status,
        `"${(ref.clientNotes || "").replace(/"/g, '""')}"`,
        ref.completedAt ? new Date(ref.completedAt).toLocaleDateString() : "",
      ]

      csvRows.push(row.join(","))
    })

    const csv = csvRows.join("\n")

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="referrals-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export referrals" },
      { status: 500 }
    )
  }
}


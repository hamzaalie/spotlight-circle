import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

// GET - Get ticket details
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: {
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
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      )
    }

    // Check access - user can only see their own tickets, admins can see all
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    })

    if (ticket.userId !== session.user.id && user?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json({ ticket })
  } catch (error: any) {
    console.error("Fetch ticket error:", error)
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    )
  }
}

// POST - Add message to ticket
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { message, status } = await req.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: {
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
    })

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      )
    }

    // Check access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, email: true },
    })

    const isOwner = ticket.userId === session.user.id
    const isAdmin = user?.role === "ADMIN"

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Add message
    const ticketMessage = await prisma.ticketMessage.create({
      data: {
        ticketId: params.id,
        message,
        isStaff: isAdmin,
        authorEmail: user?.email || session.user.email || "",
        attachments: [],
      },
    })

    // Update ticket status if provided (admin only)
    if (status && isAdmin) {
      await prisma.ticket.update({
        where: { id: params.id },
        data: {
          status: status as any,
          ...(status === "RESOLVED" && { resolvedAt: new Date() }),
          ...(status === "CLOSED" && { closedAt: new Date() }),
        },
      })
    } else if (isOwner && ticket.status === "RESOLVED") {
      // If user replies to resolved ticket, reopen it
      await prisma.ticket.update({
        where: { id: params.id },
        data: {
          status: "OPEN",
          resolvedAt: null,
        },
      })
    }

    // Send email notification
    const recipientEmail = isAdmin ? ticket.user.email : (process.env.SUPPORT_EMAIL || "support@spotlightcircles.com")
    const recipientName = isAdmin 
      ? `${ticket.user.profile?.firstName || "User"}`
      : "Support Team"

    await sendEmail({
      to: recipientEmail,
      subject: `${isAdmin ? "Support Team Response" : "New Message"} - Ticket #${ticket.id.slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">${isAdmin ? "Support Team Has Responded" : "New Message on Your Ticket"}</h2>
          
          <p>Hi ${recipientName},</p>
          
          <p>${isAdmin ? "Our support team has responded to your ticket:" : "There's a new message on this ticket:"}</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket #${ticket.id.slice(-8)}</strong></p>
            <p><strong>Subject:</strong> ${ticket.subject}</p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}${isAdmin ? "/admin/support/" + ticket.id : "/dashboard/support"}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Ticket
            </a>
          </p>
        </div>
      `,
    })

    return NextResponse.json({ message: ticketMessage })
  } catch (error: any) {
    console.error("Add ticket message error:", error)
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    )
  }
}

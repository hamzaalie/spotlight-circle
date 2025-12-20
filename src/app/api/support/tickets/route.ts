import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

// GET - List user's tickets
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const tickets = await prisma.ticket.findMany({
      where: { userId: session.user.id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ tickets })
  } catch (error: any) {
    console.error("Fetch tickets error:", error)
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    )
  }
}

// POST - Create new ticket
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { subject, category, message } = await req.json()

    if (!subject || !category || !message) {
      return NextResponse.json(
        { error: "Subject, category, and message are required" },
        { status: 400 }
      )
    }

    // Check if user has annual plan for priority support
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["ACTIVE", "TRIALING"] },
      },
    })

    const priority = subscription?.plan === "annual" ? "HIGH" : "NORMAL"

    // Create ticket with first message
    const ticket = await prisma.ticket.create({
      data: {
        userId: session.user.id,
        subject,
        category,
        status: "OPEN",
        priority,
        messages: {
          create: {
            message,
            isStaff: false,
            authorEmail: session.user.email || "",
            attachments: [],
          },
        },
      },
      include: {
        messages: true,
      },
    })

    // Send notification email to support team
    await sendEmail({
      to: process.env.SUPPORT_EMAIL || "support@spotlightcircles.com",
      subject: `New Support Ticket #${ticket.id.slice(-8)} - ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">New Support Ticket</h2>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> #${ticket.id.slice(-8)}</p>
            <p><strong>Priority:</strong> ${priority}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>From:</strong> ${session.user.email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/support/${ticket.id}" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View & Respond
            </a>
          </p>
        </div>
      `,
    })

    // Send confirmation email to user
    await sendEmail({
      to: session.user.email || "",
      subject: `Support Ticket Received - #${ticket.id.slice(-8)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">Support Ticket Received</h2>
          
          <p>Hi there,</p>
          
          <p>We've received your support request and our team will respond as soon as possible.</p>
          
          <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Ticket ID:</strong> #${ticket.id.slice(-8)}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Priority:</strong> ${priority === "HIGH" ? "High (Annual Plan)" : "Normal"}</p>
          </div>
          
          <div style="background: white; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXTAUTH_URL}/dashboard/support" style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Ticket Status
            </a>
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
            ${priority === "HIGH" ? "⚡ As an annual subscriber, your ticket has been marked as high priority." : "💡 Tip: Annual subscribers get priority support!"}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ticket }, { status: 201 })
  } catch (error: any) {
    console.error("Create ticket error:", error)
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    )
  }
}


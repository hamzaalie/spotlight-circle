import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { email, category, notes, firstName, lastName, companyName } = await req.json()

    if (!email || !category) {
      return NextResponse.json(
        { error: "Email and category are required" },
        { status: 400 }
      )
    }

    // Check if active partnership already exists (exclude declined ones)
    const existingPartnership = await prisma.partnership.findFirst({
      where: {
        initiatorId: session.user.id,
        invitedEmail: email,
      },
    })

    // If there's an existing partnership
    if (existingPartnership) {
      // If it's PENDING or ACCEPTED, don't allow resend
      if (existingPartnership.status === "ACCEPTED") {
        return NextResponse.json(
          { error: "You already have an active partnership with this email" },
          { status: 400 }
        )
      }
      
      if (existingPartnership.status === "PENDING") {
        return NextResponse.json(
          { error: "Partnership invitation already pending for this email" },
          { status: 400 }
        )
      }
      
      // If it was DECLINED, update it to PENDING and resend
      if (existingPartnership.status === "DECLINED") {
        const partnership = await prisma.partnership.update({
          where: { id: existingPartnership.id },
          data: {
            status: "PENDING",
            category,
            notes,
            updatedAt: new Date(),
          },
        })
        
        // Get sender profile and send email
        const senderProfile = await prisma.profile.findUnique({
          where: { userId: session.user.id },
        })
        
        // Send email invitation
        try {
          const inviteLink = `${process.env.NEXTAUTH_URL}/invite/${partnership.id}`
          
          await resend.emails.send({
            from: "Spotlight Circles <noreply@spotlightcircles.com>",
            to: email,
            subject: `${senderProfile?.firstName} ${senderProfile?.lastName} invited you to Spotlight Circles`,
            html: `
              <h2>You've been invited to join Spotlight Circles!</h2>
              <p>${senderProfile?.firstName} ${senderProfile?.lastName} from ${senderProfile?.companyName || "their company"} wants to connect with you for professional referral opportunities.</p>
              ${firstName ? `<p>Hi ${firstName},</p>` : ""}
              ${notes ? `<p><strong>Personal note:</strong> ${notes}</p>` : ""}
              <p><a href="${inviteLink}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a></p>
              <p>Join Spotlight Circles to build mutually beneficial referral partnerships with trusted professionals.</p>
            `,
          })
        } catch (emailError) {
          console.error("Email sending failed:", emailError)
        }
        
        return NextResponse.json({ partnership })
      }
    }

    // Get sender profile
    const senderProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    // Create partnership
    const partnership = await prisma.partnership.create({
      data: {
        initiatorId: session.user.id,
        receiverId: "", // Will be updated when user accepts
        invitedEmail: email,
        category,
        notes,
        status: "PENDING",
      },
    })

    // Send email invitation
    try {
      const inviteLink = `${process.env.NEXTAUTH_URL}/invite/${partnership.id}`
      
      await resend.emails.send({
        from: "Spotlight Circles <noreply@spotlightcircles.com>",
        to: email,
        subject: `${senderProfile?.firstName} ${senderProfile?.lastName} invited you to Spotlight Circles`,
        html: `
          <h2>You've been invited to join Spotlight Circles!</h2>
          <p>${senderProfile?.firstName} ${senderProfile?.lastName} from ${senderProfile?.companyName || "their company"} wants to connect with you for professional referral opportunities.</p>
          ${firstName ? `<p>Hi ${firstName},</p>` : ""}
          ${notes ? `<p><strong>Personal note:</strong> ${notes}</p>` : ""}
          <p><a href="${inviteLink}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a></p>
          <p>Join Spotlight Circles to build mutually beneficial referral partnerships with trusted professionals.</p>
        `,
      })
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ partnership })
  } catch (error) {
    console.error("Bulk invite error:", error)
    return NextResponse.json(
      { error: "Failed to send invitation" },
      { status: 500 }
    )
  }
}


import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { clientName, clientEmail, clientPhone, clientNotes, receiverIds } = await req.json()

    if (!clientName || !clientEmail) {
      return NextResponse.json(
        { error: "Client name and email are required" },
        { status: 400 }
      )
    }

    if (!receiverIds || !Array.isArray(receiverIds) || receiverIds.length === 0) {
      return NextResponse.json(
        { error: "At least one receiver is required" },
        { status: 400 }
      )
    }

    // Get sender's profile
    const senderProfile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    if (!senderProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      )
    }

    // Create referrals for each selected partner
    const referrals = []
    const emailPromises = []

    for (const receiverId of receiverIds) {
      // Verify partnership exists and is accepted
      const partnership = await prisma.partnership.findFirst({
        where: {
          OR: [
            { initiatorId: session.user.id, receiverId },
            { initiatorId: receiverId, receiverId: session.user.id },
          ],
          status: "ACCEPTED",
        },
        include: {
          receiver: { include: { profile: true } },
          initiator: { include: { profile: true } },
        },
      })

      if (!partnership) {
        continue // Skip if partnership doesn't exist
      }

      // Create the referral
      const referral = await prisma.referral.create({
        data: {
          senderId: session.user.id,
          receiverId,
          clientName,
          clientEmail,
          clientPhone: clientPhone || null,
          clientNotes: clientNotes || null,
          status: "NEW",
        },
      })

      // Get the receiver's profile for email
      const receiverProfile = partnership.receiverId === receiverId
        ? (partnership as any).receiver.profile
        : (partnership as any).initiator.profile

      const receiverUser = partnership.receiverId === receiverId
        ? (partnership as any).receiver
        : (partnership as any).initiator

      referrals.push(referral)

      // Send email notification
      if (receiverUser?.email) {
        const emailPromise = resend.emails.send({
          from: "Spotlight Circles <no-reply@spotlightcircles.com>",
          to: receiverUser.email,
          subject: `New Referral from ${senderProfile.firstName} ${senderProfile.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #7c3aed;">New Referral Received!</h1>
              
              <p>Hi ${receiverProfile.firstName},</p>
              
              <p>${senderProfile.firstName} ${senderProfile.lastName} has sent you a new referral:</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Client Information</h3>
                <p><strong>Name:</strong> ${clientName}</p>
                <p><strong>Email:</strong> ${clientEmail}</p>
                ${clientPhone ? `<p><strong>Phone:</strong> ${clientPhone}</p>` : ''}
                ${clientNotes ? `<p><strong>Notes:</strong><br/>${clientNotes}</p>` : ''}
              </div>
              
              <p style="margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard/referrals" 
                   style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Referral
                </a>
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
                This referral will remain in your dashboard for you to track and update as you progress with the client.
              </p>
            </div>
          `,
        })
        emailPromises.push(emailPromise)
      }
    }

    // Send all emails in parallel
    await Promise.allSettled(emailPromises)

    return NextResponse.json({
      success: true,
      count: referrals.length,
      message: `Referral sent to ${referrals.length} partner${referrals.length > 1 ? 's' : ''}`,
    })
  } catch (error: any) {
    console.error("Error creating referral:", error)
    return NextResponse.json(
      { error: "Failed to create referral" },
      { status: 500 }
    )
  }
}


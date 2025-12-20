import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { requestId } = body

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      )
    }

    // Fetch the referral request
    const referralRequest = await prisma.referralRequest.findUnique({
      where: { id: requestId },
      include: {
        profileOwner: { include: { profile: true } },
        partnerUser: { include: { profile: true } },
      },
    })

    if (!referralRequest) {
      return NextResponse.json(
        { error: "Referral request not found" },
        { status: 404 }
      )
    }

    // Verify the current user is the profile owner
    if (referralRequest.profileOwnerId !== session.user.id) {
      return NextResponse.json(
        { error: "You are not authorized to forward this request" },
        { status: 403 }
      )
    }

    // Check if already forwarded
    if (referralRequest.status === "FORWARDED") {
      return NextResponse.json(
        { error: "This request has already been forwarded" },
        { status: 400 }
      )
    }

    // Create a referral from profile owner to partner with client info
    const newReferral = await prisma.referral.create({
      data: {
        senderId: session.user.id,
        receiverId: referralRequest.partnerUserId,
        clientName: referralRequest.requesterName,
        clientEmail: referralRequest.requesterEmail,
        clientPhone: referralRequest.requesterPhone || "",
        clientNotes: referralRequest.requesterMessage || "",
        status: "NEW",
      },
    })

    // Update referral request status
    await prisma.referralRequest.update({
      where: { id: requestId },
      data: {
        status: "FORWARDED",
        forwardedAt: new Date(),
        createdReferralId: newReferral.id,
      },
    })

    // Send email to partner
    const partnerProfile = referralRequest.partnerUser.profile
    const senderProfile = referralRequest.profileOwner.profile
    const senderName = senderProfile
      ? `${senderProfile.firstName} ${senderProfile.lastName}`
      : referralRequest.profileOwner.email

    const emailSubject = `New Referral from ${senderName}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F766E;">You've Received a New Referral!</h2>
        <p><strong>${senderName}</strong> has sent you a client referral.</p>
        
        <div style="background-color: #F0FDFA; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0F766E; margin-top: 0;">Client Information:</h3>
          <p><strong>Name:</strong> ${referralRequest.requesterName}</p>
          <p><strong>Email:</strong> ${referralRequest.requesterEmail}</p>
          ${referralRequest.requesterPhone ? `<p><strong>Phone:</strong> ${referralRequest.requesterPhone}</p>` : ""}
          ${referralRequest.requesterMessage ? `<p><strong>Message:</strong><br/>${referralRequest.requesterMessage}</p>` : ""}
        </div>
        
        <p>Please follow up with this client at your earliest convenience.</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" 
           style="display: inline-block; background-color: #F59E0B; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          View in Dashboard
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This is an automated notification from Spotlight Circle.
        </p>
      </div>
    `

    const emailText = `
You've Received a New Referral!

${senderName} has sent you a client referral.

Client Information:
- Name: ${referralRequest.requesterName}
- Email: ${referralRequest.requesterEmail}
${referralRequest.requesterPhone ? `- Phone: ${referralRequest.requesterPhone}` : ""}
${referralRequest.requesterMessage ? `- Message: ${referralRequest.requesterMessage}` : ""}

Please follow up with this client at your earliest convenience.

View in your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard
    `

    await sendEmail({
      to: referralRequest.partnerUser.email,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    })

    return NextResponse.json({
      success: true,
      message: "Referral forwarded successfully to your partner",
      referralId: newReferral.id,
    })
  } catch (error: any) {
    console.error("Error forwarding referral request:", error)
    return NextResponse.json(
      { error: "Failed to forward referral request", details: error.message },
      { status: 500 }
    )
  }
}

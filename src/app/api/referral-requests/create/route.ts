import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      requesterName,
      requesterEmail,
      requesterPhone,
      requesterMessage,
      profileOwnerId,
      partnerUserId,
    } = body

    // Validate required fields
    if (!requesterName || !requesterEmail || !profileOwnerId || !partnerUserId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Fetch profile owner and partner details
    const [profileOwner, partner] = await Promise.all([
      prisma.user.findUnique({
        where: { id: profileOwnerId },
        include: { profile: true },
      }),
      prisma.user.findUnique({
        where: { id: partnerUserId },
        include: { profile: true },
      }),
    ])

    if (!profileOwner || !partner) {
      return NextResponse.json(
        { error: "Profile owner or partner not found" },
        { status: 404 }
      )
    }

    // Create the referral request
    const referralRequest = await prisma.referralRequest.create({
      data: {
        requesterName,
        requesterEmail,
        requesterPhone: requesterPhone || null,
        requesterMessage: requesterMessage || null,
        profileOwnerId,
        partnerUserId,
        status: "PENDING",
      },
    })

    // Send email notification to profile owner
    const partnerName = partner.profile
      ? `${partner.profile.firstName} ${partner.profile.lastName}`
      : "one of your partners"

    const emailSubject = `New Referral Request for ${partnerName}`
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0F766E;">New Referral Request</h2>
        <p>You have received a new referral request!</p>
        
        <div style="background-color: #F0FDFA; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0F766E; margin-top: 0;">Requester Details:</h3>
          <p><strong>Name:</strong> ${requesterName}</p>
          <p><strong>Email:</strong> ${requesterEmail}</p>
          ${requesterPhone ? `<p><strong>Phone:</strong> ${requesterPhone}</p>` : ""}
          ${requesterMessage ? `<p><strong>Message:</strong><br/>${requesterMessage}</p>` : ""}
        </div>
        
        <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #92400E; margin-top: 0;">They're requesting a referral to:</h3>
          <p><strong>${partnerName}</strong></p>
          ${partner.profile?.profession ? `<p>${partner.profile.profession}</p>` : ""}
        </div>
        
        <p>You can forward this request to ${partnerName} from your dashboard.</p>
        
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/referral-requests" 
           style="display: inline-block; background-color: #F59E0B; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0;">
          View Referral Requests
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          This is an automated notification from Spotlight Circle.
        </p>
      </div>
    `

    const emailText = `
New Referral Request

You have received a new referral request!

Requester Details:
- Name: ${requesterName}
- Email: ${requesterEmail}
${requesterPhone ? `- Phone: ${requesterPhone}` : ""}
${requesterMessage ? `- Message: ${requesterMessage}` : ""}

They're requesting a referral to:
${partnerName}
${partner.profile?.profession || ""}

View and manage this request at: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard/referral-requests
    `

    await sendEmail({
      to: profileOwner.email,
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    })

    return NextResponse.json({
      success: true,
      message: "Referral request sent successfully",
      requestId: referralRequest.id,
    })
  } catch (error: any) {
    console.error("Error creating referral request:", error)
    return NextResponse.json(
      { error: "Failed to create referral request", details: error.message },
      { status: 500 }
    )
  }
}

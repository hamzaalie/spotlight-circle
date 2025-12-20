import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Find stale referrals (>7 days old, status NEW or CONTACTED)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const staleReferrals = await prisma.referral.findMany({
      where: {
        receiverId: session.user.id,
        status: { in: ["NEW", "CONTACTED"] },
        createdAt: { lte: sevenDaysAgo },
      },
      include: {
        sender: {
          include: { profile: true },
        },
        receiver: {
          include: { profile: true },
        },
      },
    })

    if (staleReferrals.length === 0) {
      return NextResponse.json({
        message: "No stale referrals found",
        count: 0,
      })
    }

    // Group by sender to avoid sending multiple emails
    const groupedBySender = staleReferrals.reduce((acc, referral) => {
      const senderId = referral.senderId
      if (!acc[senderId]) {
        acc[senderId] = []
      }
      acc[senderId].push(referral)
      return acc
    }, {} as Record<string, typeof staleReferrals>)

    const emailsSent: string[] = []

    // Send reminder emails
    for (const [senderId, referrals] of Object.entries(groupedBySender)) {
      const sender = referrals[0].sender
      const receiver = referrals[0].receiver

      if (!sender.email) continue

      const referralList = referrals
        .map(
          (r, i) =>
            `${i + 1}. ${r.clientName} (${r.clientEmail}) - Status: ${r.status}`
        )
        .join("\n")

      const daysOld = Math.floor(
        (Date.now() - new Date(referrals[0].createdAt).getTime()) / 
        (1000 * 60 * 60 * 24)
      )

      // Get receiver's email
      const receiverUser = await prisma.user.findUnique({
        where: { id: receiver.id },
        select: { email: true },
      })

      if (!receiverUser?.email) continue

      try {
        // Email to receiver (reminder to follow up)
        await sendEmail({
          to: receiverUser.email,
          subject: `Reminder: ${referrals.length} pending referral${referrals.length > 1 ? "s" : ""} from ${sender.profile?.firstName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">⏰ Referral Follow-Up Reminder</h2>
              
              <p>Hi ${receiver.profile?.firstName},</p>
              
              <p>You have ${referrals.length} referral${referrals.length > 1 ? "s" : ""} from ${sender.profile?.firstName} ${sender.profile?.lastName} that ${referrals.length > 1 ? "have" : "has"} been pending for ${daysOld} days:</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <pre style="margin: 0; font-size: 14px;">${referralList}</pre>
              </div>
              
              <p style="margin: 30px 0;">
                <strong>Suggested Actions:</strong>
              </p>
              <ul style="color: #4b5563;">
                <li>Reach out to the client and provide an update</li>
                <li>Update the referral status in your dashboard</li>
                <li>If not interested, mark as "LOST" so ${sender.profile?.firstName} knows</li>
              </ul>
              
              <p style="margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard/referrals" 
                   style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Update Referrals
                </a>
              </p>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
                💡 <strong>Tip:</strong> Regular follow-ups lead to higher conversion rates and encourage partners to send more referrals!
              </p>
            </div>
          `,
        })

        // Email to sender (CC notification)
        await sendEmail({
          to: sender.email,
          subject: `Follow-up sent for your referrals to ${receiver.profile?.firstName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #7c3aed;">📬 Follow-Up Notification</h2>
              
              <p>Hi ${sender.profile?.firstName},</p>
              
              <p>We've sent a friendly reminder to ${receiver.profile?.firstName} ${receiver.profile?.lastName} about ${referrals.length > 1 ? "the" : "your"} referral${referrals.length > 1 ? "s" : ""} you sent ${daysOld} days ago.</p>
              
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #111827;">Referrals:</h3>
                <pre style="margin: 0; font-size: 14px;">${referralList}</pre>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                You'll receive an update once ${receiver.profile?.firstName} changes the status.
              </p>
              
              <p style="margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard/referrals" 
                   style="background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Referrals
                </a>
              </p>
            </div>
          `,
        })

        emailsSent.push(sender.email)
      } catch (emailError) {
        console.error(`Failed to send follow-up email to ${sender.email}:`, emailError)
      }
    }

    return NextResponse.json({
      message: "Follow-up emails sent successfully",
      count: emailsSent.length,
      referralsProcessed: staleReferrals.length,
      emails: emailsSent,
    })
  } catch (error: any) {
    console.error("Follow-up error:", error)
    return NextResponse.json(
      { error: "Failed to process follow-ups" },
      { status: 500 }
    )
  }
}

// Manual trigger endpoint
export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get count of stale referrals without sending emails
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const staleCount = await prisma.referral.count({
      where: {
        receiverId: session.user.id,
        status: { in: ["NEW", "CONTACTED"] },
        createdAt: { lte: sevenDaysAgo },
      },
    })

    return NextResponse.json({
      staleReferrals: staleCount,
      message: staleCount > 0 
        ? `You have ${staleCount} referral${staleCount > 1 ? "s" : ""} needing follow-up`
        : "No stale referrals found",
    })
  } catch (error: any) {
    console.error("Follow-up check error:", error)
    return NextResponse.json(
      { error: "Failed to check for stale referrals" },
      { status: 500 }
    )
  }
}


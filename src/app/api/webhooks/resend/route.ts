import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Resend webhook events: email.sent, email.delivered, email.bounced, email.complained, email.opened, email.clicked

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, data } = body

    // Log webhook event
    const webhookLog = await prisma.webhookEvent.create({
      data: {
        source: "resend",
        type: type || "unknown",
        payload: JSON.stringify(body),
        status: "PENDING",
      },
    })

    try {
      const emailId = data?.email_id

      if (!emailId) {
        console.error("No email_id in Resend webhook")
        return NextResponse.json({ received: true })
      }

      // Find the email log by resendId
      const emailLog = await prisma.emailLog.findFirst({
        where: { resendId: emailId },
      })

      if (!emailLog) {
        console.log(`No email log found for resendId: ${emailId}`)
        return NextResponse.json({ received: true })
      }

      // Update email log based on event type
      switch (type) {
        case "email.sent":
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
              status: "SENT",
              sentAt: new Date(),
            },
          })
          break

        case "email.delivered":
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
              status: "DELIVERED",
              deliveredAt: new Date(),
            },
          })
          break

        case "email.bounced":
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
              status: "BOUNCED",
              bouncedAt: new Date(),
              error: data?.reason || "Email bounced",
            },
          })
          break

        case "email.complained":
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
              status: "COMPLAINED",
              complainedAt: new Date(),
            },
          })
          break

        case "email.opened":
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
              openedAt: new Date(),
            },
          })
          break

        case "email.clicked":
          await prisma.emailLog.update({
            where: { id: emailLog.id },
            data: {
              clickedAt: new Date(),
            },
          })
          break

        default:
          console.log(`Unhandled Resend event type: ${type}`)
      }

      // Mark webhook as processed
      await prisma.webhookEvent.update({
        where: { id: webhookLog.id },
        data: {
          status: "PROCESSED",
          processedAt: new Date(),
        },
      })

      return NextResponse.json({ received: true })
    } catch (error: any) {
      console.error("Resend webhook processing error:", error)

      // Mark webhook as failed
      await prisma.webhookEvent.update({
        where: { id: webhookLog.id },
        data: {
          status: "FAILED",
          error: error.message,
        },
      })

      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Resend webhook error:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}


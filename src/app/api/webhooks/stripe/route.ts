import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import Stripe from "stripe"
import { SubscriptionStatus } from "@prisma/client"
import { sendEmail, getSubscriptionConfirmationEmail, getWelcomeEmail } from "@/lib/email"

// Convert Stripe status to Prisma enum
function mapStripeStatusToPrisma(stripeStatus: Stripe.Subscription.Status): SubscriptionStatus {
  const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: "ACTIVE",
    past_due: "PAST_DUE",
    canceled: "CANCELED",
    incomplete: "INCOMPLETE",
    trialing: "TRIALING",
    unpaid: "PAST_DUE",
    incomplete_expired: "CANCELED",
    paused: "CANCELED",
  }
  return statusMap[stripeStatus] || "INCOMPLETE"
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Log webhook event
  const webhookLog = await prisma.webhookEvent.create({
    data: {
      source: "stripe",
      type: event.type,
      payload: JSON.stringify(event.data.object),
      status: "PENDING",
    },
  })

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdate(subscription)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentSucceeded(invoice)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        await handleInvoicePaymentFailed(invoice)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
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
    console.error("Webhook handler error:", error)
    
    // Mark webhook as failed
    await prisma.webhookEvent.update({
      where: { id: webhookLog.id },
      data: {
        status: "FAILED",
        error: error.message,
      },
    })
    
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId
  const plan = session.metadata?.plan

  if (!userId) {
    console.error("No userId in checkout session metadata")
    return
  }

  // Get the subscription from Stripe
  const subscriptionId = session.subscription as string
  if (!subscriptionId) {
    console.error("No subscription ID in checkout session")
    return
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Create or update subscription in database
  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0]?.price.id,
      status: mapStripeStatusToPrisma(subscription.status),
      plan: plan || "monthly",
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      status: mapStripeStatusToPrisma(subscription.status),
      stripePriceId: subscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })

  console.log(`Subscription created for user ${userId}`)

  // Get user details for emails
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  })

  if (user && user.email) {
    const userName = 'there'
    const amount = session.amount_total || 0

    // Send payment confirmation email
    try {
      const confirmationEmail = getSubscriptionConfirmationEmail(userName, plan || 'monthly', amount)
      await sendEmail({
        to: user.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
      })
      console.log(`Sent confirmation email to ${user.email}`)
    } catch (error) {
      console.error('Failed to send confirmation email:', error)
    }

    // Send welcome email
    try {
      const welcomeEmail = getWelcomeEmail(userName, plan || 'monthly')
      await sendEmail({
        to: user.email,
        subject: welcomeEmail.subject,
        html: welcomeEmail.html,
      })
      console.log(`Sent welcome email to ${user.email}`)
    } catch (error) {
      console.error('Failed to send welcome email:', error)
    }
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.userId

  if (!userId) {
    console.error("No userId in subscription metadata")
    return
  }

  await prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId: subscription.customer as string,
      stripePriceId: subscription.items.data[0]?.price.id,
      status: mapStripeStatusToPrisma(subscription.status),
      plan: subscription.metadata?.plan || "monthly",
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    update: {
      status: mapStripeStatusToPrisma(subscription.status),
      stripePriceId: subscription.items.data[0]?.price.id,
      stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })

  console.log(`Subscription updated for user ${userId}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: "CANCELED",
    },
  })

  console.log(`Subscription canceled: ${subscription.id}`)
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    return
  }

  // Update subscription status
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: "ACTIVE",
    },
  })

  console.log(`Invoice paid for subscription: ${subscriptionId}`)
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = invoice.subscription as string

  if (!subscriptionId) {
    return
  }

  // Update subscription status
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: {
      status: "PAST_DUE",
    },
  })

  console.log(`Payment failed for subscription: ${subscriptionId}`)
  
  // TODO: Send email notification to user about failed payment
}


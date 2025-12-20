import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { sessionId } = await req.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 400 }
      )
    }

    const subscriptionId = checkoutSession.subscription as string
    if (!subscriptionId) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      )
    }

    // Get subscription details from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Create subscription in database
    const dbSubscription = await prisma.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      create: {
        userId: session.user.id,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0]?.price.id,
        status: subscription.status === "active" ? "ACTIVE" : "TRIALING",
        plan: checkoutSession.metadata?.plan || "monthly",
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      update: {
        status: subscription.status === "active" ? "ACTIVE" : "TRIALING",
        stripePriceId: subscription.items.data[0]?.price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    })

    return NextResponse.json({
      success: true,
      subscription: dbSubscription,
    })
  } catch (error: any) {
    console.error("Subscription confirmation error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to confirm subscription" },
      { status: 500 }
    )
  }
}


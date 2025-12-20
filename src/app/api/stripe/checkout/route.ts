import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { stripe, STRIPE_PRODUCTS } from "@/lib/stripe"
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

    const { plan, includeSetupFee, inviteId } = await req.json()

    if (!plan || !["monthly", "annual"].includes(plan)) {
      return NextResponse.json(
        { error: "Invalid plan. Must be 'monthly' or 'annual'" },
        { status: 400 }
      )
    }

    // Check if user already has an active subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["ACTIVE", "TRIALING"] },
      },
    })

    if (existingSubscription) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    let customerId = (user as any)?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user?.email || "",
        metadata: {
          userId: session.user.id,
        },
      })
      customerId = customer.id

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId } as any,
      })
    }

    // Build line items
    const lineItems: any[] = []

    // Add subscription
    const priceId = plan === "monthly" 
      ? STRIPE_PRODUCTS.MONTHLY_SUBSCRIPTION
      : STRIPE_PRODUCTS.ANNUAL_SUBSCRIPTION

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID not configured. Please contact support." },
        { status: 500 }
      )
    }

    lineItems.push({
      price: priceId,
      quantity: 1,
    })

    // Add setup fee if requested
    if (includeSetupFee && STRIPE_PRODUCTS.SETUP_FEE) {
      lineItems.push({
        price: STRIPE_PRODUCTS.SETUP_FEE,
        quantity: 1,
      })
    }

    // Create Stripe Checkout Session
    const successUrl = inviteId 
      ? `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&invite=${inviteId}`
      : `${process.env.NEXTAUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
    
    const metadata: any = {
      userId: session.user.id,
      plan,
    }
    
    if (inviteId) {
      metadata.inviteId = inviteId
    }
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "subscription",
      success_url: successUrl,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
      metadata,
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan,
        },
      },
    })

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })
  } catch (error: any) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    )
  }
}


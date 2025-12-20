import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  try {
    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })

    console.log('🔧 Setting up Stripe products and prices...')

    // 1. Setup Fee
    const setupFeeProduct = await stripe.products.create({
      name: 'Spotlight Circle - Setup Fee',
      description: 'One-time setup fee for new members',
    })

    const setupFeePrice = await stripe.prices.create({
      product: setupFeeProduct.id,
      unit_amount: 9900, // $99.00
      currency: 'usd',
    })

    // 2. Monthly Subscription
    const monthlyProduct = await stripe.products.create({
      name: 'Spotlight Circle - Monthly',
      description: 'Monthly membership to referral network',
    })

    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 2900, // $29/month
      currency: 'usd',
      recurring: { interval: 'month' },
    })

    // 3. Annual Subscription
    const annualProduct = await stripe.products.create({
      name: 'Spotlight Circle - Annual',
      description: 'Annual membership (save $58/year)',
    })

    const annualPrice = await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 29000, // $290/year
      currency: 'usd',
      recurring: { interval: 'year' },
    })

    const envConfig = `
STRIPE_SETUP_FEE_PRICE_ID="${setupFeePrice.id}"
STRIPE_MONTHLY_PRICE_ID="${monthlyPrice.id}"
STRIPE_ANNUAL_PRICE_ID="${annualPrice.id}"
`

    return NextResponse.json({
      success: true,
      message: 'Stripe products created successfully!',
      products: {
        setupFee: {
          productId: setupFeeProduct.id,
          priceId: setupFeePrice.id,
          amount: '$99.00',
        },
        monthly: {
          productId: monthlyProduct.id,
          priceId: monthlyPrice.id,
          amount: '$29.00/month',
        },
        annual: {
          productId: annualProduct.id,
          priceId: annualPrice.id,
          amount: '$290.00/year',
        },
      },
      envConfig,
      instructions:
        'Copy the envConfig values above and add them to your .env file, then restart the dev server.',
    })
  } catch (error: any) {
    console.error('Stripe setup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}


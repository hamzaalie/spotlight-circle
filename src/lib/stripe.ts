import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
  typescript: true,
})

// Stripe Product IDs (create these in Stripe Dashboard)
export const STRIPE_PRODUCTS = {
  SETUP_FEE: process.env.STRIPE_SETUP_FEE_PRICE_ID || "",
  MONTHLY_SUBSCRIPTION: process.env.STRIPE_MONTHLY_PRICE_ID || "",
  ANNUAL_SUBSCRIPTION: process.env.STRIPE_ANNUAL_PRICE_ID || "",
}

// Pricing configuration
export const PRICING = {
  setupFee: 9900, // $99.00 in cents
  monthly: 2900, // $29.00 in cents
  annual: 29000, // $290.00 in cents ($24.17/month)
}


import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
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
  setupFee: 1995, // $19.95 in cents
  monthly: 995, // $9.95 in cents
  annual: 9995, // $99.95 in cents ($8.33/month)
}


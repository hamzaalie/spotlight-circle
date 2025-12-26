"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2 } from "lucide-react"

const plans = [
  {
    id: "monthly",
    name: "Monthly Plan",
    price: "$9.95",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Unlimited partner invitations",
      "Unlimited referral exchanges",
      "QR code & shareable links",
      "Analytics dashboard",
      "Email notifications",
      "AI-powered bio generator",
      "Profile customization",
    ],
  },
  {
    id: "annual",
    name: "Annual Plan",
    price: "$99.95",
    period: "/year",
    badge: "Save $19.45",
    description: "Best value - 2 months free!",
    features: [
      "All Monthly features",
      "2 months FREE ($58 savings)",
      "Priority support",
      "Early access to new features",
      "Advanced analytics",
      "Partner gap analysis",
      "Client forecasting",
    ],
    popular: true,
  },
]

interface SubscriptionPlansProps {
  currentPlan?: string | null
  hasActiveSubscription?: boolean
}

export default function SubscriptionPlans({ 
  currentPlan, 
  hasActiveSubscription 
}: SubscriptionPlansProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    setError("")

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          includeSetupFee: !hasActiveSubscription, // Only charge setup fee for new customers
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    setLoading("portal")
    setError("")

    try {
      const res = await fetch("/api/stripe/portal", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to open billing portal")
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message)
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {!hasActiveSubscription && (
        <Card className="bg-brand-teal-50 border-brand-teal-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-teal-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 mb-1">One-Time Setup Fee: $19.95</h3>
                <p className="text-sm text-purple-700">
                  New members pay a one-time $19.95 setup fee to join the network. This ensures quality 
                  professionals and helps maintain our platform.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id}
            className={plan.popular ? "border-2 border-brand-teal-500 relative" : ""}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-gold-400 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            {plan.badge && !plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}

            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-600">{plan.period}</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading !== null || (currentPlan === plan.id && hasActiveSubscription)}
                className={`w-full ${
                  plan.popular
                    ? "bg-brand-gold-400 hover:bg-brand-gold-500"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : currentPlan === plan.id && hasActiveSubscription ? (
                  "Current Plan"
                ) : (
                  `Subscribe ${plan.id === "monthly" ? "Monthly" : "Annually"}`
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {hasActiveSubscription && (
        <Card>
          <CardHeader>
            <CardTitle>Manage Subscription</CardTitle>
            <CardDescription>
              Update payment method, view invoices, or cancel subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleManageSubscription}
              disabled={loading === "portal"}
              variant="outline"
              className="w-full"
            >
              {loading === "portal" ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Opening...
                </>
              ) : (
                "Open Billing Portal"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


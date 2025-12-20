"use client"
export const dynamic = "force-dynamic";

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$29",
    period: "/month",
    setupFee: "$99",
    features: [
      "Unlimited referral partners",
      "AI-powered partner recommendations",
      "Client forecasting & analytics",
      "Email notifications",
      "QR code & custom link",
      "Referral tracking",
      "Premium support",
    ],
  },
  {
    id: "annual",
    name: "Annual",
    price: "$290",
    period: "/year",
    setupFee: "$99",
    savings: "Save $58/year",
    features: [
      "Everything in Monthly",
      "2 months free",
      "Priority support",
      "Early access to new features",
    ],
    popular: true,
  },
]

export default function SubscribePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteId = searchParams.get("invite")
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string>("annual")

  const handleSubscribe = async (planId: string, includeSetupFee: boolean) => {
    setLoading(planId)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId,
          includeSetupFee,
          inviteId: inviteId || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to create checkout session")
      }

      const { url } = await res.json()
      window.location.href = url
    } catch (error: any) {
      alert(error.message)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal-500 via-brand-teal-400 to-brand-gold-300 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center text-white space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg">Choose Your Plan</h1>
          <p className="text-xl text-brand-teal-50">
            Complete your setup to start building your referral network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-2xl ${
                plan.popular
                  ? "border-2 border-brand-gold-400 shadow-2xl scale-105 bg-gradient-to-b from-white to-brand-teal-50"
                  : "border-2 border-gray-200 bg-white hover:border-brand-teal-300"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand-gold-400 text-white px-6 py-2 text-sm font-bold shadow-lg">
                    ⭐ BEST VALUE
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4 space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold text-brand-teal-600">
                      {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2 text-lg">{plan.period}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    + {plan.setupFee} one-time setup fee
                  </div>
                  {plan.savings && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {plan.savings}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id, true)}
                  disabled={loading !== null}
                  className={`w-full ${
                    plan.popular
                      ? "bg-brand-gold-400 hover:bg-brand-gold-500"
                      : "bg-gray-900 hover:bg-gray-800"
                  }`}
                  size="lg"
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    `Get Started`
                  )}
                </Button>

                <div className="bg-brand-teal-50 border border-brand-teal-200 rounded-lg p-3 text-center">
                  <p className="text-sm font-medium text-brand-teal-700">
                    ✓ Cancel anytime • 30-day money-back guarantee
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg py-4 px-6">
          <p className="text-white text-sm font-medium">
            🔒 Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}


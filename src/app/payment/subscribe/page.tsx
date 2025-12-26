"use client"
export const dynamic = "force-dynamic";

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Loader2 } from "lucide-react"

const PLANS = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.95",
    period: "/month",
    setupFee: "$19.95",
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
    price: "$99.95",
    period: "/year",
    setupFee: "$19.95",
    savings: "Save $19.45/year",
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
  // Wrap useSearchParams in Suspense
  return (
    <Suspense fallback={null}>
      <SubscribePageContent router={router} />
    </Suspense>
  );
}

function SubscribePageContent({ router }: { router: ReturnType<typeof useRouter> }) {
  const searchParams = useSearchParams();
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl space-y-8 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="text-xl text-gray-600">
            Complete your setup to start building your referral network
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative transition-all hover:shadow-xl ${
                plan.popular
                  ? "border-2 border-brand-teal-500 shadow-lg bg-white"
                  : "border border-gray-200 bg-white hover:border-brand-teal-300 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-brand-gold-500 text-white px-6 py-2 text-sm font-bold shadow-lg">
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
                      ? "bg-brand-gold-500 hover:bg-brand-gold-600 text-white"
                      : "bg-brand-teal-600 hover:bg-brand-teal-700 text-white"
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

        <div className="text-center bg-white border border-gray-200 rounded-lg py-4 px-6 shadow-sm">
          <p className="text-gray-600 text-sm font-medium">
            🔒 Secure checkout powered by Stripe
          </p>
        </div>
      </div>
    </div>
  )
}


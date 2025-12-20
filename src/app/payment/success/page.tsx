"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react"

function SuccessContent() {
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [subscriptionActive, setSubscriptionActive] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [inviteId, setInviteId] = useState<string | null>(null)

  useEffect(() => {
    // Get session ID and invite ID from URL
    const params = new URLSearchParams(window.location.search)
    const id = params.get('session_id')
    const invite = params.get('invite')
    setSessionId(id)
    setInviteId(invite)

    if (!id) {
      setChecking(false)
      setSubscriptionActive(true) // Allow access anyway
      return
    }

    // Immediately confirm subscription with session ID
    const confirmSubscription = async () => {
      try {
        const res = await fetch('/api/stripe/confirm-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: id }),
        })

        if (res.ok) {
          setSubscriptionActive(true)
          setChecking(false)
          return
        }
      } catch (error) {
        console.error('Error confirming subscription:', error)
      }

      // If confirmation fails, fall back to polling
      pollForSubscription()
    }

    const pollForSubscription = () => {
      let attempts = 0
      const maxAttempts = 10

      const checkSubscription = async () => {
        try {
          const res = await fetch('/api/user')
          if (res.ok) {
            const data = await res.json()
            if (data.subscription && ['ACTIVE', 'TRIALING'].includes(data.subscription.status)) {
              return true
            }
          }
        } catch (error) {
          console.error('Error checking subscription:', error)
        }
        return false
      }

      const interval = setInterval(async () => {
        attempts++
        const active = await checkSubscription()
        
        if (active || attempts >= maxAttempts) {
          clearInterval(interval)
          setSubscriptionActive(true)
          setChecking(false)
        }
      }, 1000)
    }

    confirmSubscription()
  }, [])

  const handleGoToDashboard = () => {
    // If there's an invite, redirect to accept it
    if (inviteId) {
      router.push(`/invite/${inviteId}`)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            {checking ? (
              <Loader2 className="h-10 w-10 text-green-600 animate-spin" />
            ) : (
              <CheckCircle className="h-10 w-10 text-green-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {checking ? "Processing Payment..." : "Payment Successful! 🎉"}
          </CardTitle>
          <CardDescription>
            {checking ? "Activating your subscription..." : "Welcome to Spotlight Circle"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!checking && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Your subscription is now active. You have full access to all features of Spotlight Circle.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">What's next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Start inviting trusted partners to your network</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Share your referral link and QR code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Begin exchanging quality referrals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Use AI tools to grow your network</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleGoToDashboard}
                  className="w-full bg-brand-gold-400 hover:bg-brand-gold-500"
                  disabled={!subscriptionActive}
                >
                  {!subscriptionActive ? "Activating..." : inviteId ? "Accept Partnership Invitation" : "Go to Dashboard"}
                </Button>
                {subscriptionActive && !inviteId && (
                  <Link href="/dashboard/partners/invite">
                    <Button variant="outline" className="w-full">
                      Invite Your First Partner
                    </Button>
                  </Link>
                )}
              </div>

              <div className="pt-4 border-t text-center">
                <p className="text-xs text-gray-500">
                  Receipt sent to your email. Manage subscription in{" "}
                  <Link href="/dashboard/settings" className="text-brand-teal-600 hover:underline">
                    Settings
                  </Link>
                </p>
              </div>
            </>
          )}

          {checking && (
            <div className="text-center text-gray-600">
              <p>Please wait while we activate your account...</p>
              <p className="text-sm text-gray-500 mt-2">This usually takes just a few seconds</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function InvitePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [invitation, setInvitation] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function loadInvitation() {
      try {
        // Check if user is authenticated
        const authRes = await fetch("/api/auth/session")
        const authData = await authRes.json()
        setIsAuthenticated(!!authData?.user)

        // Load invitation details
        const res = await fetch(`/api/partnerships/${params.id}`)
        if (!res.ok) {
          throw new Error("Invitation not found")
        }

        const data = await res.json()
        setInvitation(data.partnership)

        // If authenticated, check if they have a profile
        if (authData?.user) {
          try {
            const profileRes = await fetch("/api/profile")
            if (!profileRes.ok) {
              // User doesn't have a profile yet - redirect to onboarding with invite param
              router.push(`/onboarding?invite=${params.id}`)
              return
            }
          } catch (err) {
            // Profile check failed, redirect to onboarding
            router.push(`/onboarding?invite=${params.id}`)
            return
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to load invitation")
      } finally {
        setLoading(false)
      }
    }

    loadInvitation()
  }, [params.id, router])

  const handleAccept = async () => {
    setAccepting(true)
    try {
      const res = await fetch(`/api/partnerships/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACCEPTED" }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to accept invitation")
      }

      // Redirect to dashboard
      router.push("/dashboard/partners")
    } catch (err: any) {
      setError(err.message)
      setAccepting(false)
    }
  }

  const handleDecline = async () => {
    setAccepting(true)
    try {
      const res = await fetch(`/api/partnerships/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DECLINED" }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to decline invitation")
      }

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-teal-500 via-brand-teal-400 to-brand-gold-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-teal-600" />
              <span className="ml-2">Loading invitation...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-teal-500 via-brand-teal-400 to-brand-gold-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              Invalid Invitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push("/auth/signin")} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If not authenticated, redirect to signup with invite ID
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-teal-500 via-brand-teal-400 to-brand-gold-300 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Partnership Invitation</CardTitle>
            <CardDescription>
              You need to sign in or create an account to accept this invitation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {invitation && (
              <div className="bg-brand-teal-50 border border-brand-teal-200 rounded-lg p-4">
                <p className="text-sm text-brand-teal-700">
                  <strong>{invitation.initiator?.firstName} {invitation.initiator?.lastName}</strong>
                  {invitation.initiator?.companyName && ` from ${invitation.initiator.companyName}`} 
                  {' '}invited you to join their referral network.
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Button 
                onClick={() => router.push(`/auth/signin?invite=${params.id}`)} 
                className="w-full"
                variant="outline"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => router.push(`/auth/signup?invite=${params.id}`)} 
                className="w-full bg-brand-teal-500 hover:bg-brand-teal-600"
              >
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated and has invitation loaded
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal-500 via-brand-teal-400 to-brand-gold-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-teal-700">
            <CheckCircle className="h-6 w-6" />
            Partnership Invitation
          </CardTitle>
          <CardDescription>
            You've been invited to join a referral network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invitation && (
            <div className="bg-gradient-to-r from-brand-teal-50 to-brand-gold-50 border border-brand-teal-200 rounded-lg p-4 space-y-2">
              <p className="font-semibold text-brand-teal-700">
                {invitation.initiator?.firstName} {invitation.initiator?.lastName}
              </p>
              {invitation.initiator?.profession && (
                <p className="text-sm text-gray-600">{invitation.initiator.profession}</p>
              )}
              {invitation.initiator?.companyName && (
                <p className="text-sm text-gray-600">{invitation.initiator.companyName}</p>
              )}
              {invitation.notes && (
                <div className="mt-3 pt-3 border-t border-brand-teal-200">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> {invitation.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Button 
              onClick={handleAccept} 
              disabled={accepting}
              className="w-full bg-brand-teal-500 hover:bg-brand-teal-600"
            >
              {accepting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Accept Invitation"
              )}
            </Button>
            <Button 
              onClick={handleDecline} 
              disabled={accepting}
              variant="outline"
              className="w-full"
            >
              Decline
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

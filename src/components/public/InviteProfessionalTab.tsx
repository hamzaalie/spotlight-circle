"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UserPlus, Mail, ArrowRight, Send } from "lucide-react"
import { useRouter } from "next/navigation"

export function InviteProfessionalTab() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [userProfile, setUserProfile] = useState<{ firstName: string; lastName: string; profession: string } | null>(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const [emailTemplate, setEmailTemplate] = useState({
    subject: "",
    body: "",
  })

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setUserProfile(data.profile)
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      }
    }
    fetchProfile()
  }, [])

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required")
      return
    }
    setError("")
    
    // Generate default email template with user's information
    const senderName = userProfile ? userProfile.firstName : "I"
    const profession = userProfile?.profession || "my profession"
    
    setEmailTemplate({
      subject: `Join my professional network on Spotlight Circles`,
      body: `Hi ${formData.firstName},\n\nIt's ${senderName}, from ${profession}. Clients often ask me for referrals I trust—and you're someone I'm always comfortable recommending.\n\nI've joined Spotlight Circles, a private referral platform for trusted, non-competing professionals. It simply formalizes the kind of referrals we already give—no ads, no selling, just trusted introductions.\n\nI'd like to include you in my personal referral circle.\n\nYou can learn more here:\nwww.spotlightcircles.com\n\nTo accept my invitation:\n[link]\n\nNo obligation—just an easy way to share and receive referrals.\n\nBest,\n${userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : ""}`,
    })
    setStep(2)
  }

  const handleSendInvite = async () => {
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/partnerships/invite-simple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          subject: emailTemplate.subject,
          message: emailTemplate.body,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invitation")
      }

      // Reset form
      setFormData({ firstName: "", lastName: "", email: "" })
      setStep(1)
      alert("Invitation sent successfully!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Invite a Professional</h2>
        <p className="text-gray-600">
          Expand your referral network by inviting trusted professionals
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Progress Indicator */}
      {step === 2 && (
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep(1)}
            className="text-brand-teal-600"
          >
            ← Back to Step 1
          </Button>
        </div>
      )}

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Partner Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-brand-teal-500 hover:bg-brand-teal-600">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Email Preview */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Review & Send Invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">To:</p>
              <p className="font-medium">{formData.email}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailTemplate.subject}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={emailTemplate.body}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, body: e.target.value })}
                rows={8}
              />
            </div>

            <Button
              onClick={handleSendInvite}
              disabled={loading}
              className="w-full bg-brand-gold-400 hover:bg-brand-gold-500"
            >
              {loading ? "Sending..." : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Send Invitation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

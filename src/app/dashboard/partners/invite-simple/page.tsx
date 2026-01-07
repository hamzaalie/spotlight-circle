"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, ArrowLeft, Mail, User, Send } from "lucide-react"

export default function SimpleInvitePartnerPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [senderProfile, setSenderProfile] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const [emailTemplate, setEmailTemplate] = useState({
    subject: "",
    body: "",
  })

  // Fetch sender profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setSenderProfile(data.profile)
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err)
      }
    }
    fetchProfile()
  }, [])

  // Generate email template when moving to step 2
  useEffect(() => {
    if (step === 2 && senderProfile) {
      const senderName = `${senderProfile.firstName || ''} ${senderProfile.lastName || ''}`.trim()
      const senderFirstName = senderProfile.firstName || 'there'
      const senderProfession = senderProfile.profession || senderProfile.companyName || 'my practice'
      
      const defaultSubject = `Join my trusted referral circle on Spotlight Circles`
      const defaultBody = `Hi ${formData.firstName},

It's ${senderFirstName}, from ${senderProfession}. Clients often ask me for referrals I trust—and you're someone I'm always comfortable recommending.

I've joined Spotlight Circles, a private referral platform for trusted, non-competing professionals. It simply formalizes the kind of referrals we already give—no ads, no selling, just trusted introductions.

I'd like to include you in my personal referral circle.

You can learn more here:
www.spotlightcircles.com

To accept my invitation:
[link]

No obligation—just an easy way to share and receive referrals.

Best,
${senderName || 'Your colleague'}`.trim()

      setEmailTemplate({
        subject: defaultSubject,
        body: defaultBody,
      })
    }
  }, [step, senderProfile, formData.firstName])

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("All fields are required")
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      return
    }

    // Check if profile is loaded
    if (!senderProfile) {
      setError("Loading your profile... Please try again in a moment.")
      return
    }

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
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          subject: emailTemplate.subject,
          message: emailTemplate.body,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invitation")
      }

      router.push("/dashboard/partners?invited=true")
    } catch (err: any) {
      setError(err.message)
      setStep(1) // Go back to step 1 on error
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/partners">
          <Button variant="outline" size="sm" className="mb-4">
            ← Back to Partners
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Invite a Partner</h1>
        <p className="text-gray-600 mt-1">
          Simple 2-step process to invite professionals to your circle
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 1 ? 'text-brand-teal-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 1 ? 'bg-brand-teal-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span className="font-medium">Basic Info</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className={`flex items-center gap-2 ${step === 2 ? 'text-brand-teal-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 2 ? 'bg-brand-teal-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="font-medium">Review & Send</span>
        </div>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Partner Information
            </CardTitle>
            <CardDescription>
              Enter the basic details of the person you'd like to invite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit} className="space-y-4">
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
                <p className="text-xs text-gray-500">
                  They'll receive your invitation at this email address
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="bg-brand-teal-500 hover:bg-brand-teal-600"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Email Preview and Edit */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Review Invitation Email
            </CardTitle>
            <CardDescription>
              Review and customize the email that will be sent to {formData.firstName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">To:</p>
                <p className="text-sm">{formData.email} ({formData.firstName} {formData.lastName})</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject Line</Label>
              <Input
                id="subject"
                value={emailTemplate.subject}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, subject: e.target.value })}
                placeholder="Email subject..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="body">Email Message</Label>
              <Textarea
                id="body"
                value={emailTemplate.body}
                onChange={(e) => setEmailTemplate({ ...emailTemplate, body: e.target.value })}
                rows={14}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Feel free to personalize this message before sending
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                type="button"
                onClick={handleSendInvite}
                disabled={loading}
                className="flex-1 bg-brand-gold-400 hover:bg-brand-gold-500"
              >
                {loading ? "Sending..." : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Invitation
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

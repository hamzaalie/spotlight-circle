"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

export default function SendReferralPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPartnerId = searchParams.get("partnerId")

  const [loading, setLoading] = useState(false)
  const [loadingPartners, setLoadingPartners] = useState(true)
  const [error, setError] = useState("")
  const [partners, setPartners] = useState<any[]>([])
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientNotes: "",
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  useEffect(() => {
    if (preselectedPartnerId && partners.length > 0) {
      setSelectedPartners([preselectedPartnerId])
    }
  }, [preselectedPartnerId, partners])

  const fetchPartners = async () => {
    try {
      const res = await fetch("/api/partnerships")
      const data = await res.json()
      
      if (res.ok) {
        setPartners(data.partners || [])
      }
    } catch (error) {
      console.error("Failed to fetch partners:", error)
    } finally {
      setLoadingPartners(false)
    }
  }

  const togglePartner = (partnerId: string) => {
    setSelectedPartners((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (selectedPartners.length === 0) {
      setError("Please select at least one partner")
      setLoading(false)
      return
    }

    if (!formData.clientName || !formData.clientEmail) {
      setError("Client name and email are required")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          receiverIds: selectedPartners,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send referral")
      }

      router.push("/dashboard/referrals?tab=sent")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/referrals">
          <Button variant="outline" size="sm" className="mb-4">
            ← Back to Referrals
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Send a Referral</h1>
        <p className="text-gray-600 mt-1">
          Share a lead with your trusted partners
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Referral Details</CardTitle>
          <CardDescription>
            Provide information about the client you're referring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone (Optional)</Label>
              <Input
                id="clientPhone"
                type="tel"
                value={formData.clientPhone}
                onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientNotes">Notes for Partner (Optional)</Label>
              <Textarea
                id="clientNotes"
                value={formData.clientNotes}
                onChange={(e) => setFormData({ ...formData, clientNotes: e.target.value })}
                placeholder="Add any relevant details about the client's needs..."
                rows={4}
              />
            </div>

            <div className="border-t pt-6">
              <Label className="text-base">Select Partners to Receive This Referral *</Label>
              <p className="text-sm text-gray-500 mb-4">
                Choose one or more partners who can best serve this client
              </p>

              {loadingPartners ? (
                <p className="text-gray-500">Loading partners...</p>
              ) : partners.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-md">
                  <p className="text-gray-500 mb-2">No active partners yet</p>
                  <Link href="/dashboard/partners/invite-simple">
                    <Button size="sm">Invite a Partner</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {partners.map((partner) => {
                    const profile = partner.profile
                    if (!profile) return null

                    return (
                      <div
                        key={partner.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <Checkbox
                          id={`partner-${partner.id}`}
                          checked={selectedPartners.includes(partner.id)}
                          onCheckedChange={() => togglePartner(partner.id)}
                        />
                        <label
                          htmlFor={`partner-${partner.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="font-medium">
                            {profile.firstName} {profile.lastName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {profile.profession}
                            {profile.city && ` • ${profile.city}${profile.state ? `, ${profile.state}` : ''}`}
                          </div>
                        </label>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/referrals" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || partners.length === 0}
                className="flex-1 bg-brand-gold-400 hover:bg-brand-gold-500"
              >
                {loading ? "Sending..." : `Send Referral${selectedPartners.length > 1 ? ` to ${selectedPartners.length} Partners` : ""}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


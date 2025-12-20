"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const COMMON_CATEGORIES = [
  "Real Estate",
  "Insurance",
  "Financial Planning",
  "Legal Services",
  "Accounting",
  "Marketing",
  "Web Design",
  "Photography",
  "Landscaping",
  "Home Renovation",
  "Plumbing",
  "Electrical",
  "HVAC",
  "Roofing",
  "Interior Design",
  "Event Planning",
  "Catering",
  "Personal Training",
]

export default function InvitePartnerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    category: "",
    notes: "",
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.email || !formData.category) {
      setError("Email and category are required")
      return
    }

    // Show confirmation dialog
    setShowConfirmDialog(true)
  }

  const handleConfirmSend = async () => {
    setShowConfirmDialog(false)
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/partnerships/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to send invitation")
      }

      router.push("/dashboard/partners")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const selectCategory = (category: string) => {
    setFormData({ ...formData, category })
    setCustomCategory("")
  }

  const handleCustomCategory = () => {
    if (customCategory.trim()) {
      setFormData({ ...formData, category: customCategory.trim() })
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/partners">
          <Button variant="outline" size="sm" className="mb-4">
            ← Back to Partners
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Invite a Partner</h1>
        <p className="text-gray-600 mt-1">
          Expand your referral network by inviting trusted professionals
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Partnership Invitation</CardTitle>
          <CardDescription>
            Send an invitation to collaborate and exchange referrals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Partner's Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="partner@example.com"
                required
              />
              <p className="text-xs text-gray-500">
                They'll receive an invitation to join your network
              </p>
            </div>

            <div className="space-y-2">
              <Label>Category/Profession *</Label>
              <div className="flex gap-2">
                <Input
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter a category..."
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleCustomCategory()
                    }
                  }}
                />
                <Button type="button" onClick={handleCustomCategory} variant="outline">
                  Set
                </Button>
              </div>

              {formData.category && (
                <div className="mt-2">
                  <Badge
                    variant="secondary"
                    className="cursor-pointer hover:bg-red-100"
                    onClick={() => setFormData({ ...formData, category: "" })}
                  >
                    {formData.category} ×
                  </Badge>
                </div>
              )}

              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Quick select:</p>
                <div className="flex flex-wrap gap-2">
                  {COMMON_CATEGORIES.slice(0, 12).map((category) => (
                    <Badge
                      key={category}
                      variant="outline"
                      className="cursor-pointer hover:bg-brand-teal-50"
                      onClick={() => selectCategory(category)}
                    >
                      + {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Personal Message (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add a personal note to your invitation..."
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Tell them why you'd like to partner
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/dashboard/partners" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-brand-gold-400 hover:bg-brand-gold-500"
              >
                {loading ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Partnership Invitation</DialogTitle>
            <DialogDescription>
              You are about to send a partnership invitation to:
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-sm min-w-[80px]">Email:</span>
              <span className="text-sm">{formData.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-sm min-w-[80px]">Category:</span>
              <Badge variant="secondary">{formData.category}</Badge>
            </div>
            {formData.notes && (
              <div className="flex items-start gap-2">
                <span className="font-semibold text-sm min-w-[80px]">Message:</span>
                <span className="text-sm text-gray-600 flex-1">{formData.notes}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSend}
              disabled={loading}
              className="bg-brand-gold-400 hover:bg-brand-gold-500"
            >
              {loading ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


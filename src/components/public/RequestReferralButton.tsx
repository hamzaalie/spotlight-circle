"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RequestReferralButtonProps {
  partnerName: string
  partnerProfession: string
  partnerUserId: string
  profileOwnerId: string
}

export function RequestReferralButton({
  partnerName,
  partnerProfession,
  partnerUserId,
  profileOwnerId,
}: RequestReferralButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    requesterMessage: "",
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/referral-requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          partnerUserId,
          profileOwnerId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Request Sent!",
          description: "Your referral request has been sent successfully.",
        })
        setOpen(false)
        setFormData({
          requesterName: "",
          requesterEmail: "",
          requesterPhone: "",
          requesterMessage: "",
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to send request",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-brand-teal-400 text-brand-teal-700 hover:bg-brand-teal-50 font-semibold"
        >
          <Send className="h-4 w-4 mr-2" />
          Request Referral
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Referral to {partnerName}</DialogTitle>
          <DialogDescription>
            Fill out your information and we'll forward your request to connect you with{" "}
            {partnerName}, a {partnerProfession}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="requesterName">
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="requesterName"
              required
              value={formData.requesterName}
              onChange={(e) =>
                setFormData({ ...formData, requesterName: e.target.value })
              }
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requesterEmail">
              Your Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="requesterEmail"
              type="email"
              required
              value={formData.requesterEmail}
              onChange={(e) =>
                setFormData({ ...formData, requesterEmail: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requesterPhone">Your Phone (Optional)</Label>
            <Input
              id="requesterPhone"
              type="tel"
              value={formData.requesterPhone}
              onChange={(e) =>
                setFormData({ ...formData, requesterPhone: e.target.value })
              }
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requesterMessage">Message (Optional)</Label>
            <Textarea
              id="requesterMessage"
              value={formData.requesterMessage}
              onChange={(e) =>
                setFormData({ ...formData, requesterMessage: e.target.value })
              }
              placeholder="Tell us about what you're looking for..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-brand-gold-400 hover:bg-brand-gold-500 text-white font-bold"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, X, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ReferralRequestActionsProps {
  requestId: string
}

export function ReferralRequestActions({ requestId }: ReferralRequestActionsProps) {
  const [forwardLoading, setForwardLoading] = useState(false)
  const [declineLoading, setDeclineLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleForward = async () => {
    setForwardLoading(true)
    try {
      const response = await fetch("/api/referral-requests/forward", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Referral has been forwarded to your partner.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to forward request",
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
      setForwardLoading(false)
    }
  }

  const handleDecline = async () => {
    if (!confirm("Are you sure you want to decline this request?")) {
      return
    }

    setDeclineLoading(true)
    try {
      const response = await fetch("/api/referral-requests/decline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Request Declined",
          description: "The referral request has been declined.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to decline request",
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
      setDeclineLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        onClick={handleForward}
        disabled={forwardLoading || declineLoading}
        className="w-full bg-brand-gold-400 hover:bg-brand-gold-500 text-white font-bold"
      >
        {forwardLoading ? (
          "Forwarding..."
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Forward to Partner
          </>
        )}
      </Button>
      <Button
        onClick={handleDecline}
        disabled={forwardLoading || declineLoading}
        variant="outline"
        className="w-full border-red-300 text-red-700 hover:bg-red-50"
      >
        {declineLoading ? (
          "Declining..."
        ) : (
          <>
            <X className="h-4 w-4 mr-2" />
            Decline Request
          </>
        )}
      </Button>
    </div>
  )
}

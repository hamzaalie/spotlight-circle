"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface RequestPartnershipButtonProps {
  profileUserId: string
  profileName: string
}

export function RequestPartnershipButton({ profileUserId, profileName }: RequestPartnershipButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isRequested, setIsRequested] = useState(false)
  const router = useRouter()

  const handleRequest = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/partnerships/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverUserId: profileUserId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send partnership request")
      }

      setIsRequested(true)
      toast({
        title: "Partnership Request Sent! 🎉",
        description: `Your request has been sent to ${profileName}. You'll be notified when they respond.`,
      })

      // Refresh the page after a moment to update partnership status
      setTimeout(() => {
        router.refresh()
      }, 1500)
    } catch (error: any) {
      toast({
        title: "Failed to send request",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isRequested) {
    return (
      <Button className="w-full bg-green-500 hover:bg-green-600 text-white" disabled>
        <Check className="h-4 w-4 mr-2" />
        Request Sent
      </Button>
    )
  }

  return (
    <Button 
      className="w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white"
      onClick={handleRequest}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Send className="h-4 w-4 mr-2" />
          Request Partnership
        </>
      )}
    </Button>
  )
}

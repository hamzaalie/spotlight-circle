"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface PendingInvitationsProps {
  invitations: any[]
}

export function PendingInvitations({ invitations }: PendingInvitationsProps) {
  const router = useRouter()
  const [processing, setProcessing] = useState<string | null>(null)

  const handleResponse = async (partnershipId: string, accept: boolean) => {
    setProcessing(partnershipId)
    try {
      const res = await fetch(`/api/partnerships/${partnershipId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: accept ? "ACCEPTED" : "DECLINED" 
        }),
      })

      if (!res.ok) {
        throw new Error("Failed to update partnership")
      }

      router.refresh()
    } catch (error) {
      alert("Failed to update partnership")
    } finally {
      setProcessing(null)
    }
  }

  return (
    <Card className="border-brand-teal-200 bg-brand-teal-50">
      <CardHeader>
        <CardTitle className="text-purple-900">
          Pending Invitations ({invitations.length})
        </CardTitle>
        <CardDescription>
          Review and respond to partnership requests
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.map((invitation) => {
          const profile = invitation.initiator.profile
          if (!profile) return null

          const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()

          return (
            <div
              key={invitation.id}
              className="bg-white rounded-lg p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={profile.photo || ""} alt={`${profile.firstName} ${profile.lastName}`} />
                  <AvatarFallback className="bg-brand-teal-100 text-brand-teal-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">
                    {profile.firstName} {profile.lastName}
                  </h4>
                  <p className="text-sm text-gray-600">{profile.profession}</p>
                  {invitation.category && (
                    <Badge variant="secondary" className="mt-1">
                      {invitation.category}
                    </Badge>
                  )}
                  {invitation.notes && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      "{invitation.notes}"
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleResponse(invitation.id, false)}
                  disabled={processing === invitation.id}
                >
                  Decline
                </Button>
                <Button
                  size="sm"
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                  onClick={() => handleResponse(invitation.id, true)}
                  disabled={processing === invitation.id}
                >
                  {processing === invitation.id ? "Processing..." : "Accept"}
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}


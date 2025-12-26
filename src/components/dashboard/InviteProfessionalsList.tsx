"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface Professional {
  id: string
  firstName: string
  lastName: string
  photo: string | null
  profession: string
  companyName: string | null
  referralSlug: string
  partnershipStatus: string | null
  user: {
    id: string
  }
}

interface InviteProfessionalsListProps {
  professionals: Professional[]
}

export function InviteProfessionalsList({ professionals }: InviteProfessionalsListProps) {
  const router = useRouter()
  const [inviting, setInviting] = useState<string | null>(null)
  const [invitedUsers, setInvitedUsers] = useState<Set<string>>(new Set())

  const handleInvite = async (userId: string, name: string) => {
    setInviting(userId)
    
    try {
      const res = await fetch("/api/partnerships/invite-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverUserId: userId }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Failed to send invitation")
        return
      }

      alert(`Partnership invitation sent to ${name}!`)
      setInvitedUsers(prev => new Set(prev).add(userId))
      router.refresh()
    } catch (error) {
      console.error("Error sending invitation:", error)
      alert("Failed to send invitation. Please try again.")
    } finally {
      setInviting(null)
    }
  }

  if (professionals.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8 text-sm">
        No suggested professionals at the moment. Check back later!
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {professionals.map((professional) => {
        const initials = `${professional.firstName.charAt(0)}${professional.lastName.charAt(0)}`
        const isInviting = inviting === professional.user.id
        const isPending = professional.partnershipStatus === 'PENDING'
        const isInvited = isPending || invitedUsers.has(professional.user.id)
        
        return (
          <div key={professional.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              {professional.photo ? (
                <img 
                  src={professional.photo} 
                  alt={`${professional.firstName} ${professional.lastName}`} 
                  className="h-10 w-10 rounded-full object-cover" 
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-brand-teal-100 flex items-center justify-center text-brand-teal-700 font-semibold text-sm">
                  {initials}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {professional.firstName} {professional.lastName}
                </h3>
                <p className="text-xs text-gray-600">
                  {professional.companyName || professional.profession}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                className={isInvited ? "bg-gray-400 cursor-not-allowed" : "bg-brand-teal-600 hover:bg-brand-teal-700"}
                onClick={() => handleInvite(professional.user.id, `${professional.firstName} ${professional.lastName}`)}
                disabled={isInviting || isInvited}
              >
                {isInviting ? "Sending..." : isInvited ? "Invited" : "Invite"}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-brand-teal-600 hover:text-brand-teal-700 text-xs"
                asChild
              >
                <a href={`/p/${professional.referralSlug}`}>More Info →</a>
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

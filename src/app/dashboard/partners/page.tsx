import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PartnerCard } from "@/components/partners/PartnerCard"
import { PendingInvitations } from "@/components/partners/PendingInvitations"
import { Clock, Mail, CheckCircle, XCircle, Send } from "lucide-react"

export default async function PartnersPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Fetch user's partnerships
  const [initiatedPartnerships, receivedPartnerships] = await Promise.all([
    prisma.partnership.findMany({
      where: { initiatorId: session.user.id },
      include: {
        receiver: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.partnership.findMany({
      where: { receiverId: session.user.id },
      include: {
        initiator: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  // Combine and deduplicate partners
  const allPartnerships = [...initiatedPartnerships, ...receivedPartnerships]
  // Filter out any self-partnerships (where user is both initiator and receiver)
  const activePartners = allPartnerships.filter((p) => {
    // Exclude self-partnerships
    if (p.initiatorId === session.user.id && p.receiverId === session.user.id) {
      return false
    }
    return p.status === "ACCEPTED"
  })
  const pendingInvitations = receivedPartnerships.filter((p) => {
    // Exclude self-partnerships
    if (p.initiatorId === session.user.id && p.receiverId === session.user.id) {
      return false
    }
    return p.status === "PENDING"
  })
  const sentInvitations = initiatedPartnerships.filter((p) => {
    // Exclude self-partnerships
    if (p.initiatorId === session.user.id && p.receiverId === session.user.id) {
      return false
    }
    return p.status === "PENDING"
  })

  // Count only active partners with valid profiles
  const activePartnersWithProfile = activePartners.filter((partnership) => {
    const isInitiator = partnership.initiatorId === session.user.id
    const partnerData = isInitiator 
      ? (partnership as any).receiver 
      : (partnership as any).initiator
    return partnerData?.profile
  })

  const stats = {
    total: activePartnersWithProfile.length,
    pending: sentInvitations.length, // Show sent invitations as "Pending Invitations"
    sent: sentInvitations.length,
    categories: new Set(
      activePartners.map((p) => p.category).filter(Boolean)
    ).size,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Partners</h1>
          <p className="text-gray-600 mt-1">
            Manage your referral network and send invitations
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/partners/bulk-invite">
            <Button variant="outline">
              Bulk Invite
            </Button>
          </Link>
          <Link href="/dashboard/partners/invite-simple">
            <Button className="bg-brand-gold-400 hover:bg-brand-gold-500">
              + Invite Partner
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Partners</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Invites Sent</CardDescription>
            <CardTitle className="text-3xl">{stats.sent}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Invitations</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Categories Covered</CardDescription>
            <CardTitle className="text-3xl">{stats.categories}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Sent Invitations */}
      {sentInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-brand-teal-600" />
              Invitations Sent ({sentInvitations.length})
            </CardTitle>
            <CardDescription>
              Invitations you've sent that are awaiting response
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sentInvitations.map((invitation) => {
                const receiver = (invitation as any).receiver
                const receiverName = receiver?.profile 
                  ? `${receiver.profile.firstName} ${receiver.profile.lastName}`
                  : invitation.invitedEmail || "Unknown"
                const receiverProfession = receiver?.profile?.profession || invitation.category || "Professional"
                const receiverPhoto = receiver?.profile?.photo
                
                return (
                  <div 
                    key={invitation.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {receiverPhoto ? (
                          <AvatarImage src={receiverPhoto} alt={receiverName} />
                        ) : null}
                        <AvatarFallback className="bg-brand-teal-100 text-brand-teal-700">
                          {receiverName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{receiverName}</p>
                        <p className="text-sm text-gray-500">{receiverProfession}</p>
                        {invitation.invitedEmail && !receiver && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {invitation.invitedEmail}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(invitation.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <PendingInvitations invitations={pendingInvitations} />
      )}

      {/* Active Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Active Partners ({activePartners.length})</CardTitle>
          <CardDescription>
            Your established referral network
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activePartners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                You don't have any active partners yet
              </p>
              <Link href="/dashboard/partners/invite-simple">
                <Button>Invite Your First Partner</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activePartners.map((partnership) => {
                // Determine which user is the partner
                const isInitiator = partnership.initiatorId === session.user.id
                const partnerId = isInitiator ? partnership.receiverId : partnership.initiatorId
                
                // Get the correct partner data
                const partnerData = isInitiator 
                  ? (partnership as any).receiver 
                  : (partnership as any).initiator
                
                if (!partnerData?.profile) return null

                return (
                  <PartnerCard
                    key={partnership.id}
                    partnership={partnership}
                    partner={partnerData}
                    profile={partnerData.profile}
                  />
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


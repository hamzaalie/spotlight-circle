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
  const activePartners = allPartnerships.filter((p) => p.status === "ACCEPTED")
  const pendingInvitations = receivedPartnerships.filter((p) => p.status === "PENDING")

  const stats = {
    total: activePartners.length,
    pending: pendingInvitations.length,
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
          <Link href="/dashboard/partners/invite">
            <Button className="bg-brand-gold-400 hover:bg-brand-gold-500">
              + Invite Partner
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Partners</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
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
              <Link href="/dashboard/partners/invite">
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


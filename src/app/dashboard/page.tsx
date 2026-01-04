import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Link2, TrendingUp, MailCheck, Check, Lightbulb, Star, Monitor, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SharePartnersActions } from "@/components/dashboard/SharePartnersActions"
import { InviteProfessionalsList } from "@/components/dashboard/InviteProfessionalsList"

export default async function DashboardPage() {
  const session = await auth()
  
  if (!session?.user) {
    return null
  }

  // Fetch user profile and stats
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  // Get actual count of accepted partnerships instead of using analytics table
  const actualPartnerCount = await prisma.partnership.count({
    where: {
      status: "ACCEPTED",
      OR: [
        { initiatorId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
  })

  const analytics = await prisma.userAnalytics.findUnique({
    where: { userId: session.user.id },
  })

  // Fetch recent referrals
  const recentReferrals = await prisma.referral.findMany({
    where: {
      OR: [
        { senderId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      sender: {
        include: { profile: true },
      },
      receiver: {
        include: { profile: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  // Fetch active partners
  const activePartnerships = await prisma.partnership.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { initiatorId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    include: {
      initiator: { include: { profile: true } },
      receiver: { include: { profile: true } },
    },
    orderBy: { acceptedAt: 'desc' },
    take: 3,
  })

  // Get all partnerships to determine status
  const allPartnerships = await prisma.partnership.findMany({
    where: {
      OR: [
        { initiatorId: session.user.id },
        { receiverId: session.user.id },
      ],
    },
    select: {
      initiatorId: true,
      receiverId: true,
      status: true,
    },
  })

  // Only exclude accepted partners, keep pending and declined for display
  const acceptedPartnerIds = allPartnerships
    .filter((p: any) => p.status === 'ACCEPTED')
    .map((p: any) => p.initiatorId === session.user.id ? p.receiverId : p.initiatorId)
    .filter((id: any): id is string => !!id)

  const suggestedProfessionals = await prisma.profile.findMany({
    where: {
      userId: {
        not: session.user.id,
        notIn: acceptedPartnerIds,
      },
    },
    include: {
      user: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 4,
  })

  // Add partnership status to each professional
  const professionalsWithStatus = suggestedProfessionals.map((prof: any) => {
    const partnership = allPartnerships.find((p: any) => 
      (p.initiatorId === session.user.id && p.receiverId === prof.userId) ||
      (p.receiverId === session.user.id && p.initiatorId === prof.userId)
    )
    return {
      ...prof,
      // Ensure `user` object exists for components expecting it
      user: prof.user ?? { id: prof.userId },
      partnershipStatus: partnership?.status || null,
    }
  })

  const stats = [
    {
      name: "Total Partners",
      value: actualPartnerCount,
      icon: Users,
      color: "text-brand-teal-600",
      bgColor: "bg-brand-teal-100",
    },
    {
      name: "Referrals Given",
      value: analytics?.totalReferralsGiven || 0,
      icon: MailCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      name: "Referrals Received",
      value: analytics?.totalReferralsReceived || 0,
      icon: TrendingUp,
      color: "text-brand-teal-600",
      bgColor: "bg-brand-teal-100",
    },
    {
      name: "Link Clicks",
      value: profile?.linkClicks || 0,
      icon: Link2,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your referral network
        </p>
      </div>

      {/* Invite + Analytics Two Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Invite box (mobile first) */}
        <div className="order-1">
          <Card className="bg-gradient-to-br from-brand-teal-50 to-blue-50">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Invite a Trusted Professional</h2>
              <p className="text-gray-700 mb-4">
                Know a great CPA, attorney, realtor, or contractor? Invite them to your Circle!
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-teal-500 focus:border-transparent"
                />
                <Button className="bg-brand-teal-600 hover:bg-brand-teal-700" asChild>
                  <a href="/dashboard/partners/invite-simple">Send Invite</a>
                </Button>
              </div>
              <a href="/dashboard/partners" className="inline-block mt-3 text-sm text-brand-teal-600 hover:text-brand-teal-700 font-medium">
                See Your Invites →
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Right: Analytics cards arranged 2x2 */}
        <div className="order-2">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat) => (
              <Card key={stat.name}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: Invite Professionals (left) + Active Partners (right) (swapped) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Other Local Professionals (now left) */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Invite Other Local Professionals</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Expand your Circle by inviting other, local, professionals. Choose from one below or go to the Directory.
            </p>
          </CardHeader>
          <CardContent className="p-4">
            {professionalsWithStatus.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">
                No suggested professionals at the moment. Check back later!
              </p>
            ) : (
              <InviteProfessionalsList professionals={professionalsWithStatus} />
            )}
            <div className="mt-4 pt-4 border-t">
              <Button className="w-full bg-brand-teal-600 hover:bg-brand-teal-700" asChild>
                <a href="/directory">Go to Directory</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Your Partner Referrals (now right) */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle>Your Active Partners</CardTitle>
            <a href="/dashboard/partners" className="text-sm text-brand-teal-600 hover:text-brand-teal-700 font-medium">
              View All Partners →
            </a>
          </CardHeader>
          <CardContent className="p-4">
            {activePartnerships.length === 0 ? (
              <p className="text-gray-500 text-center py-8 text-sm">
                No active partners yet. Start by inviting professionals!
              </p>
            ) : (
              <div className="space-y-3">
                {activePartnerships.map((partnership: any) => {
                  const isInitiator = partnership.initiatorId === session.user.id
                  const partnerProfile = isInitiator ? partnership.receiver?.profile : partnership.initiator?.profile
                  const partnerName = partnerProfile 
                    ? `${partnerProfile.firstName} ${partnerProfile.lastName}`
                    : "Unknown"
                  
                  return (
                    <div key={partnership.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {partnerProfile?.photo ? (
                          <img src={partnerProfile.photo} alt={partnerName} className="h-10 w-10 rounded-full object-cover" />
                        ) : (
                          <Users className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{partnerName}</h3>
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          {partnerProfile?.companyName || 'Company Name'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{partnerProfile?.profession || 'Professional'}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      

      {/* Share partners moved to the Marketing page */}

      {/* Recent Referrals - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          {recentReferrals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No referrals yet. Start by inviting partners!
            </p>
          ) : (
            <div className="space-y-4">
              {recentReferrals.map((referral: any) => (
                <div
                  key={referral.id}
                  className="flex items-start justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {referral.clientName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {referral.senderId === session.user.id
                        ? `Sent to ${referral.receiver.profile?.firstName} ${referral.receiver.profile?.lastName}`
                        : `From ${referral.sender.profile?.firstName} ${referral.sender.profile?.lastName}`}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      referral.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : referral.status === 'IN_PROGRESS'
                        ? 'bg-brand-teal-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {referral.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Insights (if available) */}
      {analytics && analytics.predictedMonthlyReferrals > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Predicted Monthly Referrals
                </h4>
                <p className="text-2xl font-bold text-brand-teal-600">
                  {Math.round(analytics.predictedMonthlyReferrals)}
                </p>
              </div>
              {analytics.missingCategories.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Suggested Partner Categories
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analytics.missingCategories.map((category: string) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-brand-teal-100 text-purple-800 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


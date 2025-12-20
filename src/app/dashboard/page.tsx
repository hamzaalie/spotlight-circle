import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Link2, TrendingUp, MailCheck, Check, Lightbulb, Star, Monitor, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SharePartnersActions } from "@/components/dashboard/SharePartnersActions"

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* Share Your Trusted Partners Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Share Your Trusted Partners with Your Clients
          </h2>
          <p className="text-gray-600">
            This is how referrals multiply. When clients can access your trusted professionals, your Circle begins working for you—automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Why This Step Matters */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-teal-700">
                <Lightbulb className="h-5 w-5" />
                Why this step matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Clients often ask: "Do you know someone good for...?"</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">This page answers that question instantly</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Members who share their Circle receive up to 3× more referrals*</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 font-semibold">No ads <Check className="h-4 w-4 inline ml-1" /> No selling</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">Just trusted introductions</p>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-brand-teal-700">
                Professionals We Trust
              </CardTitle>
              <p className="text-sm text-gray-600 text-center">Recommended for You</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-teal-300 to-brand-gold-200" />
                      <div className="flex-1">
                        <div className="h-3 bg-gray-300 rounded w-3/4 mb-1" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                      <Check className="h-4 w-4 text-brand-teal-600" />
                    </div>
                    <Button size="sm" className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 text-white text-xs">
                      Request an Introduction
                    </Button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 text-center mt-4">
                This is exactly what your clients will see on your website.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Integration Options - Client Component */}
        {profile?.referralSlug && <SharePartnersActions referralSlug={profile.referralSlug} />}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href="/dashboard/partners/invite"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Invite a Partner</h3>
              <p className="text-sm text-gray-600">
                Grow your network by inviting trusted professionals
              </p>
            </a>
            <a
              href={`/p/${profile?.referralSlug}`}
              target="_blank"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">View Your Referral Page</h3>
              <p className="text-sm text-gray-600">
                See what clients see when they visit your link
              </p>
            </a>
            <a
              href="/dashboard/marketing"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <h3 className="font-semibold text-gray-900">Generate QR Code</h3>
              <p className="text-sm text-gray-600">
                Create marketing materials for your practice
              </p>
            </a>
          </CardContent>
        </Card>

        {/* Recent Activity */}
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
                {recentReferrals.map((referral) => (
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
      </div>

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
                    {analytics.missingCategories.map((category) => (
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


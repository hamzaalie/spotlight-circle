import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default async function AnalyticsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Fetch all analytics data
  const [analytics, referrals, partnerships, profile] = await Promise.all([
    prisma.userAnalytics.findUnique({
      where: { userId: session.user.id },
    }),
    prisma.referral.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.partnership.findMany({
      where: {
        OR: [
          { initiatorId: session.user.id },
          { receiverId: session.user.id },
        ],
        status: "ACCEPTED",
      },
    }),
    prisma.profile.findUnique({
      where: { userId: session.user.id },
    }),
  ])

  // Fetch link clicks separately using raw query until types update
  const linkClicksData = profile ? await prisma.$queryRaw<any[]>`
    SELECT * FROM "link_clicks" 
    WHERE "profileId" = ${profile.id}
    ORDER BY "createdAt" DESC
    LIMIT 100
  ` : []

  // Calculate metrics
  const sentReferrals = referrals.filter((r) => r.senderId === session.user.id)
  const receivedReferrals = referrals.filter((r) => r.receiverId === session.user.id)

  const metrics = {
    totalPartners: partnerships.length,
    totalReferralsSent: sentReferrals.length,
    totalReferralsReceived: receivedReferrals.length,
    completedSent: sentReferrals.filter((r) => r.status === "COMPLETED").length,
    completedReceived: receivedReferrals.filter((r) => r.status === "COMPLETED").length,
    inProgressSent: sentReferrals.filter((r) => r.status === "IN_PROGRESS").length,
    inProgressReceived: receivedReferrals.filter((r) => r.status === "IN_PROGRESS").length,
    newReceived: receivedReferrals.filter((r) => r.status === "NEW").length,
  }

  const sentConversionRate = sentReferrals.length > 0 
    ? ((metrics.completedSent / sentReferrals.length) * 100).toFixed(1)
    : "0"

  const receivedConversionRate = receivedReferrals.length > 0
    ? ((metrics.completedReceived / receivedReferrals.length) * 100).toFixed(1)
    : "0"

  // Group by status
  const statusBreakdown = {
    NEW: referrals.filter((r) => r.status === "NEW").length,
    CONTACTED: referrals.filter((r) => r.status === "CONTACTED").length,
    IN_PROGRESS: referrals.filter((r) => r.status === "IN_PROGRESS").length,
    COMPLETED: referrals.filter((r) => r.status === "COMPLETED").length,
    LOST: referrals.filter((r) => r.status === "LOST").length,
  }

  // Recent activity
  const recentReferrals = referrals.slice(0, 10)

  // Monthly trends (last 6 months)
  const now = new Date()
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0)
    
    const monthReferrals = referrals.filter((r) => {
      const date = new Date(r.createdAt)
      return date >= monthDate && date <= monthEnd
    })

    return {
      month: monthDate.toLocaleDateString("en-US", { month: "short" }),
      sent: monthReferrals.filter((r) => r.senderId === session.user.id).length,
      received: monthReferrals.filter((r) => r.receiverId === session.user.id).length,
      completed: monthReferrals.filter((r) => r.status === "COMPLETED").length,
    }
  })

  // Link analytics
  const linkClicks = linkClicksData || []
  const totalClicks = profile?.linkClicks || 0
  const conversions = linkClicks.filter((c: any) => c.converted).length
  const clickConversionRate = totalClicks > 0 ? ((conversions / totalClicks) * 100).toFixed(1) : "0"

  // Group by country
  const countryCounts = linkClicks.reduce((acc: Record<string, number>, click: any) => {
    if (click.country) {
      acc[click.country] = (acc[click.country] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topCountries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([country, count]) => ({ country, count: count as number }))

  // Group by referer
  const refererCounts = linkClicks.reduce((acc: Record<string, number>, click: any) => {
    try {
      const source = click.referer 
        ? new URL(click.referer).hostname.replace("www.", "") 
        : "Direct"
      acc[source] = (acc[source] || 0) + 1
    } catch {
      acc["Direct"] = (acc["Direct"] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topReferrers = Object.entries(refererCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 5)
    .map(([source, count]) => ({ source, count: count as number }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your referral network performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Active Partners</CardDescription>
            <CardTitle className="text-3xl">{metrics.totalPartners}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Trusted connections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Referrals Sent</CardDescription>
            <CardTitle className="text-3xl">{metrics.totalReferralsSent}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-green-600">
              {metrics.completedSent} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Referrals Received</CardDescription>
            <CardTitle className="text-3xl">{metrics.totalReferralsReceived}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-brand-teal-600">
              {metrics.newReceived} new leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Conversion Rate</CardDescription>
            <CardTitle className="text-3xl">{receivedConversionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Received to completed
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="links">Link Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sent Referrals Breakdown</CardTitle>
                <CardDescription>
                  Performance of referrals you've sent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{metrics.completedSent}</span>
                  </div>
                  <Progress 
                    value={sentReferrals.length > 0 ? (metrics.completedSent / sentReferrals.length) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium">{metrics.inProgressSent}</span>
                  </div>
                  <Progress 
                    value={sentReferrals.length > 0 ? (metrics.inProgressSent / sentReferrals.length) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-bold text-brand-teal-600">{sentConversionRate}%</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Received Referrals Breakdown</CardTitle>
                <CardDescription>
                  Status of leads from your partners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{metrics.completedReceived}</span>
                  </div>
                  <Progress 
                    value={receivedReferrals.length > 0 ? (metrics.completedReceived / receivedReferrals.length) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">In Progress</span>
                    <span className="text-sm font-medium">{metrics.inProgressReceived}</span>
                  </div>
                  <Progress 
                    value={receivedReferrals.length > 0 ? (metrics.inProgressReceived / receivedReferrals.length) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">New Leads</p>
                  <p className="text-2xl font-bold text-brand-teal-600">{metrics.newReceived}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Pipeline</CardTitle>
              <CardDescription>
                All referrals by status across your network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-brand-teal-50 rounded-lg">
                  <div>
                    <p className="font-medium">New</p>
                    <p className="text-sm text-gray-600">Fresh leads to review</p>
                  </div>
                  <span className="text-2xl font-bold text-brand-teal-600">{statusBreakdown.NEW}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium">Contacted</p>
                    <p className="text-sm text-gray-600">Initial outreach made</p>
                  </div>
                  <span className="text-2xl font-bold text-yellow-600">{statusBreakdown.CONTACTED}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-teal-50 rounded-lg">
                  <div>
                    <p className="font-medium">In Progress</p>
                    <p className="text-sm text-gray-600">Active negotiations</p>
                  </div>
                  <span className="text-2xl font-bold text-brand-teal-600">{statusBreakdown.IN_PROGRESS}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium">Completed</p>
                    <p className="text-sm text-gray-600">Successfully closed</p>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{statusBreakdown.COMPLETED}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Lost</p>
                    <p className="text-sm text-gray-600">Did not convert</p>
                  </div>
                  <span className="text-2xl font-bold text-gray-600">{statusBreakdown.LOST}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>6-Month Trend</CardTitle>
              <CardDescription>
                Referral activity over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month) => (
                  <div key={month.month} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{month.month}</span>
                      <span className="text-gray-600">
                        {month.sent + month.received} total ({month.completed} completed)
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Sent: {month.sent}</p>
                        <Progress value={month.sent * 10} className="h-2 bg-brand-teal-100" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Received: {month.received}</p>
                        <Progress value={month.received * 10} className="h-2 bg-brand-teal-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth Insights</CardTitle>
              <CardDescription>
                Opportunities to improve your network
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {metrics.totalPartners < 5 && (
                <div className="p-4 bg-brand-teal-50 rounded-lg">
                  <p className="font-medium text-blue-900">💡 Grow Your Network</p>
                  <p className="text-sm text-blue-700 mt-1">
                    You have {metrics.totalPartners} partner{metrics.totalPartners !== 1 ? 's' : ''}. 
                    Invite more professionals to expand your referral opportunities.
                  </p>
                </div>
              )}
              {metrics.newReceived > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="font-medium text-yellow-900">⚡ Action Required</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You have {metrics.newReceived} new lead{metrics.newReceived !== 1 ? 's' : ''} waiting. 
                    Follow up quickly to improve conversion rates.
                  </p>
                </div>
              )}
              {metrics.totalReferralsSent === 0 && (
                <div className="p-4 bg-brand-teal-50 rounded-lg">
                  <p className="font-medium text-purple-900">🎯 Start Referring</p>
                  <p className="text-sm text-purple-700 mt-1">
                    Send your first referral to help your partners grow. They'll return the favor!
                  </p>
                </div>
              )}
              {parseFloat(receivedConversionRate) > 50 && metrics.completedReceived > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="font-medium text-green-900">🎉 Great Performance!</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your {receivedConversionRate}% conversion rate is excellent. Keep up the great work!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Clicks</CardDescription>
                <CardTitle className="text-3xl">{totalClicks}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Profile link visits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Conversions</CardDescription>
                <CardTitle className="text-3xl">{conversions}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-600">
                  {clickConversionRate}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Unique Countries</CardDescription>
                <CardTitle className="text-3xl">{topCountries.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Geographic reach
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>
                  Where your clicks are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topCountries.length > 0 ? (
                  <div className="space-y-3">
                    {topCountries.map((item) => (
                      <div key={item.country} className="flex items-center justify-between">
                        <span className="font-medium">{item.country}</span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(item.count / totalClicks) * 100} 
                            className="w-32 h-2" 
                          />
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No click data yet. Share your profile link to get started!
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Referral Sources</CardTitle>
                <CardDescription>
                  How visitors find your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                {topReferrers.length > 0 ? (
                  <div className="space-y-3">
                    {topReferrers.map((item) => (
                      <div key={item.source} className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate max-w-[150px]">
                          {item.source}
                        </span>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={(item.count / totalClicks) * 100} 
                            className="w-32 h-2" 
                          />
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No referral data available yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Clicks</CardTitle>
              <CardDescription>
                Latest profile link activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              {linkClicks.length > 0 ? (
                <div className="space-y-2">
                  {linkClicks.slice(0, 10).map((click: any) => {
                    let refererHost = "Direct visit"
                    if (click.referer) {
                      try {
                        refererHost = `from ${new URL(click.referer).hostname.replace("www.", "")}`
                      } catch {
                        refererHost = "Direct visit"
                      }
                    }
                    
                    return (
                      <div 
                        key={click.id} 
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {click.country || "Unknown"}
                              {click.city && ` · ${click.city}`}
                            </span>
                            {click.converted && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                Converted
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {refererHost}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(click.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No click activity recorded yet
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


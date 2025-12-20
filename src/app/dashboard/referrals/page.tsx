import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReferralCard } from "@/components/referrals/ReferralCard"
import { ExportButton } from "@/components/referrals/ExportButton"

export default async function ReferralsPage() {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Fetch sent and received referrals
  const [sentReferrals, receivedReferrals] = await Promise.all([
    prisma.referral.findMany({
      where: { senderId: session.user.id },
      include: {
        receiver: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.referral.findMany({
      where: { receiverId: session.user.id },
      include: {
        sender: {
          include: { profile: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  // Calculate stats
  const stats = {
    sentTotal: sentReferrals.length,
    sentCompleted: sentReferrals.filter((r) => r.status === "COMPLETED").length,
    receivedTotal: receivedReferrals.length,
    receivedCompleted: receivedReferrals.filter((r) => r.status === "COMPLETED").length,
    receivedNew: receivedReferrals.filter((r) => r.status === "NEW").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Referrals</h1>
          <p className="text-gray-600 mt-1">
            Track and manage your referral exchanges
          </p>
        </div>
        <div className="flex gap-2">
          <ExportButton />
          <Link href="/dashboard/referrals/send">
            <Button className="bg-brand-gold-400 hover:bg-brand-gold-500">
              + Send Referral
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sent</CardDescription>
            <CardTitle className="text-3xl">{stats.sentTotal}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Sent (Completed)</CardDescription>
            <CardTitle className="text-3xl">{stats.sentCompleted}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Received</CardDescription>
            <CardTitle className="text-3xl">{stats.receivedTotal}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="border-brand-teal-200 bg-brand-teal-50">
          <CardHeader className="pb-3">
            <CardDescription className="text-purple-900">New Leads</CardDescription>
            <CardTitle className="text-3xl text-brand-teal-600">{stats.receivedNew}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Referrals Tabs */}
      <Tabs defaultValue="received" className="space-y-4">
        <TabsList>
          <TabsTrigger value="received">
            Received ({receivedReferrals.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Sent ({sentReferrals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referrals You've Received</CardTitle>
              <CardDescription>
                Leads sent to you by your partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              {receivedReferrals.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    No referrals received yet
                  </p>
                  <p className="text-sm text-gray-400">
                    Your partners will send you leads here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedReferrals.map((referral) => (
                    <ReferralCard
                      key={referral.id}
                      referral={referral}
                      partner={referral.sender}
                      profile={referral.sender.profile}
                      type="received"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referrals You've Sent</CardTitle>
              <CardDescription>
                Leads you've shared with your partners
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sentReferrals.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">
                    You haven't sent any referrals yet
                  </p>
                  <Link href="/dashboard/referrals/send">
                    <Button>Send Your First Referral</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentReferrals.map((referral) => (
                    <ReferralCard
                      key={referral.id}
                      referral={referral}
                      partner={referral.receiver}
                      profile={referral.receiver.profile}
                      type="sent"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


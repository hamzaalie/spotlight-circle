import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatCard } from "@/components/admin/StatCard"
import {
  Users,
  Mail,
  Headphones,
  GitPullRequest,
  TrendingUp,
  UserPlus,
  ArrowRight,
  Activity,
} from "lucide-react"

export default async function AdminPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  if (user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  // Get comprehensive stats
  const [
    totalUsers,
    totalEmails,
    openTickets,
    totalReferrals,
    activePartnerships,
    usersToday,
    recentActivity,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.emailLog.count(),
    prisma.ticket.count({
      where: {
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    }),
    prisma.referral.count(),
    prisma.partnership.count({
      where: {
        status: "ACCEPTED",
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
            profession: true,
          },
        },
      },
    }),
  ])

  return (
    <div className="p-8">
      <AdminHeader
        title="Admin Dashboard"
        description="Platform overview and quick actions"
      />

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          description={`+${usersToday} today`}
          colorClass="bg-brand-teal-100 text-brand-teal-600"
        />
        <StatCard
          title="Total Referrals"
          value={totalReferrals}
          icon={GitPullRequest}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Active Partnerships"
          value={activePartnerships}
          icon={UserPlus}
          colorClass="bg-brand-gold-100 text-brand-gold-600"
        />
        <StatCard
          title="Open Tickets"
          value={openTickets}
          icon={Headphones}
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href="/admin/users">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-brand-teal-100 p-3">
                      <Users className="h-6 w-6 text-brand-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Manage Users
                      </h3>
                      <p className="text-sm text-gray-600">
                        View and edit user accounts
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-brand-teal-600 transition-colors" />
                </div>
              </Card>
            </Link>

            <Link href="/admin/analytics">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-100 p-3">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Analytics
                      </h3>
                      <p className="text-sm text-gray-600">
                        Platform performance metrics
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
              </Card>
            </Link>

            <Link href="/admin/referrals">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-brand-gold-100 p-3">
                      <GitPullRequest className="h-6 w-6 text-brand-gold-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Referrals
                      </h3>
                      <p className="text-sm text-gray-600">
                        Monitor all platform referrals
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-brand-gold-600 transition-colors" />
                </div>
              </Card>
            </Link>

            <Link href="/admin/support">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-orange-100 p-3">
                      <Headphones className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Support
                      </h3>
                      <p className="text-sm text-gray-600">
                        Respond to support tickets
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
              </Card>
            </Link>

            <Link href="/admin/settings">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gray-100 p-3">
                      <Mail className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Settings
                      </h3>
                      <p className="text-sm text-gray-600">
                        Configure platform settings
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-3">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Exit Admin
                      </h3>
                      <p className="text-sm text-gray-600">
                        Return to main dashboard
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Users
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activityUser) => (
                <div
                  key={activityUser.id}
                  className="flex items-start justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {activityUser.profile
                        ? `${activityUser.profile.firstName} ${activityUser.profile.lastName}`
                        : activityUser.email}
                    </p>
                    {activityUser.profile?.profession && (
                      <p className="text-sm text-gray-500">
                        {activityUser.profile.profession}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(activityUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full mt-4">
                View All Users
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


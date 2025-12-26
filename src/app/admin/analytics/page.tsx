import { prisma } from "@/lib/prisma"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatCard } from "@/components/admin/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  GitPullRequest,
  TrendingUp,
  DollarSign,
  Calendar,
  MapPin,
  UserPlus,
  CheckCircle,
} from "lucide-react"

export default async function AdminAnalyticsPage() {
  // Fetch all analytics data
  const [
    totalUsers,
    usersThisMonth,
    totalReferrals,
    referralsThisMonth,
    completedReferrals,
    totalPartnerships,
    activeSubscriptions,
    recentUsers,
    topReferrers,
    referralsByStatus,
    usersByLocation,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)), // First day of current month
        },
      },
    }),
    prisma.referral.count(),
    prisma.referral.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(1)),
        },
      },
    }),
    prisma.referral.count({
      where: {
        status: "COMPLETED",
      },
    }),
    prisma.partnership.count({
      where: {
        status: "ACCEPTED",
      },
    }),
    prisma.subscription.count({
      where: {
        status: "ACTIVE",
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
    prisma.user.findMany({
      take: 5,
      include: {
        profile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            referralsSent: true,
          },
        },
      },
      orderBy: {
        referralsSent: {
          _count: "desc",
        },
      },
    }),
    prisma.referral.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.profile.groupBy({
      by: ["state"],
      _count: true,
      orderBy: {
        _count: {
          state: "desc",
        },
      },
      take: 10,
    }),
  ])

  const conversionRate =
    totalReferrals > 0
      ? ((completedReferrals / totalReferrals) * 100).toFixed(1)
      : "0"

  const usersLastMonth = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        lt: new Date(new Date().setDate(1)),
      },
    },
  })

  const userGrowth =
    usersLastMonth > 0
      ? (((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)
      : "0"

  return (
    <div className="p-8">
      <AdminHeader
        title="Platform Analytics"
        description="Monitor platform performance and user activity"
      />

      {/* Key Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          description={`+${usersThisMonth} this month`}
          trend={{
            value: `${userGrowth}% from last month`,
            isPositive: parseFloat(userGrowth) >= 0,
          }}
          colorClass="bg-brand-teal-100 text-brand-teal-600"
        />
        <StatCard
          title="Total Referrals"
          value={totalReferrals}
          icon={GitPullRequest}
          description={`+${referralsThisMonth} this month`}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          icon={CheckCircle}
          description={`${completedReferrals} completed`}
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          title="Active Partnerships"
          value={totalPartnerships}
          icon={UserPlus}
          description="Accepted connections"
          colorClass="bg-brand-gold-100 text-brand-gold-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Referrals by Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-teal-600" />
              Referrals by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {referralsByStatus.map((item) => {
                const total = referralsByStatus.reduce(
                  (sum, i) => sum + i._count,
                  0
                )
                const percentage = ((item._count / total) * 100).toFixed(1)
                const statusConfig: Record<
                  string,
                  { label: string; color: string }
                > = {
                  NEW: { label: "New", color: "bg-blue-500" },
                  CONTACTED: { label: "Contacted", color: "bg-yellow-500" },
                  IN_PROGRESS: {
                    label: "In Progress",
                    color: "bg-purple-500",
                  },
                  COMPLETED: { label: "Completed", color: "bg-green-500" },
                  LOST: { label: "Lost", color: "bg-red-500" },
                }

                const config =
                  statusConfig[item.status] || statusConfig["NEW"]

                return (
                  <div key={item.status}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-700">{config.label}</span>
                      <span className="font-medium text-gray-900">
                        {item._count} ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${config.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brand-gold-600" />
              Top Referrers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topReferrers.map((user, index) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-teal-100 text-sm font-semibold text-brand-teal-700">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.profile
                          ? `${user.profile.firstName} ${user.profile.lastName}`
                          : user.email}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-brand-teal-600">
                    {user._count.referralsSent} referrals
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Recent Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.profile
                        ? `${user.profile.firstName} ${user.profile.lastName}`
                        : user.email}
                    </div>
                    {user.profile?.profession && (
                      <div className="text-sm text-gray-500">
                        {user.profile.profession}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Users by Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersByLocation.slice(0, 5).map((location) => {
                const totalProfiles = usersByLocation.reduce(
                  (sum, l) => sum + l._count,
                  0
                )
                const percentage = (
                  (location._count / totalProfiles) *
                  100
                ).toFixed(1)

                return (
                  <div key={location.state}>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-700">
                        {location.state || "Unknown"}
                      </span>
                      <span className="font-medium text-gray-900">
                        {location._count} users
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Subscriptions
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {activeSubscriptions}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg. Referrals/User
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {totalUsers > 0 ? (totalReferrals / totalUsers).toFixed(1) : 0}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-3">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Profiles Created
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {await prisma.profile.count()}
              </p>
            </div>
            <div className="rounded-full bg-brand-teal-100 p-3">
              <UserPlus className="h-6 w-6 text-brand-teal-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

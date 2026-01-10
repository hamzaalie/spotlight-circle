import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatCard } from "@/components/admin/StatCard"
import { Mail, Calendar, TrendingUp, Download } from "lucide-react"
import Link from "next/link"

export default async function WaitlistPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  // Fetch waitlist entries
  const waitlist = await prisma.waitlist.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      source: true,
      createdAt: true,
      convertedAt: true,
    },
  })

  // Calculate stats
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const todayCount = waitlist.filter(e => new Date(e.createdAt) >= today).length
  const weekCount = waitlist.filter(e => new Date(e.createdAt) >= weekAgo).length
  const convertedCount = waitlist.filter(e => e.convertedAt).length

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <AdminHeader
          title="Waitlist Signups"
          description="Manage early access requests from your landing page"
        />
        {/* Export button removed as it needs client-side functionality */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
        <StatCard
          title="Total Signups"
          value={waitlist.length}
          icon={Mail}
          description="All time"
          colorClass="bg-brand-teal-100 text-brand-teal-600"
        />
        <StatCard
          title="This Week"
          value={weekCount}
          icon={TrendingUp}
          description="Last 7 days"
          colorClass="bg-brand-gold-100 text-brand-gold-600"
        />
        <StatCard
          title="Today"
          value={todayCount}
          icon={Calendar}
          description="Since midnight"
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          title="Converted"
          value={convertedCount}
          icon={TrendingUp}
          description="Signed up"
          colorClass="bg-purple-100 text-purple-600"
        />
      </div>

      {/* Waitlist Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Signups ({waitlist.length})</CardTitle>
          <CardDescription>Complete list of waitlist entries</CardDescription>
        </CardHeader>
        <CardContent>
          {waitlist.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No signups yet</h3>
              <p className="text-gray-600">Waitlist entries will appear here when people sign up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Signed Up</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlist.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900">{entry.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {entry.source}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        {entry.convertedAt ? (
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Converted
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Waiting
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

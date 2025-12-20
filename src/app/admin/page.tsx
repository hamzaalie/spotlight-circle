import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Users,
  Mail,
  Headphones,
  Database,
  ArrowLeft,
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

  // Get stats
  const [totalUsers, totalEmails, openTickets] = await Promise.all([
    prisma.user.count(),
    prisma.emailLog.count(),
    prisma.ticket.count({
      where: {
        status: {
          in: ["OPEN", "IN_PROGRESS"],
        },
      },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">
            System administration and monitoring
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalUsers}
                </p>
              </div>
              <div className="rounded-full bg-brand-teal-100 p-3">
                <Users className="h-6 w-6 text-brand-teal-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Emails Sent
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalEmails}
                </p>
              </div>
              <div className="rounded-full bg-brand-teal-100 p-3">
                <Mail className="h-6 w-6 text-brand-teal-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Open Tickets
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {openTickets}
                </p>
              </div>
              <div className="rounded-full bg-orange-100 p-3">
                <Headphones className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-orange-100 p-3">
                <Headphones className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Support Tickets
                </h2>
                <p className="text-sm text-gray-600">
                  View and respond to customer support requests
                </p>
              </div>
            </div>
            <Link href="/admin/support">
              <Button className="w-full">Manage Tickets</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-brand-teal-100 p-3">
                <Mail className="h-6 w-6 text-brand-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Email Logs
                </h2>
                <p className="text-sm text-gray-600">
                  Monitor email delivery and status
                </p>
              </div>
            </div>
            <Link href="/dashboard/email-logs">
              <Button className="w-full" variant="outline">
                View Email Logs
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}


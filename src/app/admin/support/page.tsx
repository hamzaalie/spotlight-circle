import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { User, Calendar, MessageSquare, ArrowLeft } from "lucide-react"

export default async function AdminSupportPage() {
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

  // Fetch all tickets with user info and message count
  const tickets = await prisma.ticket.findMany({
    include: {
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      _count: {
        select: { messages: true },
      },
    },
    orderBy: [
      { status: "asc" }, // Open tickets first
      { priority: "desc" }, // High priority first
      { createdAt: "desc" }, // Newest first
    ],
  })

  const statusCounts = {
    OPEN: tickets.filter((t) => t.status === "OPEN").length,
    IN_PROGRESS: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
    CLOSED: tickets.filter((t) => t.status === "CLOSED").length,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-brand-teal-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      case "CLOSED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "NORMAL":
        return "bg-brand-teal-100 text-blue-800"
      case "LOW":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Panel
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
            <p className="mt-2 text-gray-600">Manage customer support requests</p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open</p>
                <p className="mt-2 text-3xl font-bold text-brand-teal-600">
                  {statusCounts.OPEN}
                </p>
              </div>
              <div className="rounded-full bg-brand-teal-100 p-3">
                <MessageSquare className="h-6 w-6 text-brand-teal-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {statusCounts.IN_PROGRESS}
                </p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <MessageSquare className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="mt-2 text-3xl font-bold text-green-600">
                  {statusCounts.RESOLVED}
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Closed</p>
                <p className="mt-2 text-3xl font-bold text-gray-600">
                  {statusCounts.CLOSED}
                </p>
              </div>
              <div className="rounded-full bg-gray-100 p-3">
                <MessageSquare className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Tickets List */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Ticket
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Messages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        No support tickets yet
                      </p>
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">
                            #{ticket.id.slice(0, 8)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {ticket.subject}
                          </span>
                          <span className="mt-1 inline-flex w-fit rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {ticket.category}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">
                              {ticket.user.firstName} {ticket.user.lastName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {ticket.user.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MessageSquare className="h-4 w-4" />
                          {ticket._count.messages}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/admin/support/${ticket.id}`}>
                          <Button size="sm">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}


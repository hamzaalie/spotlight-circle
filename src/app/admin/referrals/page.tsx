"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatCard } from "@/components/admin/StatCard"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  GitPullRequest,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react"

interface Referral {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  status: string
  createdAt: string
  sender: {
    email: string
    profile: {
      firstName: string
      lastName: string
    } | null
  }
  receiver: {
    email: string
    profile: {
      firstName: string
      lastName: string
    } | null
  }
}

export default function AdminReferralsPage() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")

  useEffect(() => {
    fetchReferrals()
  }, [search, statusFilter, dateFilter])

  const fetchReferrals = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (dateFilter !== "all") params.append("dateRange", dateFilter)

      const response = await fetch(`/api/admin/referrals?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setReferrals(data.referrals)
      }
    } catch (error) {
      console.error("Error fetching referrals:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { label: string; className: string }
    > = {
      NEW: {
        label: "New",
        className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      },
      CONTACTED: {
        label: "Contacted",
        className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      },
      IN_PROGRESS: {
        label: "In Progress",
        className: "bg-purple-100 text-purple-700 hover:bg-purple-100",
      },
      COMPLETED: {
        label: "Completed",
        className: "bg-green-100 text-green-700 hover:bg-green-100",
      },
      LOST: {
        label: "Lost",
        className: "bg-red-100 text-red-700 hover:bg-red-100",
      },
    }

    return config[status] || config.NEW
  }

  const stats = {
    total: referrals.length,
    new: referrals.filter((r) => r.status === "NEW").length,
    inProgress: referrals.filter((r) => r.status === "IN_PROGRESS").length,
    completed: referrals.filter((r) => r.status === "COMPLETED").length,
  }

  return (
    <div className="p-8">
      <AdminHeader
        title="Referral Oversight"
        description="Monitor all referrals across the platform"
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Referrals"
          value={stats.total}
          icon={GitPullRequest}
          colorClass="bg-brand-teal-100 text-brand-teal-600"
        />
        <StatCard
          title="New Referrals"
          value={stats.new}
          icon={Clock}
          colorClass="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={TrendingUp}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle}
          colorClass="bg-green-100 text-green-600"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by client name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="LOST">Lost</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={fetchReferrals}
            className="sm:w-auto"
          >
            Refresh
          </Button>
        </div>
      </Card>

      {/* Referrals Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Sender
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Receiver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    Loading referrals...
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No referrals found
                  </td>
                </tr>
              ) : (
                referrals.map((referral) => {
                  const statusBadge = getStatusBadge(referral.status)
                  return (
                    <tr key={referral.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {referral.clientName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {referral.clientEmail}
                          </div>
                          {referral.clientPhone && (
                            <div className="text-xs text-gray-400">
                              {referral.clientPhone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {referral.sender.profile
                          ? `${referral.sender.profile.firstName} ${referral.sender.profile.lastName}`
                          : referral.sender.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {referral.receiver.profile
                          ? `${referral.receiver.profile.firstName} ${referral.receiver.profile.lastName}`
                          : referral.receiver.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <Badge className={statusBadge.className}>
                          {statusBadge.label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {new Date(referral.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

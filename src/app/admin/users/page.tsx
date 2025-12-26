"use client"

import { useState, useEffect } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatCard } from "@/components/admin/StatCard"
import { UserStatusBadge } from "@/components/admin/UserStatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Search, UserCheck, UserX, Calendar, Mail, MapPin, Briefcase } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  id: string
  email: string
  role: string
  hasProfile: boolean
  createdAt: string
  profile: {
    firstName: string
    lastName: string
    profession: string
    city: string
    state: string
    photo: string | null
  } | null
  _count: {
    referralsSent: number
    referralsReceived: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [profileFilter, setProfileFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [search, roleFilter, profileFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (roleFilter !== "all") params.append("role", roleFilter)
      if (profileFilter !== "all") params.append("hasProfile", profileFilter)

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      const data = await response.json()

      if (response.ok) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      const data = await response.json()

      if (response.ok) {
        setSelectedUser(data.user)
        setShowDetailsModal(true)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User role updated successfully",
        })
        fetchUsers()
        if (selectedUser?.id === userId) {
          fetchUserDetails(userId)
        }
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        })
        setShowDetailsModal(false)
        fetchUsers()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const stats = {
    total: users.length,
    withProfile: users.filter(u => u.hasProfile).length,
    admins: users.filter(u => u.role === "ADMIN").length,
    professionals: users.filter(u => u.role === "PROFESSIONAL").length,
  }

  return (
    <div className="p-8">
      <AdminHeader
        title="User Management"
        description="Manage all users, roles, and account settings"
      />

      {/* Stats */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          colorClass="bg-brand-teal-100 text-brand-teal-600"
        />
        <StatCard
          title="With Profiles"
          value={stats.withProfile}
          icon={UserCheck}
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          title="Administrators"
          value={stats.admins}
          icon={UserX}
          colorClass="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Professionals"
          value={stats.professionals}
          icon={Briefcase}
          colorClass="bg-brand-gold-100 text-brand-gold-600"
        />
      </div>

      {/* Filters */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by email or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="PROFESSIONAL">Professional</SelectItem>
            </SelectContent>
          </Select>
          <Select value={profileFilter} onValueChange={setProfileFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Profile" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="true">With Profile</SelectItem>
              <SelectItem value="false">No Profile</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Referrals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.profile?.photo || undefined} />
                          <AvatarFallback className="bg-brand-teal-100 text-brand-teal-700">
                            {user.profile?.firstName?.[0] || user.email[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">
                            {user.profile
                              ? `${user.profile.firstName} ${user.profile.lastName}`
                              : "No Profile"}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.profile?.profession && (
                            <div className="text-xs text-brand-teal-600">
                              {user.profile.profession}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge
                        className={
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-brand-teal-100 text-brand-teal-700"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {user.profile?.city && user.profile?.state
                        ? `${user.profile.city}, ${user.profile.state}`
                        : "-"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex gap-2">
                        <span className="text-green-600">
                          ↑{user._count.referralsSent}
                        </span>
                        <span className="text-blue-600">
                          ↓{user._count.referralsReceived}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fetchUserDetails(user.id)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                View and manage user information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={selectedUser.profile?.photo || undefined} />
                  <AvatarFallback className="bg-brand-teal-100 text-brand-teal-700 text-2xl">
                    {selectedUser.profile?.firstName?.[0] || selectedUser.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">
                    {selectedUser.profile
                      ? `${selectedUser.profile.firstName} ${selectedUser.profile.lastName}`
                      : "No Profile"}
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {selectedUser.email}
                    </div>
                    {selectedUser.profile?.profession && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        {selectedUser.profile.profession}
                      </div>
                    )}
                    {selectedUser.profile?.city && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {selectedUser.profile.city}, {selectedUser.profile.state}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Joined {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedUser._count.referralsSent}
                  </div>
                  <div className="text-sm text-gray-600">Sent Referrals</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedUser._count.referralsReceived}
                  </div>
                  <div className="text-sm text-gray-600">Received Referrals</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedUser._count.partnersInitiated}
                  </div>
                  <div className="text-sm text-gray-600">Partners</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-900">
                    {selectedUser.analytics?.linkClicks || 0}
                  </div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </Card>
              </div>

              {/* Role Management */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Role
                </label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => updateUserRole(selectedUser.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => deleteUser(selectedUser.id)}
                  className="flex-1"
                >
                  Delete User
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Users, Link2, BarChart3, Settings, LogOut, Mail, Printer, Headphones, UserPlus, User as UserIcon } from "lucide-react"

interface DashboardNavProps {
  user: {
    email: string
    role?: string | null
    referralSlug?: string | null
  }
  pendingInvitations?: number
}

export default function DashboardNav({ user, pendingInvitations = 0 }: DashboardNavProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "View Profile", href: `/p/${user.referralSlug}`, icon: UserIcon, external: true },
    { name: "Partners", href: "/dashboard/partners", icon: Users, badge: pendingInvitations },
    { name: "Referrals", href: "/dashboard/referrals", icon: Link2 },
    { name: "Referral Requests", href: "/dashboard/referral-requests", icon: UserPlus },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Marketing", href: "/dashboard/marketing", icon: Mail },
    { name: "Poster", href: "/dashboard/poster", icon: Printer },
  ]

  return (
    <>
      {/* Top Bar with Profile */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-white shadow-sm border-b z-10 flex items-center justify-end px-6">
        <div className="flex items-center gap-3">
          {user?.role === "ADMIN" && (
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin Panel
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-brand-teal-100 text-brand-teal-700 font-semibold">
                    {user?.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-semibold">{user?.email}</div>
              <DropdownMenuSeparator />
              {user?.referralSlug && (
                <DropdownMenuItem asChild>
                  <Link href={`/p/${user.referralSlug}`} className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    View Profile
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/support" className="flex items-center gap-2">
                  <Headphones className="h-4 w-4" />
                  Support
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-2 text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 bg-white shadow-lg flex flex-col h-screen border-r">
        {/* Logo */}
        <div className="p-6 border-b">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Spotlight Circles" className="h-10 w-10" />
            <span className="text-lg font-bold text-brand-teal-500">
              Spotlight Circles
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-brand-teal-100 text-brand-teal-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.name}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <Badge className="bg-brand-teal-500 hover:bg-brand-teal-600 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}


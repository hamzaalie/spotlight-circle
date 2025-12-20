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
    { name: "Partners", href: "/dashboard/partners", icon: Users, badge: pendingInvitations },
    { name: "Referrals", href: "/dashboard/referrals", icon: Link2 },
    { name: "Referral Requests", href: "/dashboard/referral-requests", icon: UserPlus },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Marketing", href: "/dashboard/marketing", icon: Mail },
    { name: "Poster", href: "/dashboard/poster", icon: Printer },
  ]

  return (
    <nav className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/dashboard" className="flex items-center gap-3">
                <img src="/images/logo.png" alt="Spotlight Circles" className="h-10 w-10" />
                <span className="text-xl font-bold text-brand-teal-500">
                  Spotlight Circles
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md relative ${
                      isActive
                        ? "bg-brand-teal-100 text-brand-teal-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                    {item.badge !== undefined && item.badge > 0 && (
                      <Badge className="ml-1 bg-brand-teal-500 hover:bg-brand-teal-600 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.email || "User"}</p>
                </div>
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
      </div>
    </nav>
  )
}


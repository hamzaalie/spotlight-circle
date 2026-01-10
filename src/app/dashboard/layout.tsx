import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import DashboardNav from "@/components/dashboard/DashboardNav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Get user with role from database to ensure we have the latest data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      role: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  // Check if user has a profile
  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  })

  if (!profile) {
    redirect("/onboarding")
  }

  // Admins bypass subscription check
  if (user.role !== 'ADMIN') {
    // Check if user has active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["ACTIVE", "TRIALING"] },
      },
    })

    if (!subscription) {
      redirect("/payment/subscribe")
    }
  }

  // Get pending invitations count
  const pendingInvitations = await prisma.partnership.count({
    where: {
      receiverId: session.user.id,
      status: "PENDING",
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav 
        user={{ 
          email: user?.email || session.user.email || "user@example.com", 
          role: user?.role || "PROFESSIONAL",
          referralSlug: profile.referralSlug
        }} 
        pendingInvitations={pendingInvitations} 
      />
      <main className="ml-64 mt-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}


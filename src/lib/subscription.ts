import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function requireSubscription() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Admins bypass subscription check
  if (session.user.role === 'ADMIN') {
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })
    return { session, profile, subscription: null }
  }

  // Check if user has completed profile
  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    redirect("/onboarding")
  }

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

  return { session, profile, subscription }
}


import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import MarketingContent from "@/components/marketing/MarketingContent"

export default async function MarketingPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    redirect("/onboarding")
  }

  const profileUrl = `${process.env.NEXTAUTH_URL}/p/${profile.referralSlug}`

  return (
    <MarketingContent 
      profile={{
        referralSlug: profile.referralSlug,
        qrCodeUrl: profile.qrCodeUrl,
        linkClicks: profile.linkClicks,
      }}
      profileUrl={profileUrl}
    />
  )
}


import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's partnerships
    const partnerships = await prisma.partnership.findMany({
      where: {
        OR: [
          { initiatorId: session.user.id },
          { receiverId: session.user.id },
        ],
        status: "ACCEPTED",
      },
      include: {
        initiator: { include: { profile: true } },
        receiver: { include: { profile: true } },
      },
    })

    // Get referral history
    const referrals = await prisma.referral.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
    })

    // Calculate base metrics
    const totalPartners = partnerships.length
    const receivedReferrals = referrals.filter((r) => r.receiverId === session.user.id)
    const completedReferrals = receivedReferrals.filter((r) => r.status === "COMPLETED")

    // Get unique categories
    const categories = new Set<string>()
    partnerships.forEach((p) => {
      const partnerProfile = p.initiatorId === session.user.id 
        ? p.receiver?.profile 
        : p.initiator.profile
      if (partnerProfile?.profession) {
        categories.add(partnerProfile.profession)
      }
    })

    // Calculate recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentReferrals = receivedReferrals.filter(
      (r) => new Date(r.createdAt) >= thirtyDaysAgo
    )

    // FORECASTING ALGORITHM
    
    // 1. Base calculation: Each partner sends ~0.5 referrals per month on average
    const baseMonthlyReferrals = totalPartners * 0.5

    // 2. Category diversity multiplier (more diverse = more referrals)
    // Sweet spot is 8-12 different categories
    let diversityMultiplier = 1.0
    if (categories.size >= 8) {
      diversityMultiplier = 1.3 // 30% boost for good diversity
    } else if (categories.size >= 5) {
      diversityMultiplier = 1.15 // 15% boost for decent diversity
    } else if (categories.size >= 3) {
      diversityMultiplier = 1.05 // 5% boost for some diversity
    }

    // 3. Engagement bonus (based on recent activity)
    // If you're active, partners are more likely to send referrals
    const sentLast30Days = referrals.filter(
      (r) => r.senderId === session.user.id && new Date(r.createdAt) >= thirtyDaysAgo
    ).length
    
    let engagementMultiplier = 1.0
    if (sentLast30Days >= 5) {
      engagementMultiplier = 1.4 // 40% boost for high activity
    } else if (sentLast30Days >= 3) {
      engagementMultiplier = 1.2 // 20% boost for moderate activity
    } else if (sentLast30Days >= 1) {
      engagementMultiplier = 1.1 // 10% boost for some activity
    } else {
      engagementMultiplier = 0.8 // 20% penalty for no activity
    }

    // 4. Completion rate bonus (if you close deals, you get more referrals)
    const completionRate = receivedReferrals.length > 0
      ? completedReferrals.length / receivedReferrals.length
      : 0

    let completionMultiplier = 1.0
    if (completionRate >= 0.7) {
      completionMultiplier = 1.3 // 30% boost for great conversion
    } else if (completionRate >= 0.5) {
      completionMultiplier = 1.15 // 15% boost for good conversion
    } else if (completionRate >= 0.3) {
      completionMultiplier = 1.05 // 5% boost for decent conversion
    }

    // FINAL CALCULATION
    const predictedMonthlyReferrals = Math.round(
      baseMonthlyReferrals * 
      diversityMultiplier * 
      engagementMultiplier * 
      completionMultiplier
    )

    // Calculate quarterly and annual projections
    const predictedQuarterlyReferrals = predictedMonthlyReferrals * 3
    const predictedAnnualReferrals = predictedMonthlyReferrals * 12

    // Confidence score (0-100)
    // Higher confidence with more data and partners
    let confidence = 50 // Base confidence
    
    if (totalPartners >= 10) confidence += 20
    else if (totalPartners >= 5) confidence += 10
    
    if (receivedReferrals.length >= 20) confidence += 20
    else if (receivedReferrals.length >= 10) confidence += 10
    else if (receivedReferrals.length >= 5) confidence += 5
    
    if (categories.size >= 8) confidence += 10
    else if (categories.size >= 5) confidence += 5

    confidence = Math.min(confidence, 95) // Cap at 95%

    // Save to analytics (upsert to create if doesn't exist)
    await prisma.userAnalytics.upsert({
      where: { userId: session.user.id },
      update: {
        predictedMonthlyReferrals,
      },
      create: {
        userId: session.user.id,
        predictedMonthlyReferrals,
      },
    })

    return NextResponse.json({
      forecast: {
        monthly: predictedMonthlyReferrals,
        quarterly: predictedQuarterlyReferrals,
        annual: predictedAnnualReferrals,
        confidence,
      },
      factors: {
        totalPartners,
        categoryDiversity: categories.size,
        recentActivity: sentLast30Days,
        completionRate: Math.round(completionRate * 100),
        baseReferrals: Math.round(baseMonthlyReferrals * 10) / 10,
        diversityBoost: Math.round((diversityMultiplier - 1) * 100),
        engagementBoost: Math.round((engagementMultiplier - 1) * 100),
        completionBoost: Math.round((completionMultiplier - 1) * 100),
      },
      insights: generateInsights({
        totalPartners,
        categories: categories.size,
        sentLast30Days,
        completionRate,
        predictedMonthly: predictedMonthlyReferrals,
      }),
    })
  } catch (error: any) {
    console.error("Forecast error:", error)
    return NextResponse.json(
      { error: "Failed to generate forecast" },
      { status: 500 }
    )
  }
}

function generateInsights(data: {
  totalPartners: number
  categories: number
  sentLast30Days: number
  completionRate: number
  predictedMonthly: number
}) {
  const insights: string[] = []

  if (data.totalPartners < 5) {
    insights.push("🎯 Add more partners to increase your referral potential")
  } else if (data.totalPartners < 10) {
    insights.push("📈 You're building momentum - aim for 10+ partners for best results")
  } else {
    insights.push("🌟 Great network size! You're positioned for consistent referrals")
  }

  if (data.categories < 5) {
    insights.push("🔍 Diversify your partner categories to capture more opportunities")
  } else if (data.categories >= 8) {
    insights.push("💎 Excellent category diversity - you cover a wide range of needs")
  }

  if (data.sentLast30Days === 0) {
    insights.push("⚡ Send referrals to receive more - reciprocity drives engagement")
  } else if (data.sentLast30Days >= 5) {
    insights.push("🔥 Your high activity level encourages partners to reciprocate")
  }

  if (data.completionRate < 0.3) {
    insights.push("📊 Focus on converting referrals to boost your reputation")
  } else if (data.completionRate >= 0.7) {
    insights.push("🏆 Excellent conversion rate - partners love sending you quality leads")
  }

  if (data.predictedMonthly < 5) {
    insights.push("💡 Engage more actively to unlock higher referral volumes")
  } else if (data.predictedMonthly >= 20) {
    insights.push("🚀 You're on track for significant monthly growth!")
  }

  return insights
}


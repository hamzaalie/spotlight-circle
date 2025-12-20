import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// High-value professional categories that work well in referral networks
const HIGH_VALUE_CATEGORIES = [
  "Real Estate Agent",
  "Mortgage Broker",
  "Financial Advisor",
  "Insurance Agent",
  "Attorney",
  "Accountant",
  "Tax Preparer",
  "Home Inspector",
  "Contractor",
  "Interior Designer",
  "Landscaper",
  "Photographer",
  "Marketing Consultant",
  "Web Developer",
  "Graphic Designer",
  "Event Planner",
  "Wedding Planner",
  "Caterer",
  "Florist",
  "Auto Dealer",
  "Mechanic",
  "Chiropractor",
  "Dentist",
  "Personal Trainer",
  "Nutritionist",
  "Life Coach",
  "Business Coach",
  "Travel Agent",
  "Veterinarian",
  "Pet Groomer",
]

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    })

    // Get current partners
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

    // Extract partner professions
    const currentProfessions = new Set<string>()
    partnerships.forEach((p) => {
      const partnerProfile = p.initiatorId === session.user.id 
        ? p.receiver?.profile 
        : p.initiator.profile
      if (partnerProfile?.profession) {
        currentProfessions.add(partnerProfile.profession)
      }
    })

    // Identify missing high-value categories
    const missingCategories = HIGH_VALUE_CATEGORIES.filter(
      (category) => !currentProfessions.has(category)
    )

    // Sort by relevance to user's profession
    const sortedMissing = await rankCategoriesByRelevance(
      profile?.profession || "Professional",
      missingCategories
    )

    // Get top 5 recommendations
    const topRecommendations = sortedMissing.slice(0, 5)

    // Generate AI-powered insights for each recommendation
    const userProfession = profile?.profession || "Professional"
    const recommendationsWithInsights = await Promise.all(
      topRecommendations.map(async (category) => {
        const insight = await generateCategoryInsight(
          userProfession,
          category
        )
        return {
          category,
          insight,
          priority: calculatePriority(category, userProfession),
        }
      })
    )

    // Save to analytics (upsert to create if doesn't exist)
    await prisma.userAnalytics.upsert({
      where: { userId: session.user.id },
      update: {
        missingCategories: topRecommendations,
      },
      create: {
        userId: session.user.id,
        missingCategories: topRecommendations,
      },
    })

    return NextResponse.json({
      currentCategories: Array.from(currentProfessions),
      categoryCount: currentProfessions.size,
      missingCategories: topRecommendations,
      recommendations: recommendationsWithInsights,
      summary: {
        totalPartners: partnerships.length,
        uniqueCategories: currentProfessions.size,
        potentialGaps: missingCategories.length,
        diversityScore: calculateDiversityScore(currentProfessions.size),
      },
    })
  } catch (error: any) {
    console.error("Partner gaps error:", error)
    return NextResponse.json(
      { error: "Failed to analyze partner gaps" },
      { status: 500 }
    )
  }
}

async function rankCategoriesByRelevance(
  userProfession: string,
  categories: string[]
): Promise<string[]> {
  // Define synergy matrix (which professions work well together)
  const synergyRules: Record<string, string[]> = {
    "Real Estate Agent": ["Mortgage Broker", "Home Inspector", "Contractor", "Interior Designer", "Attorney"],
    "Mortgage Broker": ["Real Estate Agent", "Financial Advisor", "Insurance Agent", "Accountant"],
    "Financial Advisor": ["Accountant", "Attorney", "Insurance Agent", "Tax Preparer"],
    "Attorney": ["Real Estate Agent", "Financial Advisor", "Accountant", "Business Coach"],
    "Insurance Agent": ["Financial Advisor", "Real Estate Agent", "Mortgage Broker", "Auto Dealer"],
    "Contractor": ["Real Estate Agent", "Interior Designer", "Landscaper", "Home Inspector"],
    "Wedding Planner": ["Photographer", "Florist", "Caterer", "Event Planner"],
    "Photographer": ["Wedding Planner", "Real Estate Agent", "Event Planner"],
  }

  const relevantCategories = synergyRules[userProfession] || []
  
  // Sort: relevant first, then alphabetically
  return categories.sort((a, b) => {
    const aRelevant = relevantCategories.includes(a)
    const bRelevant = relevantCategories.includes(b)
    
    if (aRelevant && !bRelevant) return -1
    if (!aRelevant && bRelevant) return 1
    return a.localeCompare(b)
  })
}

async function generateCategoryInsight(
  userProfession: string,
  targetCategory: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a business networking expert. Explain in 1-2 sentences why a professional should partner with another profession for referral exchange."
        },
        {
          role: "user",
          content: `Why should a ${userProfession} partner with a ${targetCategory} for referral exchange?`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content?.trim() || 
           `${targetCategory}s often serve similar clients and can exchange quality referrals.`
  } catch (error) {
    // Fallback if OpenAI fails
    return `${targetCategory}s often serve similar clients and can exchange quality referrals.`
  }
}

function calculatePriority(category: string, userProfession: string): "high" | "medium" | "low" {
  const highPriority = [
    "Real Estate Agent",
    "Mortgage Broker",
    "Financial Advisor",
    "Attorney",
    "Accountant",
  ]

  if (highPriority.includes(category)) {
    return "high"
  }

  // Check synergy
  const synergyRules: Record<string, string[]> = {
    "Real Estate Agent": ["Mortgage Broker", "Home Inspector", "Contractor"],
    "Mortgage Broker": ["Real Estate Agent", "Financial Advisor"],
    "Financial Advisor": ["Accountant", "Attorney", "Insurance Agent"],
  }

  if (synergyRules[userProfession]?.includes(category)) {
    return "high"
  }

  return "medium"
}

function calculateDiversityScore(categoryCount: number): number {
  // 0-100 score based on category count
  // Optimal is 8-12 categories
  if (categoryCount >= 12) return 100
  if (categoryCount >= 8) return 90
  if (categoryCount >= 5) return 70
  if (categoryCount >= 3) return 50
  if (categoryCount >= 1) return 30
  return 0
}


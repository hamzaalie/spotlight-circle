import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

async function fetchWebsiteContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    
    if (!response.ok) return null
    
    const html = await response.text()
    
    // Extract text content from HTML (simple extraction)
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    
    // Return first 1000 characters for context
    return text.substring(0, 1000)
  } catch (error) {
    console.error('Failed to fetch website:', error)
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { profession, companyName, services, city, state, website } = body

    if (!profession) {
      return NextResponse.json(
        { error: "Profession is required" },
        { status: 400 }
      )
    }

    const location = state ? `${city}, ${state}` : city
    
    // Fetch website content if provided
    let websiteContext = ""
    if (website) {
      const content = await fetchWebsiteContent(website)
      if (content) {
        websiteContext = `\n\nWebsite content for context: ${content}`
      }
    }

    // Build comprehensive prompt
    const servicesText = services && services.length > 0 
      ? `Services offered: ${services.join(', ')}.` 
      : ''
    
    const companyText = companyName ? `Company: ${companyName}.` : ''

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an expert professional biography writer specializing in creating compelling, comprehensive biographies for business professionals and entrepreneurs. 

Your biographies should:
- Be 200-400 words in length (comprehensive but readable)
- Highlight expertise, experience, and unique value proposition
- Mention specific services offered
- Convey professionalism while being personable and authentic
- Include achievements and approach to client service
- Create trust and credibility
- Be written in first person or third person (choose what sounds better)
- Flow naturally and be engaging to read

Make it compelling enough to make potential partners and clients want to work with this professional.`
        },
        {
          role: "user",
          content: `Write a comprehensive professional biography for:

Profession: ${profession}
${companyText}
Location: ${location}
${servicesText}
${websiteContext}

Create a detailed, engaging biography that showcases their expertise, approach to serving clients, and what makes them stand out in their field. Include all the services mentioned and make it sound professional yet approachable.`
        }
      ],
      max_tokens: 600,
      temperature: 0.8,
    })

    const biography = completion.choices[0]?.message?.content?.trim()

    if (!biography) {
      throw new Error("Failed to generate biography")
    }

    return NextResponse.json({ biography })
  } catch (error: any) {
    console.error("Bio generation error:", error)
    
    // Enhanced fallback if OpenAI fails
    // Use a generic fallback since we can't parse the request body again
    return NextResponse.json({
      biography: `As an experienced professional, I am dedicated to providing exceptional service to my clients. With a commitment to excellence and a focus on building lasting relationships, I work closely with each client to understand their unique needs and deliver tailored solutions that exceed expectations. My approach combines industry expertise with personalized service, ensuring that every client receives the attention and results they deserve. I believe in the power of professional partnerships and referral networks to create mutual success and growth for all parties involved.`
    })
  }
}


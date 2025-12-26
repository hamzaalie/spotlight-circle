import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import OpenAI from "openai"

// Check if API key is configured
if (!process.env.OPENAI_API_KEY) {
  console.warn('WARNING: OPENAI_API_KEY is not configured. AI bio generation will use fallback.')
}

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

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
  // Parse body outside try block so we can use it in error handler
  let body: any = {}
  
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    body = await req.json()
    const { 
      firstName, 
      lastName, 
      profession, 
      companyName, 
      services, 
      clientBaseSize,
      city, 
      state, 
      website,
      additionalInfo 
    } = body

    console.log('Bio generation request:', { firstName, lastName, profession, companyName, services, city, state, website, hasAdditionalInfo: !!additionalInfo })

    if (!profession) {
      return NextResponse.json(
        { error: "Profession is required" },
        { status: 400 }
      )
    }

    const location = state ? `${city}, ${state}` : city
    const fullName = `${firstName} ${lastName}`.trim()
    
    // Check if OpenAI is configured
    if (!openai || !process.env.OPENAI_API_KEY) {
      console.warn('OpenAI not configured, using enhanced fallback')
      throw new Error('OPENAI_NOT_CONFIGURED')
    }
    
    // Fetch website content if provided
    let websiteContext = ""
    if (website) {
      console.log('Fetching website content from:', website)
      const content = await fetchWebsiteContent(website)
      if (content) {
        websiteContext = `\n\nWebsite content for additional context: ${content}`
        console.log('Website content fetched, length:', content.length)
      } else {
        console.log('Failed to fetch website content')
      }
    }

    // Build comprehensive prompt
    const servicesText = services && services.length > 0 
      ? `Services offered: ${services.join(', ')}.` 
      : ''
    
    const companyText = companyName ? `Company: ${companyName}.` : ''
    const clientBaseText = clientBaseSize ? `Client base size: ${clientBaseSize}.` : ''
    const additionalInfoText = additionalInfo ? `\n\nAdditional information from the professional: ${additionalInfo}` : ''

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert professional biography writer specializing in creating compelling, comprehensive biographies for business professionals and entrepreneurs. 

Your biographies should:
- Be 250-450 words in length (comprehensive and detailed)
- Start with the professional's name and current role
- Highlight their expertise, experience, and unique value proposition
- Mention specific services they offer and how they help clients
- Convey professionalism while being personable, warm, and authentic
- Include relevant achievements, years of experience, or specializations
- Explain their approach to client service and what sets them apart
- Create trust and credibility through specific details
- Use first person (I/my/we) for authenticity and connection
- Flow naturally with smooth transitions between ideas
- End with a forward-looking statement about serving clients

IMPORTANT: Use ALL the information provided - profession, company, services, location, website content, and especially any additional details the professional shared. Make it specific to THEM, not generic.

Make it compelling enough to make potential partners and clients want to work with this professional.`
        },
        {
          role: "user",
          content: `Write a comprehensive, detailed professional biography for:

Name: ${fullName}
Profession: ${profession}
${companyText}
Location: ${location}
${servicesText}
${clientBaseText}
${additionalInfoText}
${websiteContext}

Create a detailed, engaging biography that:
1. Introduces ${firstName} and their role/expertise
2. Showcases their specific services and how they help clients
3. Highlights what makes them unique and trustworthy
4. Mentions their location and service area
5. Includes any specific achievements, experience, or specializations mentioned
6. Uses a warm, professional tone that sounds authentic
7. Makes potential clients and partners want to connect with them

Write in first person and make it feel personal and genuine, not generic. Use ALL the details provided above.`
        }
      ],
      max_tokens: 700,
      temperature: 0.7,
    })
    const biography = completion.choices[0]?.message?.content?.trim()

    if (!biography) {
      throw new Error("Failed to generate biography")
    }

    console.log('Biography generated successfully, length:', biography.length)

    return NextResponse.json({ biography })
  } catch (error: any) {
    console.error("Bio generation error:", error)
    console.error("Error details:", error.message, error.stack)
    
    // Use the body data we parsed earlier
    const { firstName, profession, city, state, companyName, services } = body
    const name = firstName || "I"
    const prof = profession || "professional"
    const loc = state ? `${city}, ${state}` : (city || "this area")
    const company = companyName ? ` at ${companyName}` : ''
    const servicesList = services && services.length > 0 ? services.join(', ') : 'various services'
    
    console.log('Using fallback biography due to error')
    
    return NextResponse.json({
      biography: `${name === "I" ? "As" : `My name is ${name}, and as`} an experienced ${prof}${company}, I am dedicated to providing exceptional service to my clients in ${loc}. I specialize in ${servicesList}, working closely with each client to understand their unique needs and deliver tailored solutions that exceed expectations. My approach combines industry expertise with personalized service, ensuring that every client receives the attention and results they deserve. With a commitment to excellence and building lasting relationships, I believe in the power of professional partnerships and referral networks to create mutual success and growth. I look forward to serving you and becoming a trusted partner in your referral network.`,
      error: error.message // Include error for debugging
    })
  }
}


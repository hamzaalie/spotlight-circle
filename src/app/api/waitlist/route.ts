import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

// Helper function to add CORS headers
function corsHeaders(origin: string | null) {
  const headers = new Headers()
  
  // Allow requests from localhost:8080 (landing page) and localhost:3000 (same origin)
  const allowedOrigins = ['http://localhost:8080', 'http://localhost:3000']
  
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }
  
  return headers
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  
  try {
    const body = await req.json()
    const { email } = body

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400, headers: corsHeaders(origin) }
      )
    }

    // Get optional metadata
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null
    const userAgent = req.headers.get("user-agent") || null
    const referrer = req.headers.get("referer") || null

    // Check if email already exists
    const existingWaitlist = await prisma.waitlist.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingWaitlist) {
      return NextResponse.json({
        success: true,
        message: "You're already on the waitlist!",
        alreadyExists: true,
      }, { headers: corsHeaders(origin) })
    }

    // Save to database
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email: email.toLowerCase(),
        source: "landing-page",
        ipAddress,
        userAgent,
        referrer,
      },
    })

    console.log("New waitlist signup:", {
      email: waitlistEntry.email,
      createdAt: waitlistEntry.createdAt,
    })

    // TODO: Optional - Send confirmation email to user
    // TODO: Optional - Send notification email to admin

    return NextResponse.json({
      success: true,
      message: "Successfully added to waitlist!",
    }, { headers: corsHeaders(origin) })
  } catch (error: any) {
    console.error("Waitlist signup error:", error)
    return NextResponse.json(
      { error: "Failed to join waitlist. Please try again." },
      { status: 500, headers: corsHeaders(origin) }
    )
  }
}

// GET endpoint to retrieve waitlist (admin only)
export async function GET(req: NextRequest) {
  const origin = req.headers.get('origin')
  
  try {
    // Check authentication for admin access
    const session = await auth()
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401, headers: corsHeaders(origin) }
      )
    }

    const waitlist = await prisma.waitlist.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        source: true,
        createdAt: true,
        convertedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      count: waitlist.length,
      waitlist,
    }, { headers: corsHeaders(origin) })
  } catch (error: any) {
    console.error("Waitlist fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500, headers: corsHeaders(origin) }
    )
  }
}

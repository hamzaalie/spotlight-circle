import { NextRequest, NextResponse } from "next/server"
import { Resend } from 'resend'

export async function GET(req: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: "RESEND_API_KEY not configured"
      })
    }

    const resend = new Resend(apiKey)
    
    // Try to send a simple test email
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'delivered@resend.dev', // Resend's test email
      subject: 'Test from Spotlight Circle',
      html: '<p>Testing Resend integration</p>',
    })

    return NextResponse.json({
      success: true,
      message: "Email sent to Resend test address",
      result: result,
      apiKeyConfigured: !!apiKey,
      apiKeyPrefix: apiKey.substring(0, 10) + "..."
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error
    }, { status: 500 })
  }
}


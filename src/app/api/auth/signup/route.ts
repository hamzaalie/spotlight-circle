import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { signUpSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = signUpSchema.parse(body)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(validatedData.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        role: "PROFESSIONAL",
      },
    })

    // Check for pending partnership invitations for this email
    const pendingInvitations = await prisma.partnership.findMany({
      where: {
        invitedEmail: validatedData.email.toLowerCase(),
        receiverId: null,
      },
    })

    // Link pending invitations to the new user
    if (pendingInvitations.length > 0) {
      await prisma.partnership.updateMany({
        where: {
          invitedEmail: validatedData.email.toLowerCase(),
          receiverId: null,
        },
        data: {
          receiverId: user.id,
        },
      })
    }

    return NextResponse.json(
      { 
        message: "User created successfully", 
        userId: user.id,
        pendingInvitations: pendingInvitations.length,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input data", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}


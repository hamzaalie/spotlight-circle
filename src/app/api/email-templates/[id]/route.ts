import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Only admins can edit templates (for now, allow all authenticated users)
  // In production, you might want to add role-based access control

  try {
    const { subject, htmlBody, textBody } = await req.json()

    const template = await prisma.emailTemplate.update({
      where: { id: params.id },
      data: {
        subject,
        htmlBody,
        textBody,
      },
    })

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Template update error:", error)
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    )
  }
}

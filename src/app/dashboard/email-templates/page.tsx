import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EmailTemplateEditor } from "@/components/email-templates/EmailTemplateEditor"

export default async function EmailTemplatesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Fetch all email templates
  const templates = await prisma.emailTemplate.findMany({
    orderBy: { createdAt: "asc" },
  })

  // Default template names if none exist
  const defaultTemplates = [
    {
      name: "Partnership Invitation",
      subject: "Join My Professional Network on Spotlight Circles",
      htmlBody: `<p>Hi {{partnerName}},</p>
<p>I'd love to connect with you on Spotlight Circles to build a mutually beneficial referral partnership.</p>
<p>{{senderName}} from {{senderCompany}}</p>
<p><a href="{{inviteLink}}">Accept Invitation</a></p>`,
      textBody: `Hi {{partnerName}},\n\nI'd love to connect with you on Spotlight Circles to build a mutually beneficial referral partnership.\n\n{{senderName}} from {{senderCompany}}\n\nAccept: {{inviteLink}}`,
      variables: ["partnerName","senderName","senderCompany","inviteLink"],
    },
    {
      name: "Referral Notification",
      subject: "New Referral from {{senderName}}",
      htmlBody: `<p>Hi {{recipientName}},</p>
<p>Great news! {{senderName}} has sent you a new referral:</p>
<p><strong>Client:</strong> {{clientName}}</p>
<p><strong>Email:</strong> {{clientEmail}}</p>
<p><strong>Phone:</strong> {{clientPhone}}</p>
<p><strong>Notes:</strong> {{clientNotes}}</p>
<p><a href="{{dashboardLink}}">View in Dashboard</a></p>`,
      textBody: `Hi {{recipientName}},\n\nGreat news! {{senderName}} has sent you a new referral:\n\nClient: {{clientName}}\nEmail: {{clientEmail}}\nPhone: {{clientPhone}}\nNotes: {{clientNotes}}\n\nView: {{dashboardLink}}`,
      variables: ["recipientName","senderName","clientName","clientEmail","clientPhone","clientNotes","dashboardLink"],
    },
  ]

  // If no templates exist, create defaults
  if (templates.length === 0) {
    await Promise.all(
      defaultTemplates.map((template) =>
        prisma.emailTemplate.create({
          data: template,
        })
      )
    )
    redirect("/dashboard/email-templates") // Refresh to show created templates
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Templates</h1>
        <p className="text-gray-600 mt-1">
          Customize email notifications sent to partners and clients
        </p>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>
                Available variables: {Array.isArray(template.variables)
                  ? (template.variables as string[]).map((v: string) => `{{${v}}}`).join(", ")
                  : (typeof template.variables === "string" && template.variables
                      ? (template.variables as string).split(",").map((v: string) => `{{${v}}}`).join(", ")
                      : "")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplateEditor template={{
                ...template,
                variables: Array.isArray(template.variables)
                  ? template.variables.join(",")
                  : template.variables || ""
              }} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Save } from "lucide-react"

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlBody: string
  textBody: string
  variables: string | null
}

interface EmailTemplateEditorProps {
  template: EmailTemplate
}

export function EmailTemplateEditor({ template }: EmailTemplateEditorProps) {
  const [subject, setSubject] = useState(template.subject)
  const [htmlBody, setHtmlBody] = useState(template.htmlBody)
  const [textBody, setTextBody] = useState(template.textBody)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/email-templates/${template.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          htmlBody,
          textBody,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save template")
      }

      alert("Template saved successfully!")
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save template. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  // Generate preview by replacing variables with sample data
  const generatePreview = (content: string) => {
    const sampleData: Record<string, string> = {
      partnerName: "John Smith",
      senderName: "Jane Doe",
      senderCompany: "ABC Consulting",
      inviteLink: "https://example.com/invite/123",
      recipientName: "Sarah Johnson",
      clientName: "Michael Brown",
      clientEmail: "michael@example.com",
      clientPhone: "(555) 123-4567",
      clientNotes: "Interested in premium services for their business",
      dashboardLink: "https://example.com/dashboard",
    }

    let preview = content
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, "g"), value)
    })
    return preview
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <Button 
            onClick={handleSave} 
            disabled={saving}
            className="bg-brand-gold-400 hover:bg-brand-gold-500 gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <TabsContent value="edit" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`subject-${template.id}`}>Subject Line</Label>
            <Input
              id={`subject-${template.id}`}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`html-${template.id}`}>HTML Body</Label>
            <Textarea
              id={`html-${template.id}`}
              value={htmlBody}
              onChange={(e) => setHtmlBody(e.target.value)}
              placeholder="HTML email content..."
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Use HTML tags for formatting. Insert variables like: {"{"}{"{"} variableName {"}"}{"}"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`text-${template.id}`}>Plain Text Body</Label>
            <Textarea
              id={`text-${template.id}`}
              value={textBody}
              onChange={(e) => setTextBody(e.target.value)}
              placeholder="Plain text email content..."
              rows={8}
            />
            <p className="text-xs text-gray-500">
              Fallback for email clients that don't support HTML
            </p>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <div className="border rounded-lg p-4 bg-gray-50">
            <div className="mb-4 pb-4 border-b">
              <p className="text-sm text-gray-600">Subject:</p>
              <p className="font-semibold">{generatePreview(subject)}</p>
            </div>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: generatePreview(htmlBody) }}
            />
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-sm text-gray-600 mb-2">Plain Text Version:</p>
            <pre className="whitespace-pre-wrap font-sans text-sm">
              {generatePreview(textBody)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


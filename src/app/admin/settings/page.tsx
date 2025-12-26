"use client"

import { useState } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Settings,
  Mail,
  Bell,
  Shield,
  Globe,
  Save,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [emailSettings, setEmailSettings] = useState({
    senderName: "Spotlight Circles",
    senderEmail: "noreply@spotlightcircles.com",
    replyTo: "support@spotlightcircles.com",
  })

  const [platformSettings, setPlatformSettings] = useState({
    signupEnabled: true,
    maintenanceMode: false,
    requireEmailVerification: false,
    maxPartnersPerUser: 50,
  })

  const [emailTemplates, setEmailTemplates] = useState({
    welcomeEmail: `Hi {{firstName}},

Welcome to Spotlight Circles! We're excited to have you join our professional referral network.

Get started by completing your profile and inviting your first partner.

Best regards,
The Spotlight Circles Team`,
    referralNotification: `Hi {{receiverName}},

{{senderName}} has sent you a referral for {{clientName}}.

Client Details:
- Name: {{clientName}}
- Email: {{clientEmail}}
- Phone: {{clientPhone}}

Notes: {{clientNotes}}

Login to your dashboard to view and manage this referral.

Best regards,
The Spotlight Circles Team`,
    partnerInvite: `Hi,

{{senderName}} has invited you to join their professional network on Spotlight Circles.

Accept this invitation to start exchanging referrals and grow your business together.

Click here to join: {{inviteLink}}

Best regards,
The Spotlight Circles Team`,
  })

  const saveEmailSettings = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would save to database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Email settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const savePlatformSettings = async () => {
    setLoading(true)
    try {
      // In a real implementation, this would save to database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Platform settings saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save platform settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveEmailTemplate = async (templateName: string) => {
    setLoading(true)
    try {
      // In a real implementation, this would save to database
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: `${templateName} template saved successfully`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email template",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <AdminHeader
        title="System Settings"
        description="Configure platform settings, email templates, and system preferences"
      />

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Platform</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-brand-teal-600" />
                Email Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="senderName">Sender Name</Label>
                <Input
                  id="senderName"
                  value={emailSettings.senderName}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      senderName: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderEmail">Sender Email</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  value={emailSettings.senderEmail}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      senderEmail: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="replyTo">Reply-To Email</Label>
                <Input
                  id="replyTo"
                  type="email"
                  value={emailSettings.replyTo}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      replyTo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={saveEmailSettings}
                  disabled={loading}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Email Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Templates */}
        <TabsContent value="templates">
          <div className="space-y-6">
            {/* Welcome Email Template */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome Email Template</CardTitle>
                <p className="text-sm text-gray-500">
                  Sent to new users after signup
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{"{{firstName}}"}</Badge>
                  <Badge variant="outline">{"{{lastName}}"}</Badge>
                  <Badge variant="outline">{"{{email}}"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={emailTemplates.welcomeEmail}
                  onChange={(e) =>
                    setEmailTemplates({
                      ...emailTemplates,
                      welcomeEmail: e.target.value,
                    })
                  }
                  rows={8}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => saveEmailTemplate("Welcome Email")}
                  disabled={loading}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </CardContent>
            </Card>

            {/* Referral Notification Template */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Notification Template</CardTitle>
                <p className="text-sm text-gray-500">
                  Sent when a referral is received
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{"{{receiverName}}"}</Badge>
                  <Badge variant="outline">{"{{senderName}}"}</Badge>
                  <Badge variant="outline">{"{{clientName}}"}</Badge>
                  <Badge variant="outline">{"{{clientEmail}}"}</Badge>
                  <Badge variant="outline">{"{{clientPhone}}"}</Badge>
                  <Badge variant="outline">{"{{clientNotes}}"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={emailTemplates.referralNotification}
                  onChange={(e) =>
                    setEmailTemplates({
                      ...emailTemplates,
                      referralNotification: e.target.value,
                    })
                  }
                  rows={12}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => saveEmailTemplate("Referral Notification")}
                  disabled={loading}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </CardContent>
            </Card>

            {/* Partner Invite Template */}
            <Card>
              <CardHeader>
                <CardTitle>Partner Invitation Template</CardTitle>
                <p className="text-sm text-gray-500">
                  Sent when inviting a new partner
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{"{{senderName}}"}</Badge>
                  <Badge variant="outline">{"{{inviteLink}}"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={emailTemplates.partnerInvite}
                  onChange={(e) =>
                    setEmailTemplates({
                      ...emailTemplates,
                      partnerInvite: e.target.value,
                    })
                  }
                  rows={10}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => saveEmailTemplate("Partner Invitation")}
                  disabled={loading}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Platform Settings */}
        <TabsContent value="platform">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-brand-teal-600" />
                Platform Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="signupEnabled" className="text-base">
                    User Signups
                  </Label>
                  <p className="text-sm text-gray-500">
                    Allow new users to create accounts
                  </p>
                </div>
                <Button
                  variant={platformSettings.signupEnabled ? "default" : "outline"}
                  onClick={() =>
                    setPlatformSettings({
                      ...platformSettings,
                      signupEnabled: !platformSettings.signupEnabled,
                    })
                  }
                  className={
                    platformSettings.signupEnabled
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }
                >
                  {platformSettings.signupEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode" className="text-base">
                    Maintenance Mode
                  </Label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable access to the platform
                  </p>
                </div>
                <Button
                  variant={
                    platformSettings.maintenanceMode ? "destructive" : "outline"
                  }
                  onClick={() =>
                    setPlatformSettings({
                      ...platformSettings,
                      maintenanceMode: !platformSettings.maintenanceMode,
                    })
                  }
                >
                  {platformSettings.maintenanceMode ? "Active" : "Inactive"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailVerification" className="text-base">
                    Email Verification
                  </Label>
                  <p className="text-sm text-gray-500">
                    Require users to verify their email
                  </p>
                </div>
                <Button
                  variant={
                    platformSettings.requireEmailVerification
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setPlatformSettings({
                      ...platformSettings,
                      requireEmailVerification:
                        !platformSettings.requireEmailVerification,
                    })
                  }
                >
                  {platformSettings.requireEmailVerification
                    ? "Required"
                    : "Optional"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPartners">Max Partners Per User</Label>
                <Input
                  id="maxPartners"
                  type="number"
                  value={platformSettings.maxPartnersPerUser}
                  onChange={(e) =>
                    setPlatformSettings({
                      ...platformSettings,
                      maxPartnersPerUser: parseInt(e.target.value) || 50,
                    })
                  }
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={savePlatformSettings}
                  disabled={loading}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Platform Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-brand-teal-600" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-yellow-50 p-4">
                <h4 className="font-medium text-yellow-900 mb-2">
                  Security Features
                </h4>
                <ul className="space-y-2 text-sm text-yellow-800">
                  <li>✓ Password hashing with bcrypt (12 rounds)</li>
                  <li>✓ JWT session management</li>
                  <li>✓ Role-based access control</li>
                  <li>✓ Protected API routes</li>
                  <li>✓ CSRF protection</li>
                </ul>
              </div>

              <div className="rounded-lg bg-brand-teal-50 p-4">
                <h4 className="font-medium text-brand-teal-900 mb-2">
                  Privacy Compliance
                </h4>
                <p className="text-sm text-brand-teal-800">
                  Ensure your platform complies with GDPR, CCPA, and other
                  privacy regulations. Review user data handling and implement
                  necessary consent mechanisms.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Monitor, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SharePartnersActionsProps {
  referralSlug: string
}

export function SharePartnersActions({ referralSlug }: SharePartnersActionsProps) {
  const [copied, setCopied] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)
  const [checked, setChecked] = useState(false)
  const { toast } = useToast()

  const handleCopyLink = () => {
    const url = `${window.location.origin}/p/${referralSlug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${window.location.origin}/p/${referralSlug}" width="100%" height="600" frameborder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    setEmbedCopied(true)
    toast({
      title: "Embed Code Copied!",
      description: "The embed code has been copied to clipboard.",
    })
    setTimeout(() => setEmbedCopied(false), 2000)
  }

  return (
    <>
      {/* Marketing Title */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Marketing Tips </h2>
      </div>

      {/* Integration Options - 2 per row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add a Link (Recommended) */}
        <Card className="border-2 border-brand-gold-300 relative">
          <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold-400 hover:bg-brand-gold-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Recommended (Easiest)
          </Badge>
          <CardHeader className="pt-8">
            <CardTitle className="text-lg">Add a Link to Your Website</CardTitle>
            <p className="text-sm text-gray-600 font-mono bg-gray-100 p-2 rounded">
              yourbusiness.com/trusted-partners
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Works with any website</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">No technical setup</p>
              </div>
            </div>
            <p className="text-xs text-gray-600">
              Suggested placements: top navigation, homepage section, footer
            </p>
            <Button 
              className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 text-white"
              onClick={handleCopyLink}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </CardContent>
        </Card>

        {/* Embed on a Page */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <Monitor className="h-6 w-6 text-brand-teal-600" />
              <Badge variant="outline" className="text-xs">Advanced</Badge>
            </div>
            <CardTitle className="text-lg">Embed on a Page</CardTitle>
            <p className="text-sm text-gray-600">
              Embed Your Trusted Partners List
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              Adds your Trusted Partners directly into an existing page.
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Looks native</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Updates automatically</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">White-label option</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-brand-teal-400 text-brand-teal-700 hover:bg-brand-teal-50"
              onClick={handleCopyEmbed}
            >
              {embedCopied ? "Copied!" : "Copy Embed Code"}
            </Button>
          </CardContent>
        </Card>

        {/* Use a QR Code */}
        <Card>
          <CardHeader>
            <QrCode className="h-6 w-6 text-brand-teal-600 mb-2" />
            <CardTitle className="text-lg">Use a QR Code</CardTitle>
            <p className="text-sm text-gray-600">
              Share In-Office or Print
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Great for physical locations</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">Clients browse anytime</p>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="h-32 w-32 mx-auto bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
              <div className="mt-2 space-y-1 text-xs text-gray-600">
                <p>• Waiting room poster</p>
                <p>• Front desk signage</p>
                <p>• Printed materials</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-brand-teal-400 text-brand-teal-700 hover:bg-brand-teal-50"
              onClick={() => window.location.href = '/dashboard/marketing'}
            >
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Create a Poster */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Create a Poster</CardTitle>
            <p className="text-sm text-gray-600">
              For your waiting room lobby.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              A poster is a great way to provide value to your clients while they wait.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="h-32 w-full bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                <p className="text-gray-400 text-sm">Poster Preview</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full border-brand-teal-400 text-brand-teal-700 hover:bg-brand-teal-50"
              onClick={() => window.location.href = '/dashboard/poster'}
            >
              Click Here to Create
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Checkbox */}
      {/* Hidden per user request */}
    </>
  )
}

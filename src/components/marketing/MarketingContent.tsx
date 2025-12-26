"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Download, Share2, Copy, ExternalLink, Check, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MarketingContentProps {
  profile: {
    referralSlug: string
    qrCodeUrl: string | null
    linkClicks: number | null
  }
  profileUrl: string
}

export default function MarketingContent({ profile, profileUrl }: MarketingContentProps) {
  const [copied, setCopied] = useState(false)
  const [embedCopied, setEmbedCopied] = useState(false)
  const { toast } = useToast()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyEmbed = () => {
    const embedCode = `<iframe src="${profileUrl}" width="100%" height="600" frameborder="0"></iframe>`
    navigator.clipboard.writeText(embedCode)
    setEmbedCopied(true)
    setTimeout(() => setEmbedCopied(false), 2000)
    toast({
      title: "Embed Code Copied!",
      description: "The embed code has been copied to clipboard.",
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top: Share Your Trusted Partners Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Share Your Trusted Partners with Your Clients</h2>
        <p className="text-gray-600 mb-4">This is how referrals multiply. When clients can access your trusted professionals, your Circle begins working for you—automatically.</p>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-teal-700">
              <Lightbulb className="h-5 w-5" />
              Why this step matters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Clients often ask: "Do you know someone good for...?"</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">This page answers that question instantly</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Members who share their Circle receive up to 3× more referrals*</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700 font-semibold">No ads <Check className="h-4 w-4 inline ml-1" /> No selling</p>
            </div>
            <div className="flex items-start gap-2">
              <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">Just trusted introductions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Materials Section */}
      <div>
        <h1 className="text-3xl font-bold">Marketing Materials</h1>
        <p className="text-gray-600 mt-1">
          Download and share your referral materials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Website Link Card */}
        <Card className="border-2 border-orange-200 bg-orange-50/30">
          <div className="absolute top-4 right-4">
            <span className="bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded">Recommended</span>
          </div>
          <CardHeader>
            <CardTitle>Add a Link to Your Website</CardTitle>
            <CardDescription>
              Works with any website • No technical setup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2 font-medium">Your Link:</p>
              <code className="block text-sm bg-gray-50 px-3 py-2 rounded border border-gray-300 overflow-x-auto">
                {profileUrl}
              </code>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Suggested placements: top bar navigation, homepage section, footer</span>
              </li>
            </ul>
            <Button
              className="w-full bg-brand-teal-600 hover:bg-brand-teal-700"
              onClick={handleCopyLink}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Embed Code Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2 py-1 rounded">Advanced</span>
            </div>
            <CardTitle>Embed on a Page</CardTitle>
            <CardDescription>
              Embed Your Trusted Partners List
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              Adds your Trusted Partners directly into an existing page.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Looks native</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Updates automatically</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>White-label option</span>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleCopyEmbed}
            >
              <Copy className="h-4 w-4 mr-2" />
              {embedCopied ? "Copied!" : "Copy Embed Code"}
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>Use a QR Code</CardTitle>
            <CardDescription>
              Share in-office or print
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.qrCodeUrl ? (
              <>
                <div className="flex justify-center bg-white p-4 rounded-lg border-2 border-gray-200">
                  <div className="relative w-40 h-40">
                    <Image
                      src={profile.qrCodeUrl}
                      alt="QR Code"
                      width={160}
                      height={160}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span>• Waiting room poster</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>• Front desk signage</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span>• Printed materials</span>
                  </li>
                </ul>
                <div className="space-y-2">
                  <a
                    href={profile.qrCodeUrl}
                    download={`${profile.referralSlug}-qr-code.png`}
                    className="w-full"
                  >
                    <Button className="w-full bg-brand-teal-600 hover:bg-brand-teal-700">
                      <Download className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </a>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">QR code not available</p>
            )}
          </CardContent>
        </Card>

        {/* Create Poster Card */}
        <Card>
          <CardHeader>
            <CardTitle>Create a Poster</CardTitle>
            <CardDescription>
              For your waiting room lobby.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-700">
              A poster is a great way to provide value to your clients while they wait.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-32">
              <p className="text-gray-400 text-sm">Poster Preview</p>
            </div>
            <Link href="/dashboard/poster">
              <Button className="w-full bg-brand-teal-600 hover:bg-brand-teal-700">
                Click Here to Create
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Why this step now appears at top */}
      </div>

      {/* Share Link Section - Moved Below */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Profile</CardTitle>
          <CardDescription>
            Share your referral link on social media
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-2 font-medium">Your Link:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-white px-3 py-2 rounded border border-gray-300 overflow-x-auto">
                  {profileUrl}
                </code>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-gray-700 mb-2">Share on:</p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out my professional profile&url=${encodeURIComponent(profileUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                </a>
                <a
                  href={`mailto:?subject=My Professional Profile&body=Check out my profile: ${profileUrl}`}
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Link Performance</CardTitle>
          <CardDescription>
            Track how many people have viewed your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-brand-teal-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Profile Views</p>
              <p className="text-4xl font-bold text-brand-teal-600">{profile.linkClicks || 0}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Link Clicks</p>
              <p className="text-2xl font-semibold text-gray-900">{profile.linkClicks || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Tips</CardTitle>
          <CardDescription>
            Get the most out of your referral materials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-teal-100 rounded-full flex items-center justify-center text-brand-teal-600 font-semibold">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Add QR Code to Business Cards</p>
                <p className="text-sm text-gray-600">
                  Print your QR code on the back of your business cards for easy scanning
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-teal-100 rounded-full flex items-center justify-center text-brand-teal-600 font-semibold">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Share on Social Media</p>
                <p className="text-sm text-gray-600">
                  Post your referral link on LinkedIn, Facebook, and Twitter to reach more people
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-teal-100 rounded-full flex items-center justify-center text-brand-teal-600 font-semibold">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Add to Email Signature</p>
                <p className="text-sm text-gray-600">
                  Include your referral link in your email signature for passive promotion
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-teal-100 rounded-full flex items-center justify-center text-brand-teal-600 font-semibold">
                4
              </div>
              <div>
                <p className="font-medium text-gray-900">Display QR Code at Your Office</p>
                <p className="text-sm text-gray-600">
                  Print and frame your QR code at your reception desk or waiting area
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


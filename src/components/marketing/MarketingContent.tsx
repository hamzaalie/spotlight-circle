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

      {/* Why Share Referrals Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Share Referrals?</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-1" />
            <p className="text-gray-700">Build even stronger client relationships</p>
          </div>
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-1" />
            <p className="text-gray-700">Receive more introductions over time</p>
          </div>
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-1" />
            <p className="text-gray-700">Multiply referrals without ads or pressure</p>
          </div>
        </div>
      </div>

      {/* How to Share in 3 Simple Steps */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Share in 3 Simple Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1: Place a Poster */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-brand-teal-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-lg text-brand-teal-700">Step 1</CardTitle>
              <p className="text-base font-semibold text-gray-900">Place a Poster<br />with QR Code</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Print a ready-made poster for your lobby or waiting area so clients can easily find your trusted partners.
              </p>
              <Link href="/dashboard/poster" className="block">
                <Button className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 mt-4 min-h-[44px]">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Poster
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Step 2: Add QR Code to Marketing */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-brand-teal-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-lg text-brand-teal-700">Step 2</CardTitle>
              <p className="text-base font-semibold text-gray-900">Add QR Code<br />to Marketing</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Include this QR code in your emails, business cards, and advertising to link directly to trusted partners.
              </p>
              {profile.qrCodeUrl ? (
                <a
                  href={profile.qrCodeUrl}
                  download={`${profile.referralSlug}-qr-code.png`}
                  className="block w-full"
                >
                  <Button className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 mt-4 min-h-[44px]">
                    <Download className="h-4 w-4 mr-2" />
                    Copy QR Code
                  </Button>
                </a>
              ) : (
                <Button className="w-full bg-gray-400 mt-4 min-h-[44px]" disabled>
                  QR Code Unavailable
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Step 3: Share Your Personal Link */}
          <Card className="bg-gradient-to-br from-gray-50 to-white">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-brand-teal-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <CardTitle className="text-lg text-brand-teal-700">Step 3</CardTitle>
              <p className="text-base font-semibold text-gray-900">Share Your<br />Personal Link</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                This link directs clients online to your curated, trusted referral partners page.
              </p>
              <Button
                className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 mt-4 min-h-[44px]"
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
                    Copy Referral Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

        </div>
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


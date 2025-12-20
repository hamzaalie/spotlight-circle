"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Download, Share2, Copy, ExternalLink, Check } from "lucide-react"

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing Materials</h1>
        <p className="text-gray-600 mt-1">
          Download and share your referral materials
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your QR Code</CardTitle>
            <CardDescription>
              Share this code on business cards, flyers, or social media
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.qrCodeUrl ? (
              <>
                <div className="flex justify-center bg-white p-6 rounded-lg border-2 border-gray-200">
                  <div className="relative w-64 h-64">
                    <Image
                      src={profile.qrCodeUrl}
                      alt="QR Code"
                      width={256}
                      height={256}
                      className="w-full h-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <a
                    href={profile.qrCodeUrl}
                    download={`${profile.referralSlug}-qr-code.png`}
                    className="w-full"
                  >
                    <Button className="w-full bg-brand-gold-400 hover:bg-brand-gold-500">
                      <Download className="h-4 w-4 mr-2" />
                      Download QR Code
                    </Button>
                  </a>
                  <p className="text-xs text-gray-500 text-center">
                    PNG format • 300x300px • High quality
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">QR code not available</p>
            )}
          </CardContent>
        </Card>

        {/* Share Link Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>
              Share this link to get more referrals
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

            <div className="space-y-2">
              <Button
                className="w-full bg-brand-gold-400 hover:bg-brand-gold-500"
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

              <Link href={`/p/${profile.referralSlug}`} target="_blank">
                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Page
                </Button>
              </Link>
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
      </div>

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


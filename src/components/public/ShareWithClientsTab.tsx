"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Download, Share2, Link as LinkIcon } from "lucide-react"
import Link from "next/link"

interface ShareWithClientsTabProps {
  profileUrl: string
  qrCodeUrl: string
  firstName: string
  lastName: string
}

export function ShareWithClientsTab({ profileUrl, qrCodeUrl, firstName, lastName }: ShareWithClientsTabProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    alert("Profile link copied to clipboard!")
  }

  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `${firstName}-${lastName}-QR-Code.png`
    link.click()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Share Your Profile</h2>
        <p className="text-gray-600">
          Share your profile with clients and get more referrals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Link Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Your Profile Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-mono break-all">{profileUrl}</p>
            </div>
            <Button onClick={copyToClipboard} className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              Your QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center bg-white p-4 rounded-lg border-2 border-gray-200">
              <img src={qrCodeUrl} alt="Profile QR Code" className="w-48 h-48" />
            </div>
            <Button onClick={downloadQRCode} variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Materials */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Create professional posters and flyers to share your referral circle
          </p>
          <Link href="/dashboard/marketing">
            <Button className="bg-brand-teal-500 hover:bg-brand-teal-600">
              View All Marketing Tools
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

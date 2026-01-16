"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Download, Share2, Copy, ExternalLink, Check, Lightbulb, QrCode, Mail, FileText, CreditCard, Printer } from "lucide-react"
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
  const { toast } = useToast()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    })
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6">
      {/* Why This Step Matters Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <Lightbulb className="h-6 w-6 text-brand-teal-700 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why this step matters</h2>
            <p className="text-gray-700 mb-4">Clients often ask: "Do you know someone good for...?"</p>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-gray-700">This page answers that question instantly.</p>
            <p className="text-gray-700">Members who share their Circle receive up to <span className="font-bold text-2xl text-brand-teal-700">3× more referrals*</span></p>
            <div className="flex flex-wrap gap-4 mt-2">
              <span className="text-gray-700">• No ads</span>
              <span className="text-gray-700">• No selling</span>
            </div>
            <p className="text-gray-700 italic">Just trusted introductions</p>
          </div>
        </div>
      </div>

      {/* Step 1: Share Your Referral Link or QR Code */}
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gray-100 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-teal-600 text-white flex items-center justify-center font-bold text-xl">
              1
            </div>
            <CardTitle className="text-2xl text-gray-800">Share Your Referral Link or QR Code Anywhere Clients See You</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-8 bg-gray-50">
          <div className="grid md:grid-cols-[1.5fr,1fr] gap-8">
            <div>
              <p className="text-lg text-gray-700 mb-6">Your personal Spotlight Circles page link and QR code work everywhere:</p>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-8">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Website (Trusted Partners page)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Email signature</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Email signature</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Invoices & statements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Invoices & statements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Business cards</span>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-5 mb-6">
                <p className="text-base text-gray-800 mb-2">
                  <strong className="font-bold">Pro tip:</strong> Add one simple line to your signature:
                </p>
                <p className="text-base text-gray-700 italic font-medium">
                  "Trusted professionals I recommend →"
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleCopyLink}
                  size="lg"
                  className="flex-1 bg-brand-teal-600 hover:bg-brand-teal-700 text-base font-medium h-12"
                >
                  {copied ? (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 mr-2" />
                      Copy Referral Link
                    </>
                  )}
                </Button>
                {profile.qrCodeUrl && (
                  <Button
                    asChild
                    size="lg"
                    className="flex-1 bg-brand-teal-600 hover:bg-brand-teal-700 text-base font-medium h-12"
                  >
                    <a href={profile.qrCodeUrl} download>
                      <QrCode className="h-5 w-5 mr-2" />
                      QR Code
                    </a>
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center">
              {profile.qrCodeUrl ? (
                <div className="border-8 border-white rounded-xl shadow-2xl bg-white p-2">
                  <img
                    src={profile.qrCodeUrl}
                    alt="QR Code"
                    className="w-56 h-56"
                  />
                </div>
              ) : (
                <div className="border-8 border-white rounded-xl shadow-2xl bg-gray-100 p-8 text-center w-64 h-64 flex flex-col items-center justify-center">
                  <QrCode className="h-32 w-32 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">QR Code will appear here</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Multipurpose In-Office Promotion */}
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gray-100 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-teal-600 text-white flex items-center justify-center font-bold text-xl">
              2
            </div>
            <div>
              <CardTitle className="text-2xl text-gray-800">
                Multipurpose In-Office Promotion <span className="text-brand-teal-600">(High Impact)</span>
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8 bg-gray-50">
          <div className="grid md:grid-cols-[1fr,1.3fr] gap-8">
            <div>
              <p className="text-lg text-gray-700 mb-6">Turn foot traffic into referral growth.</p>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Lobby poster</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Brochures</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Simple <span className="italic">and effective</span> awareness</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Intake folders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Rack straight to</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-brand-teal-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">Business cards</span>
                </div>
              </div>

              <p className="text-base text-gray-700 mb-6 font-medium">
                Invoices, statements, and receipts—highly visible
              </p>

              <Link href="/dashboard/poster">
                <Button size="lg" className="w-full bg-brand-teal-600 hover:bg-brand-teal-700 text-base font-medium h-12">
                  <Printer className="h-5 w-5 mr-2" />
                  Create In-Office Materials
                </Button>
              </Link>
            </div>

            <div className="relative flex items-center justify-center">
              {/* Decorative plant image background */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-green-100 to-transparent rounded-full blur-3xl"></div>
              </div>
              
              {/* Poster mockup on wooden stand */}
              <div className="relative w-full max-w-xl">
                <div className="bg-white rounded-lg shadow-2xl border-4 border-gray-200 p-6 w-full">
                  <h3 className="text-center font-bold text-2xl text-gray-900 mb-4 leading-tight">
                    Looking for<br />Trusted Professionals?
                  </h3>
                  
                  {/* Professional profiles grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { name: 'Jason Smint', role: 'Nototor' },
                      { name: 'Poor Jonnen', role: 'Attorney' },
                      { name: 'Marty Clack', role: 'Pinurttyl annus' },
                      { name: 'Marily Clack', role: 'Home Inspector' }
                    ].map((prof, idx) => (
                      <div key={idx} className="bg-gray-100 rounded-lg p-3 text-center border-2 border-gray-200">
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full mx-auto mb-2"></div>
                        <p className="text-xs font-bold text-gray-900 leading-tight">{prof.name}</p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{prof.role}</p>
                      </div>
                    ))}
                  </div>

                  {/* QR Code section */}
                  <div className="text-center border-t-2 border-gray-200 pt-3">
                    <p className="text-xs text-gray-700 mb-2 font-semibold">Scan for more trusted partners</p>
                    <div className="w-28 h-28 bg-white border-4 border-brand-teal-600 mx-auto mb-2 flex items-center justify-center">
                      {profile.qrCodeUrl ? (
                        <img src={profile.qrCodeUrl} alt="QR Code" className="w-24 h-24" />
                      ) : (
                        <QrCode className="h-20 w-20 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-brand-teal-600">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a2 2 0 114 0 2 2 0 01-4 0z"/>
                      </svg>
                      <p className="text-sm font-bold">Your Business</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">& Your Logo</p>
                  </div>
                </div>
                
                {/* Wooden stand effect */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-4 bg-gradient-to-b from-amber-600 to-amber-700 rounded-b-lg"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What to Expect When You Share */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Check className="h-6 w-6" />
            What to Expect When You Share:
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-gray-800">Clients choose who they want to be introduced to</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-gray-800">You're notified when an introduction is requested</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-gray-800">Your partners see where referrals come from</p>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-700 flex-shrink-0 mt-0.5" />
            <p className="text-gray-800">Everything is tracked quietly in the background</p>
          </div>

          <div className="mt-6 pt-4 border-t border-green-300">
            <p className="text-sm text-gray-700 italic">
              Members who consistently share their Circle with clients receive <span className="font-bold text-green-800">significantly more referrals over time</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


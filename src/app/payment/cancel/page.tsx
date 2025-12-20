import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
          <CardDescription>
            Your subscription was not completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              No charges were made to your account. You can try again whenever you're ready.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Why subscribe to Spotlight Circles?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-brand-teal-600 mt-0.5">✓</span>
                <span>Build a trusted network of professional partners</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal-600 mt-0.5">✓</span>
                <span>Exchange quality referrals that convert</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal-600 mt-0.5">✓</span>
                <span>Track all your referrals in one place</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal-600 mt-0.5">✓</span>
                <span>AI-powered insights and partner matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-teal-600 mt-0.5">✓</span>
                <span>Marketing tools (QR codes, shareable links)</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <Link href="/dashboard">
              <Button className="w-full bg-brand-gold-400 hover:bg-brand-gold-500">
                Try Payment Again
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Return to Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t text-center">
            <p className="text-xs text-gray-500">
              Questions? Contact us at{" "}
              <a href="mailto:support@spotlightcircles.com" className="text-brand-teal-600 hover:underline">
                support@spotlightcircles.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


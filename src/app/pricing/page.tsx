import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { PublicNav } from "@/components/public/PublicNav"
import { PublicFooter } from "@/components/public/PublicFooter"

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-brand-teal-50 to-brand-gold-50">
        {/* Dotted Background Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(74, 144, 164, 0.15) 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-brand-gold-200/30 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-8">
              <span className="text-xs font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-5 py-2.5 rounded-full border border-brand-teal-500/30 uppercase tracking-wider">
                Pricing
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Simple, Transparent
              <br />
              <span className="text-brand-teal-600">Pricing</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Join a trusted network of professionals and start exchanging quality referrals today
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Setup Fee Banner */}
        <Card className="mb-12 bg-gradient-to-r from-purple-50 to-blue-50 border-brand-teal-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-16 h-16 bg-brand-teal-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">💎</span>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-brand-teal-900 mb-2">
                  One-Time Setup Fee: $19.95
                </h3>
                <p className="text-brand-teal-700">
                  New members pay a one-time $19.95 setup fee to join our exclusive network. 
                  This ensures we maintain a community of serious, committed professionals 
                  who are invested in building quality partnerships.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Monthly Plan */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Monthly Plan</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold text-gray-900">$9.95</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                {[
                  "Unlimited partner invitations",
                  "Unlimited referral exchanges",
                  "QR code & shareable links",
                  "Analytics dashboard",
                  "Email notifications",
                  "AI-powered bio generator",
                  "Profile customization",
                  "Marketing tools",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup">
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-lg py-6 mt-8">
                  Get Started
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">
                Cancel anytime
              </p>
            </CardContent>
          </Card>

          {/* Annual Plan */}
          <Card className="border-2 border-brand-teal-500 relative hover:shadow-xl transition-shadow">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-brand-teal-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
                BEST VALUE - Save $19.45
              </span>
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Annual Plan</CardTitle>
              <CardDescription>2 months free!</CardDescription>
              <div className="mt-4">
                <span className="text-5xl font-bold text-brand-teal-600">$99.95</span>
                <span className="text-gray-600 ml-2">/year</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Just $8.33/month - Save $19.45 annually
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-4">
                {[
                  "All Monthly Plan features",
                  "2 months FREE ($58 savings)",
                  "Priority support",
                  "Early access to new features",
                  "Advanced analytics",
                  "Partner gap analysis",
                  "Client forecasting",
                  "Automated follow-ups",
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/signup">
                <Button className="w-full bg-brand-gold-400 hover:bg-brand-gold-500 text-lg py-6 mt-8">
                  Get Started - Save $19.45
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">
                Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>

        {/* What's Included Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Grow Your Business
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-brand-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Trusted Network
              </h3>
              <p className="text-gray-600 text-sm">
                Build partnerships with verified professionals in complementary fields
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-brand-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Track Everything
              </h3>
              <p className="text-gray-600 text-sm">
                Manage all your referrals with status tracking and analytics
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Grow Faster
              </h3>
              <p className="text-gray-600 text-sm">
                AI-powered insights help you identify opportunities and close more deals
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Why is there a setup fee?
              </h3>
              <p className="text-gray-600">
                The $19.95 setup fee ensures we attract serious professionals who are committed 
                to building quality partnerships. This investment helps maintain a high-quality 
                network and covers onboarding, verification, and platform access.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can cancel your subscription at any time through the billing portal. 
                You'll continue to have access until the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) 
                through our secure payment processor, Stripe.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your current billing period.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                How many referrals can I send/receive?
              </h3>
              <p className="text-gray-600">
                Unlimited! There are no limits on the number of partners you can invite or 
                referrals you can exchange. The more you engage, the more value you get.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 py-12 bg-gradient-to-r from-brand-teal-500 to-brand-gold-400 rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-xl text-brand-teal-50 mb-8 max-w-2xl mx-auto">
            Join hundreds of professionals who are building their referral networks
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-brand-teal-600 hover:bg-gray-100 text-lg px-8 py-6">
              Get Started
            </Button>
          </Link>
          <p className="text-brand-teal-50 text-sm mt-4">
            Cancel anytime
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  )
}


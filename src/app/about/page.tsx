import { PublicNav } from "@/components/public/PublicNav"
import { PublicFooter } from "@/components/public/PublicFooter"
import { Target, Users, Lightbulb, Rocket, Heart, TrendingUp, Award, Shield, Zap, CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Trust First",
      description:
        "Every feature we build starts with trust. We believe authentic relationships are the foundation of sustainable business growth.",
    },
    {
      icon: Users,
      title: "Community Over Competition",
      description:
        "Professionals thrive when they collaborate. We're building a platform that rewards generosity and mutual success.",
    },
    {
      icon: Lightbulb,
      title: "Innovation Through AI",
      description:
        "Technology should augment human relationships, not replace them. Our AI handles the logistics so you focus on connections.",
    },
  ]

  const stats = [
    { number: "150+", label: "Active Partners" },
    { number: "25Y", label: "Years Experience" },
    { number: "$6.6B", label: "Total Commissions" },
  ]

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
                About Us
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Building the Future of
              <br />
              <span className="text-brand-teal-600">
                Professional Networks
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help trusted professionals grow together through
              intelligent, transparent, and mutually beneficial referral relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-32 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-block mb-6">
                <span className="text-xs font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-5 py-2.5 rounded-full border border-brand-teal-500/30 uppercase tracking-wider">
                  Our Story
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why We Built Spotlight Circles
              </h2>
              <div className="mt-8 space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  The idea for Spotlight Circles was born from a simple observation:
                  professionals who rely on referrals were using outdated methods to
                  manage their most valuable business relationships.
                </p>
                <p>
                  Spreadsheets, sticky notes, and verbal agreements led to missed
                  opportunities, untracked introductions, and partnerships that faded
                  without anyone noticing. There had to be a better way.
                </p>
                <p>
                  We built Spotlight Circles to solve this problem with technology
                  that respects the human side of business. AI-powered partner
                  matching, automated follow-ups, and transparent tracking—all designed
                  to help professionals like real estate agents, mortgage advisors,
                  attorneys, and insurance brokers grow through trust.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-brand-teal-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">2025</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Launch & Growth</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Spotlight Circles launched with AI-powered partner matching and automated tracking.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-xl bg-brand-teal-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">2026</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">The Future</h3>
                    <p className="text-gray-600 leading-relaxed">
                      We're expanding with predictive analytics, CRM integrations, and industry-specific circles. Our mission: become the operating system for professional referral networks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 lg:py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-lg">
              <div className="w-16 h-16 rounded-xl bg-brand-teal-500 flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To empower professionals with AI-driven tools that make referral
                networking effortless, transparent, and profitable. We believe every
                professional deserves access to technology that amplifies their
                relationships and drives measurable growth.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-12 shadow-lg">
              <div className="w-16 h-16 rounded-xl bg-brand-teal-500 flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the operating system for professional referral networks
                worldwide. We envision a future where every trusted professional has a
                vibrant circle of partners, predictive insights into their network's
                potential, and automated systems that turn relationships into revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 lg:py-32 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-xs font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-5 py-2.5 rounded-full border border-brand-teal-500/30 uppercase tracking-wider">
                Our Values
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              The principles that guide every product decision and customer interaction
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-3xl p-8 text-center hover:border-brand-teal-400 transition-all shadow-lg">
                  <div className="w-16 h-16 rounded-xl bg-brand-teal-500 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20 lg:py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1">
                <div className="w-48 h-48 mx-auto rounded-2xl bg-brand-teal-500 flex items-center justify-center">
                  <span className="text-white font-bold text-6xl">SC</span>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-teal-500/20 px-4 py-2 mb-4 border border-brand-teal-500/30">
                  <span className="text-sm font-semibold text-brand-teal-400">
                    From the Founder
                  </span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Built by Professionals, for Professionals
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  "I spent 10 years in real estate watching talented professionals
                  struggle to build and maintain referral networks. The tools available
                  were either too complex, too expensive, or designed for enterprise
                  sales teams—not for the trusted professionals who power local
                  economies.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  Spotlight Circles is my answer to that problem. It's the platform I
                  wish I had when I was building my own network. Every feature is
                  battle-tested, every workflow is designed for speed, and every line
                  of code prioritizes trust and transparency.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  If you're a professional who believes in the power of relationships,
                  I built this for you."
                </p>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-900 font-semibold text-lg">Spotlight Circles Team</p>
                  <p className="text-brand-teal-400">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-12 lg:p-16 text-center bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200 rounded-3xl">
            <TrendingUp className="w-16 h-16 mx-auto mb-6 text-brand-teal-600" />
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Be part of the movement transforming how professionals build and grow
              through trusted referral networks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-brand-gold-400 hover:bg-brand-gold-500 rounded-lg transition-all"
              >
                Start Your Free Trial
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-900 border border-gray-300 hover:bg-gray-100 rounded-lg transition-all"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}


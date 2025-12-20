"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PublicNav } from "@/components/public/PublicNav"
import { PublicFooter } from "@/components/public/PublicFooter"
import {
  Users,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Target,
  ArrowRight,
  CheckCircle2,
  Building2,
  BarChart3,
  Clock,
  UserCheck,
  Star,
  Send,
  Home,
  Briefcase,
  GraduationCap,
  Heart,
  Smartphone,
  DollarSign,
  Award,
  Globe,
  ChevronDown,
} from "lucide-react"

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-brand-teal-400 transition-all shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 text-left flex items-start justify-between gap-4"
      >
        <h3 className="text-lg font-bold text-gray-900 flex-1">{question}</h3>
        <ChevronDown
          className={`w-5 h-5 text-brand-teal-400 flex-shrink-0 mt-1 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-6">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function HomePage() {
  const [animationStarted, setAnimationStarted] = useState(false)

  // Start animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimationStarted(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const circleProfessionals = [
    { icon: Briefcase, label: "Real Estate", color: "blue" },
    { icon: DollarSign, label: "Finance", color: "green" },
    { icon: Shield, label: "Insurance", color: "purple" },
    { icon: Heart, label: "Healthcare", color: "red" },
    { icon: GraduationCap, label: "Education", color: "yellow" },
    { icon: Building2, label: "Legal", color: "indigo" },
    { icon: Home, label: "Home Services", color: "orange" },
    { icon: BarChart3, label: "Accounting", color: "teal" },
    { icon: Clock, label: "Consulting", color: "pink" },
  ]

  const sectors = [
    { icon: Briefcase, label: "Real Estate", count: 12 },
    { icon: DollarSign, label: "Finance", count: 8 },
    { icon: Shield, label: "Insurance", count: 6 },
    { icon: Heart, label: "Health", count: 10 },
    { icon: GraduationCap, label: "Education", count: 7 },
    { icon: Smartphone, label: "Technology", count: 9 },
    { icon: Home, label: "Home Services", count: 5 },
    { icon: Globe, label: "Travel", count: 4 },
  ]

  const steps = [
    {
      icon: UserCheck,
      title: "Sign up account",
      description: "Sign up your new account & complete your profile",
    },
    {
      icon: Send,
      title: "Request for permission",
      description: "Choose affiliate plan & request to admin for affiliate permission",
    },
    {
      icon: CheckCircle2,
      title: "Approved request",
      description: "You get a mail after approved your request & start your work",
    },
  ]

  const stats = [
    { number: "190+", label: "We provide service 190+ countries for marketing" },
    { number: "25Y", label: "We have 25 years work experiences in here" },
    { number: "6.6B", label: "All ready we reach $6.6 billion for paid affiliate" },
  ]

  const aboutBenefits = [
    "Passive income potential",
    "Low startup costs",
    "Flexible work schedule",
    "No customer support needed",
  ]

  const whyChooseCards = [
    {
      title: "High commission",
      description: "we offer high rate for cpa",
      color: "blue",
    },
    {
      title: "Dedicated support",
      description: "24/7 Customer support",
      color: "orange",
    },
    {
      title: "Fast paid",
      description: "Commission fast paid",
      color: "green",
    },
  ]

  const testimonials = [
    {
      name: "Emily Carter",
      role: "Digital Marketer",
      company: "BrightWave",
      content:
        "Exceptional service and fast support! The platform helped me scale my affiliate campaigns like never before.",
      rating: 5,
    },
    {
      name: "Ahmed Khan",
      role: "Affiliate Manager",
      company: "ClickMax",
      content:
        "Very intuitive dashboard and strong tracking tools. I'd love to see more payout options in the future.",
      rating: 4,
    },
    {
      name: "Sophia Laurent",
      role: "Founder",
      company: "AdSprint Media",
      content:
        "We've worked with multiple networks, but this platform exceeded our expectations in both results and support.",
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: "How do affiliates get paid?",
      answer:
        "Affiliates earn commissions through tracked conversions such as clicks or sales, with payouts typically made weekly or monthly.",
    },
    {
      question: "Is affiliate marketing profitable?",
      answer:
        "Yes, many marketers earn substantial income, but success depends on strategy, consistency, and the niche.",
    },
    {
      question: "Can I do affiliate marketing for free?",
      answer:
        "Yes, you can start with free tools like social media and content blogs, though paid ads can accelerate results.",
    },
    {
      question: "What mistakes should I avoid?",
      answer:
        "Avoid promoting low-quality products, ignoring audience needs, or failing to track performance metrics.",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <PublicNav />

      {/* Hero Banner Section */}
      <section className="relative pt-24 pb-16 lg:pt-28 lg:pb-20 overflow-hidden bg-gradient-to-br from-brand-teal-50 to-brand-gold-50">
        {/* Dotted Background Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(74, 144, 164, 0.15) 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}></div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-teal-200/40 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-40 w-48 h-48 bg-brand-gold-200/40 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-brand-teal-100/40 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-8 items-center">
            {/* Left Side - Featured Professional */}
            <div className="order-2 lg:order-1">
              <div className="inline-block mb-8">
                <span className="text-xs font-semibold text-brand-teal-600 bg-brand-teal-500/10 px-5 py-2.5 rounded-full border border-brand-teal-500/30 uppercase tracking-wider">
                  Professional Networking Platform
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-5 leading-tight">
                Grow Your Revenues
                <br />
                by Joining a <span className="text-brand-teal-600">Circle</span>
                <br />
                <span className="text-brand-teal-600">of Trusted Professionals</span>
              </h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Connect with non-competing professionals who share your commitment to excellence and mutual growth
              </p>

              {/* Featured Professional Card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 max-w-lg shadow-lg">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-teal-500 to-brand-teal-600 flex items-center justify-center flex-shrink-0">
                      <Heart className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Dr. Sarah Chen</h3>
                      <p className="text-brand-teal-600 font-semibold text-sm">Veterinarian</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pl-6 border-l border-gray-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-teal-600">47</div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">Referrals Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-gold-600">52</div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">Referrals Received</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <Link href="/auth/signup">
                  <Button
                    size="lg"
                    className="text-base px-10 py-6 bg-brand-gold-400 hover:bg-brand-gold-500 text-white shadow-2xl shadow-brand-gold-400/50 rounded-full font-semibold transition-all hover:scale-105"
                  >
                    Join Your Circle
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Animated Circle Formation with Logo */}
            <div className="order-1 lg:order-2 relative h-[450px] lg:h-[550px] flex items-center justify-center">
              {circleProfessionals.map((professional, index) => {
                const Icon = professional.icon
                // Calculate circle position
                const angle = (index * 360) / 9
                const radius = 190
                const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius
                const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius

                return (
                  <div
                    key={index}
                    className="absolute transition-all duration-1000 ease-out"
                    style={{
                      transform: animationStarted
                        ? `translate(${x}px, ${y}px) scale(1)`
                        : `translate(0px, 0px) scale(0.5)`,
                      opacity: animationStarted ? 1 : 0,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="bg-white border border-brand-teal-200 rounded-xl p-3.5 hover:border-brand-teal-400 transition-all hover:scale-105 cursor-pointer shadow-lg w-28 h-28">
                      <div className="flex flex-col items-center justify-center gap-2 h-full">
                        <div className="w-12 h-12 rounded-lg bg-brand-teal-50 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-brand-teal-600" />
                        </div>
                        <p className="text-xs text-gray-700 font-medium text-center leading-tight">{professional.label}</p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Center Circle with Logo */}
              <div 
                className="absolute bg-white border-4 border-brand-teal-400 rounded-full w-32 h-32 flex items-center justify-center shadow-2xl transition-all duration-1000 p-4"
                style={{
                  opacity: animationStarted ? 1 : 0,
                  transform: animationStarted ? 'scale(1)' : 'scale(0)',
                  transitionDelay: '1000ms',
                }}
              >
                <img src="/images/logo.png" alt="Spotlight Circles" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-gray-200">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                  <Users className="w-32 h-32 text-brand-teal-500/50" />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-brand-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                EASY TO EARN
              </div>
              <div className="absolute -bottom-4 -left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                NO NEED INVEST
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-block mb-6">
                <span className="text-sm font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-4 py-2 rounded-full border border-brand-teal-500/20">
                  OVER 150K+ CLIENT
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                We are world best affiliate marketing platform
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Affiliate is perfect for grow your business & you can earn lot of money by affiliate marketing, we all time ready for you
              </p>

              <ul className="space-y-3 mb-8">
                {aboutBenefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-brand-teal-400 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>

              <Link href="/contact">
                <Button className="bg-brand-gold-400 hover:bg-brand-gold-500 text-white px-8 py-6 rounded-full">
                  Know More
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32 bg-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(139,92,246,0.05),transparent_50%)]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-4 py-2 rounded-full border border-brand-teal-500/20">
                How It Work
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Easy and simple way to
              <br />
              <span className="text-brand-teal-600">start partnership</span>
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div key={index} className="text-center">
                  {/* Numbered circle with icon */}
                  <div className="relative inline-flex items-center justify-center mb-8">
                    <div className="w-40 h-40 rounded-full border-4 border-brand-teal-500 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center relative">
                      <Icon className="w-16 h-16 text-brand-teal-600" />
                      {/* Number badge */}
                      <div className="absolute -top-2 -left-2 w-12 h-12 rounded-full bg-brand-teal-500 border-4 border-white flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse">
            {/* Left - Images Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl flex items-center justify-center border border-gray-200">
                  <Award className="w-16 h-16 text-brand-teal-500/70" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl flex items-center justify-center border border-gray-200">
                  <Shield className="w-16 h-16 text-brand-teal-500/70" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl flex items-center justify-center border border-gray-200">
                  <Zap className="w-16 h-16 text-green-500/70" />
                </div>
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl flex items-center justify-center border border-gray-200">
                  <TrendingUp className="w-16 h-16 text-brand-teal-500/70" />
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-block mb-6">
                <span className="text-sm font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-4 py-2 rounded-full border border-brand-teal-500/20">
                  WHY CHOOSE US
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why you should choose us for Affiliate
              </h2>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Affiliate is perfect for grow your business & you can earn lot of money by affiliate marketing, we all time ready for you
              </p>

              <div className="space-y-4">
                {whyChooseCards.map((card, index) => (
                  <div
                    key={index}
                    className={`p-6 rounded-2xl border ${
                      card.color === 'blue'
                        ? 'bg-brand-teal-50 border-brand-teal-200'
                        : card.color === 'orange'
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-green-50 border-green-200'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-12">
            <div>
              <div className="inline-block mb-6">
                <span className="text-sm font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-4 py-2 rounded-full border border-brand-teal-500/20">
                  FEEDBACK
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Over 1,000+ clients trust our service and support
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-3xl p-8 shadow-lg"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{testimonial.role}, {testimonial.company}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-12 lg:p-16 border border-gray-200 overflow-hidden">
            {/* Background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal-100/40 rounded-full blur-3xl"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <span className="text-sm font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-4 py-2 rounded-full border border-brand-teal-500/20">
                    MONETIZE YOUR TRAFFIC
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Become an Affiliate
                </h2>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Over 100,000 affiliates worldwide choose us as their preferred marketplace, and for a good reason: we've paid over $6.6 billion in commissions on time for more than 25 years
                </p>

                <Link href="/auth/signup">
                  <Button className="bg-brand-gold-400 hover:bg-brand-gold-500 text-white px-8 py-6 rounded-full text-lg">
                    Become an Affiliate
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="relative hidden lg:block">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl flex items-center justify-center border border-gray-200">
                  <Target className="w-32 h-32 text-brand-teal-500/70" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-sm font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-4 py-2 rounded-full border border-brand-teal-500/20">
                FAQ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Get quick answers to common questions about affiliate marketing and how our platform works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button className="bg-brand-gold-400 hover:bg-brand-gold-500 text-white px-8 py-6 rounded-full">
                Know More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}


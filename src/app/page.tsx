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
  Sparkles,
  UserPlus,
  Share2,
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
    { img: "/landing-page/images/Insurance agent.png", label: "Insurance Agent" },
    { img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", label: "Dentist" },
    { img: "/landing-page/images/realtor.png", label: "Realtor" },
    { img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80", label: "Veterinarian" },
    { img: "/landing-page/images/interior designer.jpg", label: "Interior Designer" },
    { img: "/landing-page/images/Hair stylist.jpg", label: "Hair Stylist" },
  ]

  // Rotating professionals for the animation section
  const [currentProfessionalIndex, setCurrentProfessionalIndex] = useState(0)
  const rotatingSampleProfessionals = [
    { name: "Dr. Sarah Chen", title: "Dentist", referralsSent: 47, referralsReceived: 52, icon: Heart },
    { name: "Maria ", title: "Interior Designer", referralsSent: 38, referralsReceived: 41, icon: Home },
    { name: "James Miller", title: "Insurance Agent", referralsSent: 55, referralsReceived: 49, icon: Shield },
  ]

  // Rotate through professionals every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentProfessionalIndex((prev) => (prev + 1) % rotatingSampleProfessionals.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

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
      number: 1,
      title: "Create Your Profile",
      tasks: [
        "Add a short bio",
        "Describe your services",
        "Provide a list of trusted referral partners"
      ],
      result: "Your profile is created",
    },
    {
      icon: Send,
      number: 2,
      title: "Invite Your Referral Partners",
      tasks: [
        "We notify your referral partners",
        "They create their own profile"
      ],
      result: "Your circle begins to grow",
    },
    {
      icon: Target,
      number: 3,
      title: "Share With Clients",
      tasks: [
        "We create a referral link and QR code that you can share with your Clients",
        "We create a referral poster for your lobby or waiting area"
      ],
      result: "Clients access your circle",
    },
    {
      icon: CheckCircle2,
      number: 4,
      title: "Clients Choose, We Track",
      tasks: [
        "Clients click a link or scan a code",
        "We track every referral"
      ],
      result: "Both parties are notified",
    },
  ]

  const testimonials = [
    {
      name: "Dr. Emily Carter",
      role: "Dentist",
      company: "Smile Dental Care",
      content:
        "Spotlight Circles has transformed how I connect with clients. The referrals from my network are high-quality and perfectly aligned with my practice.",
      rating: 5,
    },
    {
      name: "Ahmed Khan",
      role: "Real Estate Agent",
      company: "Prime Realty Group",
      content:
        "Building my referral circle was effortless. I've seen a 40% increase in qualified leads without spending a dime on advertising.",
      rating: 5,
    },
    {
      name: "Sophia Laurent",
      role: "Attorney",
      company: "Laurent Legal Services",
      content:
        "The platform makes it easy to track referrals and stay connected with my professional network. It's been invaluable for growing my practice.",
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: "How does Spotlight Circles work?",
      answer:
        "Create your profile, invite trusted non-competing professionals to join your circle, and share your referral link with clients. When clients need services, they can choose from your trusted circle, and both parties get notified.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Spotlight Circles offers flexible pricing plans to match your needs. Check out our pricing page to find the plan that's right for you.",
    },
    {
      question: "What types of professionals can join?",
      answer:
        "Any service-based professional can join—dentists, real estate agents, attorneys, insurance agents, interior designers, hair stylists, and more. The key is building a circle of non-competing professionals.",
    },
    {
      question: "How do I track my referrals?",
      answer:
        "Our platform automatically tracks when clients click your referral links or scan QR codes. You'll receive real-time notifications and can view detailed analytics in your dashboard.",
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
                  A Professional Networking Platform
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-5 leading-tight">
                Grow Your Revenues
                <br />
                by <span className="text-brand-teal-600">Creating a Circle</span>
                <br />
                <span className="text-brand-teal-600">of Trusted Professionals</span>
              </h1>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Generate referrals through trusted, non-competing partners – without the cost of expensive advertising.
              </p>

              {/* Featured Professional Card - Rotating */}
              <div className="bg-white border border-gray-200 rounded-2xl p-5 max-w-lg shadow-lg transition-all duration-500">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-teal-500 to-brand-teal-600 flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const CurrentIcon = rotatingSampleProfessionals[currentProfessionalIndex].icon
                        return <CurrentIcon className="w-7 h-7 text-white" />
                      })()}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {rotatingSampleProfessionals[currentProfessionalIndex].name}
                      </h3>
                      <p className="text-brand-teal-600 font-semibold text-sm">
                        {rotatingSampleProfessionals[currentProfessionalIndex].title}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pl-6 border-l border-gray-200">
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-teal-600">
                        {rotatingSampleProfessionals[currentProfessionalIndex].referralsSent}
                      </div>
                      <div className="text-xs text-gray-600 whitespace-nowrap">Referrals Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-gold-600">
                        {rotatingSampleProfessionals[currentProfessionalIndex].referralsReceived}
                      </div>
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
                    Create Your Circle
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Animated Circle Formation with Photos */}
            <div className="order-1 lg:order-2 relative h-[450px] lg:h-[550px] flex items-center justify-center">
              {/* SVG Layer for Dotted Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {circleProfessionals.map((_, index) => {
                  const angle = (index * 360) / 6 - 90
                  const radian = (angle * Math.PI) / 180
                  const lineLengthFactor = 35
                  const x2 = 50 + Math.cos(radian) * lineLengthFactor
                  const y2 = 50 + Math.sin(radian) * lineLengthFactor
                  return (
                    <line
                      key={index}
                      x1="50%"
                      y1="50%"
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      stroke="#cbd5e1"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      style={{
                        opacity: animationStarted ? 1 : 0,
                        transition: 'opacity 0.5s ease-out',
                        transitionDelay: `${800 + index * 100}ms`,
                      }}
                    />
                  )
                })}
              </svg>

              {circleProfessionals.map((professional, index) => {
                // Calculate circle position for 6 professionals
                const angle = (index * 360) / 6
                const radius = 180
                const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius
                const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius

                return (
                  <div
                    key={index}
                    className="absolute z-10 transition-all duration-1000 ease-out"
                    style={{
                      transform: animationStarted
                        ? `translate(${x}px, ${y}px) scale(1)`
                        : `translate(0px, 0px) scale(0.5)`,
                      opacity: animationStarted ? 1 : 0,
                      transitionDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-1.5 rounded-full shadow-xl transition-all hover:scale-110 hover:shadow-2xl cursor-pointer w-20 h-20 lg:w-24 lg:h-24">
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img 
                            src={professional.img} 
                            alt={professional.label}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-700 mt-2 whitespace-nowrap">{professional.label}</span>
                    </div>
                  </div>
                )
              })}

              {/* Center Circle with Photo */}
              <div 
                className="absolute z-20 bg-white rounded-full shadow-2xl p-2 transition-all duration-1000 w-28 h-28 lg:w-36 lg:h-36"
                style={{
                  opacity: animationStarted ? 1 : 0,
                  transform: animationStarted ? 'scale(1)' : 'scale(0)',
                  transitionDelay: '600ms',
                }}
              >
                <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-white">
                  <img 
                    src="/landing-page/images/Center photo.png" 
                    alt="Host" 
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Live Indicator */}
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                {/* Pulse Ring behind center */}
                <div className="absolute inset-0 rounded-full border-2 border-brand-teal-200 animate-ping opacity-20 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Referrals Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left - Visual */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-brand-teal-50 to-brand-gold-50 rounded-3xl p-12 border border-gray-200 shadow-xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-brand-teal-100 to-brand-gold-100 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-32 h-32 text-brand-teal-500/50" />
                </div>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 bg-brand-teal-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                5X EFFECTIVE
              </div>
              <div className="absolute -bottom-4 -left-4 bg-brand-gold-500 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                NO AD SPEND
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Referrals?
              </h2>

              <h3 className="text-2xl md:text-3xl font-bold mb-6 leading-relaxed">
                <span className="text-brand-teal-600">Plain and Simple...</span>
                <br />
                Referrals Are <span className="text-brand-teal-600">5X More Effective</span> Than Ads
              </h3>

              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our AI platform makes referrals effortless—no work and, no ad spend.
              </p>

              <Link href="/auth/signup">
                <Button className="bg-brand-gold-400 hover:bg-brand-gold-500 text-white px-8 py-6 rounded-full">
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Effortlessly Increase Client Reach Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        {/* Subtle Background Patterns */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 mb-4 bg-brand-teal-50 rounded-xl">
              <BarChart3 className="w-6 h-6 text-brand-teal-600" />
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Effortlessly Increase Client Reach
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Leverage the power of collective networks to exponentially grow your exposure without spending a dime on ads.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Column: The Steps */}
            <div className="space-y-10">
              {/* Step 1 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-lg flex items-center justify-center text-brand-teal-600">
                    <Users className="w-7 h-7" />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Start with 1,000 Clients
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Your existing client base is your foundation. You start with what you already have.
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-8 bg-gray-200 ml-7 -my-4"></div>

              {/* Step 2 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-brand-teal-50 border border-brand-teal-100 shadow-lg flex items-center justify-center text-brand-teal-600">
                    <UserPlus className="w-7 h-7" />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Add One Trusted Partner
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Partner with a peer who has 1,000 clients. Now you both share exposure to <span className="font-bold text-brand-teal-600 bg-brand-teal-50 px-1 rounded">2,000 clients</span>.
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="w-0.5 h-8 bg-gray-200 ml-7 -my-4"></div>

              {/* Step 3 */}
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-brand-teal-600 shadow-xl shadow-brand-teal-600/20 flex items-center justify-center text-white">
                    <Share2 className="w-7 h-7" />
                  </div>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Connect with Nine More
                  </h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Scale your circle to 10 professionals. Your collective reach explodes to <span className="font-bold text-brand-teal-600 bg-brand-teal-50 px-1 rounded">10,000 clients</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: The Visual Graph */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-teal-100/50 to-brand-gold-100/50 rounded-3xl transform rotate-3 scale-105 opacity-50 blur-sm"></div>
              
              <div className="relative bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
                <div className="mb-8 text-center border-b border-gray-100 pb-6">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Exposure</h4>
                  <div className="text-4xl font-extrabold text-gray-900">
                    From 1,000 to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal-600 to-brand-gold-600">10,000</span>
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <TrendingUp className="w-3 h-3" />
                    <span>10x Growth Potential</span>
                  </div>
                </div>

                {/* Bar Chart Visualization */}
                <div className="flex items-end justify-center gap-4 md:gap-8 h-64 w-full px-4">
                  
                  {/* Bar 1 */}
                  <div className="flex flex-col items-center gap-2 group w-1/3">
                    <span className="text-gray-500 font-bold mb-1 group-hover:text-brand-teal-600 transition-colors">1k</span>
                    <div className="w-full bg-gray-200 rounded-t-xl h-16 group-hover:bg-brand-teal-200 transition-all duration-500 relative overflow-hidden">
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">You</span>
                  </div>

                  {/* Bar 2 */}
                  <div className="flex flex-col items-center gap-2 group w-1/3">
                    <span className="text-gray-600 font-bold mb-1 group-hover:text-brand-teal-600 transition-colors">2k</span>
                    <div className="w-full bg-brand-teal-300/50 rounded-t-xl h-28 group-hover:bg-brand-teal-300 transition-all duration-500 relative overflow-hidden">
                    </div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">+ Partner</span>
                  </div>

                  {/* Bar 3 */}
                  <div className="flex flex-col items-center gap-2 group w-1/3">
                    <span className="text-brand-teal-700 font-bold text-xl mb-1 drop-shadow-sm">10k</span>
                    <div className="w-full bg-gradient-to-t from-brand-teal-600 to-brand-teal-400 rounded-t-xl h-56 shadow-lg shadow-brand-teal-500/30 relative overflow-hidden">
                    </div>
                    <span className="text-xs font-bold text-brand-teal-700 uppercase tracking-wide">Full Circle</span>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                  <p className="text-gray-500 text-sm">
                    Estimated client exposures based on average network size.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Background decoration - Subtle gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-teal-500/5 blur-3xl"></div>
          <div className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] rounded-full bg-brand-gold-500/5 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-sm font-bold text-brand-teal-600 tracking-wide uppercase mb-3">
              THE PROCESS
            </h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
              How Spotlight Circles Works
            </h3>
            <p className="text-xl text-gray-600 leading-relaxed">
              A simple framework designed to help you connect, grow, and succeed without the overwhelm.
            </p>
          </div>

          {/* Steps Container */}
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            
            {/* Desktop Connecting Line */}
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-teal-200 via-brand-gold-200 to-brand-teal-200 -z-10"></div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative flex flex-col items-center group">
                  
                  {/* Icon Circle */}
                  <div className="relative mb-8 transition-transform duration-300 group-hover:-translate-y-2">
                    <div className="w-24 h-24 rounded-3xl bg-white shadow-xl shadow-brand-teal-900/10 flex items-center justify-center relative z-10 border border-gray-100 group-hover:border-brand-teal-100 group-hover:shadow-brand-teal-500/20 transition-all">
                      <Icon className="w-10 h-10 text-brand-teal-600" strokeWidth={1.5} />
                      
                      {/* Number Badge */}
                      <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-brand-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-lg border-4 border-white">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 w-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col">
                    
                    <h4 className="text-CREATE YOUR PROFILE
xl font-bold text-gray-900 mb-4 text-center">
                      {step.title}
                    </h4>
                    
                    {/* Tasks List */}
                    <ul className="space-y-3 mb-6 flex-1">
                      {step.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start gap-3 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-brand-teal-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                          <span className="leading-snug">{task}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Result Footer */}
                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex items-center justify-center gap-2 text-sm font-medium text-brand-teal-700 bg-brand-teal-50 py-2.5 px-3 rounded-lg">
                        <TrendingUp className="w-4 h-4" strokeWidth={2} />
                        <span className="italic">{step.result}</span>
                      </div>
                    </div>
                    
                  </div>

                  {/* Mobile Connector Arrow */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-gray-300">
                      <ArrowRight className="w-6 h-6 rotate-90" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* CTA Section */}
          <div className="mt-20 text-center">
            <Link href="/auth/signup">
              <Button className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-brand-teal-600 rounded-full hover:bg-brand-teal-700 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-teal-500">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* How Clients Benefit Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal-50 text-brand-teal-700 font-medium text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Value for Everyone</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              How Clients Benefit
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've streamlined the process to ensure seamless connections and reliable results.
            </p>
          </div>

          {/* Steps Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            
            {/* Step 1 - Get Recommendations */}
            <div className="relative flex flex-col items-center text-center group">
              
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-100 z-0">
                <div className="absolute right-0 -top-1.5 text-gray-200">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Icon Container */}
              <div className="relative z-10 mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-brand-teal-50 shadow-xl flex items-center justify-center group-hover:border-brand-teal-100 group-hover:shadow-brand-teal-200/50 transition-all duration-300">
                  <Users className="w-10 h-10 text-brand-teal-600" />
                </div>
                {/* Step Number Bubble */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white">
                  1
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 max-w-xs">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-teal-700 transition-colors">
                  Get Recommendations
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Receive referrals from a trusted professional within your network.
                </p>
              </div>

              {/* Mobile Connector (Arrow Down) */}
              <div className="md:hidden mt-8 text-gray-300">
                <ArrowRight className="w-6 h-6 rotate-90" />
              </div>
            </div>

            {/* Step 2 - Client Chooses */}
            <div className="relative flex flex-col items-center text-center group">
              
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gray-100 z-0">
                <div className="absolute right-0 -top-1.5 text-gray-200">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Icon Container */}
              <div className="relative z-10 mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-brand-teal-50 shadow-xl flex items-center justify-center group-hover:border-brand-teal-100 group-hover:shadow-brand-teal-200/50 transition-all duration-300">
                  <CheckCircle2 className="w-10 h-10 text-brand-teal-600" />
                </div>
                {/* Step Number Bubble */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white">
                  2
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 max-w-xs">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-teal-700 transition-colors">
                  Client Chooses
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Select a provider based on your specific needs and preferences.
                </p>
              </div>

              {/* Mobile Connector (Arrow Down) */}
              <div className="md:hidden mt-8 text-gray-300">
                <ArrowRight className="w-6 h-6 rotate-90" />
              </div>
            </div>

            {/* Step 3 - Receive Notifications */}
            <div className="relative flex flex-col items-center text-center group">
              
              {/* Icon Container */}
              <div className="relative z-10 mb-6 transition-transform duration-300 group-hover:scale-110">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-brand-teal-50 shadow-xl flex items-center justify-center group-hover:border-brand-teal-100 group-hover:shadow-brand-teal-200/50 transition-all duration-300">
                  <Send className="w-10 h-10 text-brand-teal-600" />
                </div>
                {/* Step Number Bubble */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-sm border-2 border-white">
                  3
                </div>
              </div>

              {/* Text Content */}
              <div className="relative z-10 max-w-xs">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-teal-700 transition-colors">
                  Receive Notifications
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Both you and the provider get notified instantly to start the connection.
                </p>
              </div>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="mt-20 text-center">
            <p className="text-xl font-medium text-gray-800 bg-gray-50 inline-block px-8 py-4 rounded-2xl border border-gray-100">
              Get connected to trusted providers with <span className="text-brand-teal-600 font-bold">confidence</span>.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-brand-teal-50 to-brand-gold-50 rounded-3xl p-12 lg:p-16 border border-gray-200 overflow-hidden">
            {/* Background shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal-100/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-gold-100/40 rounded-full blur-3xl"></div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-block mb-6">
                  <span className="text-sm font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-4 py-2 rounded-full border border-brand-teal-500/20">
                    START GROWING TODAY
                  </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Create your first circle today
                </h2>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Connect with trusted professionals, grow your referral network, and watch your business thrive—all without expensive advertising.
                </p>

                <Link href="/auth/signup">
                  <Button className="bg-brand-gold-400 hover:bg-brand-gold-500 text-white px-8 py-6 rounded-full text-lg">
                    Get Started Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>

              <div className="relative hidden lg:block">
                <div className="aspect-square bg-gradient-to-br from-brand-teal-100 to-brand-gold-100 rounded-3xl flex items-center justify-center border border-gray-200">
                  <Users className="w-32 h-32 text-brand-teal-500/70" />
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
              Get quick answers to common questions about Spotlight Circles and how our platform works.
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


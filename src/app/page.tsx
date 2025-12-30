"use client"

import { useState } from "react"
import { Lock, CheckCircle } from "lucide-react"

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const professionals = [
    {
      img: "/landing-page/images/Insurance agent.png",
      title: "Insurance Agent"
    },
    {
      img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      title: "Dentist"
    },
    {
      img: "/landing-page/images/realtor.png",
      title: "Realtor"
    },
    {
      img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      title: "Veterinarian"
    },
    {
      img: "/landing-page/images/interior designer.jpg",
      title: "Interior Designer"
    },
    {
      img: "/landing-page/images/Hair stylist.jpg",
      title: "Hair Stylist"
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return

    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setShowSuccess(true)
        setEmail("")
      } else {
        setError(data.error || 'Failed to join waitlist. Please try again.')
      }
    } catch (error) {
      console.error('Waitlist signup error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-white py-6 px-4 sm:px-8 flex justify-between items-center max-w-7xl mx-auto z-50 relative">
        <div className="flex items-center gap-3">
          {/* Spotlight Circles Logo */}
          <img src="/landing-page/images/logo.png" alt="Spotlight Circles" className="h-12 w-12" />
          <span className="font-bold text-xl tracking-tight text-slate-900">Spotlight Circles</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Lock className="w-4 h-4" />
          Private Beta
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Copy & Form */}
          <div className="text-center lg:text-left space-y-8 order-2 lg:order-1 max-w-xl mx-auto lg:mx-0 relative z-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              A Private Referral Network <br/>
              <span className="text-[#3a7d91]">
                Is Launching Soon
              </span>
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Early, invite-only access for trusted professionals who grow their practice through referrals—not ads.
            </p>

            {/* Feature List */}
            <div className="space-y-4 text-left mx-auto lg:mx-0 max-w-md">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5 text-[#3a7d91]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <p className="text-slate-700 text-base leading-relaxed">
                  <strong className="font-semibold">Share</strong> trusted professionals directly with your clients
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5 text-[#3a7d91]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <p className="text-slate-700 text-base leading-relaxed">
                  <strong className="font-semibold">Receive</strong> reciprocal, non-competing referrals
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 flex-shrink-0 mt-0.5 text-[#3a7d91]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <p className="text-slate-700 text-base leading-relaxed">
                  <strong className="font-semibold">Track</strong> introductions without changing how you work
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: The Circle Graphic */}
          <div className="order-1 lg:order-2 flex justify-center items-center py-10 lg:py-0 relative z-10">
            <div className="relative w-full max-w-[600px] aspect-square flex items-center justify-center">
              {/* Center Node */}
              <div className="absolute z-20 w-32 h-32 sm:w-44 sm:h-44 rounded-full shadow-2xl p-2 bg-white flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-white group cursor-pointer">
                  <img src="/landing-page/images/Center photo.png" alt="Host" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110" />
                  {/* Live Indicator */}
                  <div className="absolute bottom-3 right-3 w-5 h-5 bg-green-500 border-4 border-white rounded-full z-30"></div>
                </div>
                {/* Pulse Ring behind center */}
                <div className="absolute inset-0 rounded-full border-2 animate-ping opacity-20 -z-10" style={{ borderColor: '#b7dce6' }}></div>
              </div>

              {/* Satellite Nodes */}
              {professionals.map((professional, index) => {
                const total = professionals.length
                const angleDeg = (index * 360) / total - 90
                const radian = (angleDeg * Math.PI) / 180
                const radius = 140
                
                const x = Math.cos(radian) * radius
                const y = Math.sin(radian) * radius

                return (
                  <div
                    key={index}
                    className="absolute z-10 flex flex-col items-center"
                    style={{
                      transform: `translate(${x}px, ${y}px)`,
                    }}
                  >
                    <div className="bg-white p-1.5 rounded-full shadow-xl transition-all hover:scale-110 hover:shadow-2xl cursor-pointer w-16 h-16 sm:w-20 sm:h-20">
                      <div className="w-full h-full rounded-full overflow-hidden relative">
                        <img 
                          src={professional.img} 
                          alt={professional.title}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    </div>
                    <div className="text-center mt-2 text-xs font-semibold text-slate-700 whitespace-nowrap">
                      {professional.title}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>

      {/* Early Access Invitation Section */}
      <section className="w-full py-16 px-4 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 lg:p-16 border border-slate-100">
            {/* Badge */}
            <div className="inline-block px-6 py-2 rounded-full bg-[#f7dd8f]">
              <span className="text-sm font-semibold text-[#ad4715]">Early Access Invitation Only</span>
            </div>
            
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 mt-6 leading-tight">
              Limited Early Access<br/>By Invitation Only
            </h2>
            
            {/* Description */}
            <p className="text-slate-600 text-lg mb-8 leading-relaxed">
              Be among the first to join a private, invitation-only referral network of trusted, non-competing professionals.
            </p>
            
            {/* Form */}
            {!showSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-4 border border-slate-300 rounded-lg text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  placeholder="Your email"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 text-white font-semibold rounded-lg shadow-md transition-all hover:shadow-lg active:scale-98 bg-[#f5a857] hover:bg-[#f2a63b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining...' : 'Request Early Access'}
                </button>
                {error && (
                  <p className="text-center text-sm text-red-600 mt-2">{error}</p>
                )}
                <p className="text-center text-sm text-slate-500 mt-3">
                  No meetings. No spam. No obligation.
                </p>
              </form>
            ) : (
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 animate-fade-in">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-green-800">You&apos;re on the list!</h3>
                    <p className="text-green-700 mt-1">
                      Thanks for your interest. We&apos;ll be in touch with your invite.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 text-center text-slate-400 text-sm relative z-20 bg-white">
        <p>&copy; {new Date().getFullYear()} Spotlight Circles. All rights reserved.</p>
      </footer>
    </div>
  )
}


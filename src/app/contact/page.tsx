"use client"

import { useState } from "react"
import { PublicNav } from "@/components/public/PublicNav"
import { PublicFooter } from "@/components/public/PublicFooter"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Send, CheckCircle2, Phone, Clock, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

export default function ContactPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you within 24 hours.",
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again or email us directly.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

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
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-teal-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold-200/30 rounded-full blur-3xl animate-float-delayed"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-8">
              <span className="text-xs font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-5 py-2.5 rounded-full border border-brand-teal-500/30 uppercase tracking-wider">
                Get In Touch
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Let's Build Your
              <br />
              <span className="text-brand-teal-600">
                Referral Network
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions about Spotlight Circles? Want to schedule a demo? Our team is
              here to help you grow your professional network.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 lg:py-32 relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you're a professional looking to build your referral network
                  or just have questions about our platform, we'd love to hear from you.
                </p>
              </div>

              <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email Us</p>
                    <a
                      href="mailto:support@spotlightcircles.com"
                      className="text-gray-900 hover:text-brand-teal-600 transition-colors font-medium"
                    >
                      support@spotlightcircles.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal-500 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Call Us</p>
                    <a
                      href="tel:+1234567890"
                      className="text-gray-900 hover:text-brand-teal-600 transition-colors font-medium"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-teal-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Location</p>
                    <p className="text-gray-900 font-medium">San Francisco, CA</p>
                    <p className="text-gray-600 text-sm mt-1">
                      Serving professionals nationwide
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-brand-teal-50 border border-brand-teal-200 rounded-3xl">
                <Clock className="w-8 h-8 text-brand-teal-600 mb-3" />
                <h3 className="text-gray-900 font-semibold mb-3 text-lg">
                  Response Time
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  We typically respond within 24 hours during business days. For urgent inquiries, please call us directly.
                </p>
                <a
                  href="/auth/signin"
                  className="text-brand-teal-400 hover:text-blue-300 transition-colors text-sm font-semibold"
                >
                  Sign In to Dashboard →
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="p-8 lg:p-12 bg-white border border-gray-200 rounded-3xl shadow-lg">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-brand-teal-500 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-lg text-gray-600 mb-8">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => setSubmitted(false)}
                      variant="outline"
                      className="border-gray-300 text-gray-900 hover:bg-gray-100"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-900">
                          Full Name *
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          placeholder="John Doe"
                          className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-900">
                          Email Address *
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="john@example.com"
                          className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-teal-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-gray-900">
                          Company
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company Name"
                          className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-teal-500"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-900">
                          Subject *
                        </Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="How can we help?"
                          className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-teal-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-900">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your referral network goals..."
                        rows={6}
                        className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-brand-teal-500 resize-none"
                      />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-brand-teal-50 border border-brand-teal-200 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">
                        We typically respond within 24 hours during business days. For
                        urgent inquiries, please email us directly at{" "}
                        <a
                          href="mailto:support@spotlightcircles.com"
                          className="text-brand-teal-400 hover:text-blue-300 font-semibold"
                        >
                          support@spotlightcircles.com
                        </a>
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-gold-400 hover:bg-brand-gold-500 text-white text-lg py-6"
                    >
                      {loading ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <span className="text-xs font-semibold text-brand-teal-400 bg-brand-teal-500/10 px-5 py-2.5 rounded-full border border-brand-teal-500/30 uppercase tracking-wider">
                Quick Answers
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Common questions about getting started with Spotlight Circles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FAQItem 
              question="How quickly can I start receiving referrals?"
              answer="Most professionals send their first referral within 7 days of onboarding. Our AI partner matching helps you identify high-quality connections immediately, and our templates make introductions fast."
            />
            <FAQItem 
              question="Is there a free trial?"
              answer="Yes! We offer a 14-day free trial with full access to all features. No credit card required. You can cancel anytime if it's not the right fit."
            />
            <FAQItem 
              question="Can I invite partners who aren't using Spotlight Circles yet?"
              answer="Absolutely! You can send partner invitations to anyone. They'll receive an invite to join your circle and create their own account. It's the easiest way to bring your existing network onto the platform."
            />
            <FAQItem 
              question="What kind of support do you offer?"
              answer="We provide email support, in-app help articles, video tutorials, and personalized onboarding for all new users. Premium plans include priority support and dedicated account management."
            />
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}


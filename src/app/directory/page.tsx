import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, Search } from "lucide-react"
import { PublicNav } from "@/components/public/PublicNav"
import { PublicFooter } from "@/components/public/PublicFooter"
import DirectorySearch from "@/components/directory/DirectorySearch"

export default async function DirectoryPage() {
  const session = await auth()

  // Get all professionals with profiles
  const professionals = await prisma.profile.findMany({
    include: {
      user: {
        select: {
          id: true,
          email: true,
          subscription: {
            select: {
              status: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50, // Initial load
  })

  // Get unique professions for filter
  const professions = Array.from(
    new Set(professionals.map((p) => p.profession).filter(Boolean))
  ).sort() as string[]

  // Get unique states
  const states = Array.from(
    new Set(professionals.map((p) => p.state).filter(Boolean))
  ).sort() as string[]

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
                Professional Directory
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Discover Trusted
              <br />
              <span className="text-brand-teal-600">Professional Partners</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Find trusted professionals in your area and request introductions
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Search Component */}
        <DirectorySearch
          professions={professions}
          states={states}
          initialProfessionals={professionals}
        />
      </main>

      <PublicFooter />
    </div>
  )
}


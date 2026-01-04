import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase, Building2, Globe, Users, Send, CheckCircle2, Star, Award, TrendingUp, Mail, Phone, ShieldCheck } from "lucide-react"
import Image from "next/image"
import { headers } from "next/headers"
import { auth } from "@/auth"
import { RequestReferralButton } from "@/components/public/RequestReferralButton"
import { RequestPartnershipButton } from "@/components/partners/RequestPartnershipButton"
import { ExpandableBiography } from "@/components/public/ExpandableBiography"
import dynamic from "next/dynamic"

const ProfileMap = dynamic(() => import("@/components/public/ProfileMap"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
      <MapPin className="h-12 w-12 text-gray-400" />
    </div>
  ),
})

interface PublicProfilePageProps {
  params: {
    slug: string
  }
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = params
  const session = await auth()

  // Find profile
  const profile = await prisma.profile.findFirst({
    where: { referralSlug: slug },
    include: {
      user: {
        select: { 
          id: true,
          email: true 
        },
      },
    },
  })

  if (!profile) {
    notFound()
  }

  const isOwnProfile = session?.user?.id === profile.user.id

  // Check if current viewer is a partner with this profile
  const isPartner = session?.user?.id ? await prisma.partnership.findFirst({
    where: {
      status: "ACCEPTED",
      OR: [
        { initiatorId: profile.user.id, receiverId: session.user.id },
        { receiverId: profile.user.id, initiatorId: session.user.id },
      ],
    },
  }) : null

  // Fetch partnerships
  const partnerships = await prisma.partnership.findMany({
    where: {
      status: "ACCEPTED",
      OR: [
        { initiatorId: profile.user.id },
        { receiverId: profile.user.id },
      ],
    },
    include: {
      initiator: { include: { profile: true } },
      receiver: { include: { profile: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const partners = partnerships.map((p: any) => {
    const isInitiator = p.initiatorId === profile.user.id
    const partnerUser = isInitiator ? p.receiver : p.initiator
    return {
      ...p,
      partnerProfile: isInitiator ? p.receiver?.profile : p.initiator?.profile,
      partnerUserId: partnerUser?.id,
      category: p.category,
    }
  }).filter((p: any) => p.partnerProfile && p.partnerUserId)

  const partnersByCategory = partners.reduce((acc: any, partner: any) => {
    const category = partner.category || "Other"
    if (!acc[category]) acc[category] = []
    acc[category].push(partner)
    return acc
  }, {})

  // Fetch referrals
  const [referralsGiven, referralsReceived] = await Promise.all([
    prisma.referral.findMany({
      where: { senderId: profile.user.id },
      include: { receiver: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.referral.findMany({
      where: { receiverId: profile.user.id },
      include: { sender: { include: { profile: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ])

  const stats = {
    totalPartners: partners.length,
    totalReferralsGiven: referralsGiven.length,
    totalReferralsReceived: referralsReceived.length,
    completedReferrals: referralsGiven.filter((r: any) => r.status === "COMPLETED").length,
    categories: Object.keys(partnersByCategory).length,
  }

  // Track click
  const headersList = headers()
  const ipAddress = headersList.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  const userAgent = headersList.get("user-agent") || "unknown"

  await Promise.all([
    prisma.profile.update({
      where: { id: profile.id },
      data: { linkClicks: { increment: 1 } },
    }),
    prisma.linkClick.create({
      data: {
        profileId: profile.id,
        ipAddress: ipAddress.substring(0, 50),
        userAgent: userAgent.substring(0, 255),
        referer: headersList.get("referer"),
        country: null,
        city: null,
      },
    }),
  ])

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
  const location = [profile.city, profile.state].filter(Boolean).join(", ")

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal-50 via-white to-brand-gold-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Spotlight Circles" className="h-10 w-10" />
              <span className="text-xl font-bold text-brand-teal-500">
                Spotlight Circles
              </span>
            </Link>
            {isOwnProfile && (
              <div className="flex items-center gap-2">
                <Link href="/dashboard/marketing">
                  <Button className="bg-brand-teal-500 hover:bg-brand-teal-600 text-white">
                    Share With Clients
                  </Button>
                </Link>
                <Link href="/dashboard/settings">
                  <Button variant="outline" size="sm">Edit Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden shadow-2xl mb-8">
          
          <CardContent className="relative px-6 md:px-8 pb-8 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Avatar and Info */}
              <div className="lg:col-span-2">
                <div className="flex items-start gap-6 mb-6">
                  <div className="h-64 w-64 md:h-72 md:w-72 border-2 border-gray-200 shadow-xl rounded-lg overflow-hidden flex-shrink-0">
                    {profile.photo ? (
                      <img 
                        src={profile.photo} 
                        alt={`${profile.firstName} ${profile.lastName}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-6xl bg-gradient-to-br from-brand-teal-500 to-brand-gold-400 text-white font-bold">
                        {initials}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 pt-4">
                    {profile.companyName && (
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {profile.companyName}
                      </h1>
                    )}
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                      {profile.firstName} {profile.lastName}
                    </h2>
                    {profile.profession && (
                      <p className="text-lg text-gray-600 font-medium mb-3">{profile.profession}</p>
                    )}
                    
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.profession && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-300">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {profile.profession}
                        </Badge>
                      )}
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-300">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Trusted
                      </Badge>
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border border-blue-300">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      {!isOwnProfile && isPartner && (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border border-green-300">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    
                    {/* Rating - removed */}
                    
                    
                    {/* Contact Info - Only visible to partners or owner */}
                    {(isOwnProfile || isPartner) && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="h-4 w-4 text-brand-teal-600" />
                          <span className="font-medium">{profile.phone || "null"}</span>
                        </div>
                        {profile.user?.email && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Mail className="h-4 w-4 text-brand-teal-600" />
                            <span className="font-medium">{profile.user.email}</span>
                          </div>
                        )}
                        {location && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-brand-teal-600" />
                            <span>{location}</span>
                          </div>
                        )}
                        {profile.website && (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-teal-600 hover:text-brand-teal-700 font-medium">
                            <Globe className="h-4 w-4" /><span>Visit Website</span>
                          </a>
                        )}
                      </div>
                    )}
                    
                    {/* Location visible to all */}
                    {!isOwnProfile && !isPartner && (
                      <div className="space-y-2">
                        {location && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-brand-teal-600" />
                            <span>{location}</span>
                          </div>
                        )}
                        {profile.website && (
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-teal-600 hover:text-brand-teal-700 font-medium">
                            <Globe className="h-4 w-4" /><span>Visit Website</span>
                          </a>
                        )}
                      </div>
                    )}
                    
                    {/* Request Partnership Button - For non-partners */}
                    {!isOwnProfile && !isPartner && session?.user?.id && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="bg-brand-teal-50 border border-brand-teal-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Users className="h-5 w-5 text-brand-teal-600" />
                            Want to connect?
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Send a partnership request to access contact information and request referrals.
                          </p>
                          <RequestPartnershipButton 
                            profileUserId={profile.user.id}
                            profileName={`${profile.firstName} ${profile.lastName}`}
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Login prompt for non-authenticated users */}
                    {!isOwnProfile && !session?.user?.id && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">
                            Want to connect with this professional?
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            Sign in to send partnership requests and access referrals.
                          </p>
                          <Link href="/auth/signin">
                            <Button className="w-full bg-brand-teal-500 hover:bg-brand-teal-600 text-white">
                              Sign In to Connect
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right Column - Map */}
              <div className="lg:col-span-1">
                <div className="bg-gray-100 rounded-lg overflow-hidden h-64 md:h-72 relative border-2 border-gray-200 shadow-xl">
                  <ProfileMap
                    latitude={profile.latitude}
                    longitude={profile.longitude}
                    location={location}
                    name={`${profile.firstName} ${profile.lastName}`}
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-6 mb-8">
              {profile.biography && (
                <ExpandableBiography biography={profile.biography} />
              )}
            </div>

            {/* Partners Section */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6 text-brand-teal-600" />
                Our Trusted Referral Partners
              </h2>
              {partners.length === 0 ? (
                <Card><CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partners Yet</h3>
                  <p className="text-gray-600">This professional is building their referral network.</p>
                </CardContent></Card>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {partners.map((partner: any) => {
                    const p = partner.partnerProfile
                    if (!p) return null
                    const location = [p.city, p.state].filter(Boolean).join(", ")
                    const bio = p.biography ? (p.biography.length > 120 ? p.biography.substring(0, 120) + '...' : p.biography) : null
                    return (
                      <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="h-28 w-28 border-2 border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              {p.photo ? (
                                <img 
                                  src={p.photo} 
                                  alt={`${p.firstName} ${p.lastName}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-brand-teal-400 to-brand-gold-300 text-white text-3xl font-bold">
                                  {`${p.firstName[0]}${p.lastName[0]}`.toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-extrabold text-gray-900 text-xl mb-1">{p.firstName} {p.lastName}</h4>
                              <p className="text-sm text-gray-700 font-semibold mb-1">{p.profession}</p>
                              {location && (
                                <p className="text-sm text-gray-500 font-medium">{location}</p>
                              )}
                            </div>
                          </div>
                          {bio && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{bio}</p>
                          )}
                          <Badge variant="outline" className="mb-4 bg-brand-teal-100 text-brand-teal-800 border-brand-teal-400 font-semibold text-sm px-3 py-1">
                            {partner.category}
                          </Badge>
                          <div className="space-y-2">
                            <Link href={`/p/${p.referralSlug}`}>
                              <Button className="w-full bg-brand-gold-400 hover:bg-brand-gold-500 text-white font-bold">
                                View Profile
                              </Button>
                            </Link>
                            <RequestReferralButton
                              partnerName={`${p.firstName} ${p.lastName}`}
                              partnerProfession={p.profession}
                              partnerUserId={partner.partnerUserId}
                              profileOwnerId={profile.user.id}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Referrals Section */}
            <div className="space-y-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Send className="h-6 w-6 text-brand-teal-600" />
                Professional References ({stats.totalReferralsGiven + stats.totalReferralsReceived})
              </h2>
              <Card>
                <CardContent className="pt-6">
                  {referralsGiven.length === 0 && referralsReceived.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No references yet</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {referralsGiven.map((referral: any) => (
                        <div key={referral.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={referral.receiver.profile?.photo || undefined} />
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">{referral.receiver.profile?.firstName?.[0]}{referral.receiver.profile?.lastName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{referral.receiver.profile?.firstName} {referral.receiver.profile?.lastName}</p>
                            <p className="text-xs text-gray-600 truncate">Client: {referral.clientName}</p>
                            <Badge className={`mt-1 text-xs ${referral.status === 'COMPLETED' ? 'bg-green-600' : referral.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-gray-600'}`}>{referral.status.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      ))}
                      {referralsReceived.map((referral: any) => (
                        <div key={referral.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={referral.sender.profile?.photo || undefined} />
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">{referral.sender.profile?.firstName?.[0]}{referral.sender.profile?.lastName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{referral.sender.profile?.firstName} {referral.sender.profile?.lastName}</p>
                            <p className="text-xs text-gray-600 truncate">Client: {referral.clientName}</p>
                            <Badge className={`mt-1 text-xs ${referral.status === 'COMPLETED' ? 'bg-green-600' : referral.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-gray-600'}`}>{referral.status.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-brand-teal-50 to-brand-gold-50 rounded-xl border-2 border-brand-teal-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to build your own referral network?</h3>
              <p className="text-gray-600 mb-4">Join Spotlight Circles to connect with professionals, exchange referrals, and grow your business.</p>
              <Link href="/auth/signup"><Button className="bg-gradient-to-r from-brand-teal-500 to-brand-gold-400 hover:from-brand-teal-600 hover:to-brand-gold-500">Get Started</Button></Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="mt-12 py-8 border-t bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">Powered by <Link href="/" className="text-brand-teal-600 hover:underline font-semibold">Spotlight Circles</Link></p>
        </div>
      </footer>
    </div>
  )
}

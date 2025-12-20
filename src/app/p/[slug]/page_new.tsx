import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Briefcase, Building2, Globe, Users, Send, CheckCircle2, Star, Award, TrendingUp, Mail } from "lucide-react"
import Image from "next/image"
import { headers } from "next/headers"
import { auth } from "@/auth"

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

  const partners = partnerships.map((p) => {
    const isInitiator = p.initiatorId === profile.user.id
    return {
      ...p,
      partnerProfile: isInitiator ? p.receiver.profile : p.initiator.profile,
      category: p.category,
    }
  }).filter(p => p.partnerProfile)

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
    completedReferrals: referralsGiven.filter(r => r.status === "COMPLETED").length,
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
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-brand-teal-600 to-brand-gold-500 bg-clip-text text-transparent">
              Spotlight Circles
            </Link>
            {isOwnProfile && (
              <Link href="/dashboard/settings">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden shadow-2xl mb-8">
          <div className="relative h-48 md:h-64 bg-gradient-to-r from-brand-teal-500 via-brand-teal-400 to-brand-gold-400">
            {profile.banner && <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          
          <CardContent className="relative px-6 md:px-8 pb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-end gap-6 -mt-20 mb-8">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-white shadow-2xl ring-4 ring-brand-teal-100">
                <AvatarImage src={profile.photo || undefined} alt={`${profile.firstName} ${profile.lastName}`} />
                <AvatarFallback className="text-4xl md:text-5xl bg-gradient-to-br from-brand-teal-500 to-brand-gold-400 text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start gap-3 mb-2">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-xl text-brand-teal-600 font-medium">{profile.profession}</p>
                  </div>
                  {profile.linkClicks > 100 && (
                    <Badge className="bg-brand-gold-400 text-white"><Award className="h-3 w-3 mr-1" />Top Performer</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-4 mt-4">
                  {profile.companyName && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Building2 className="h-4 w-4 text-brand-teal-500" />
                      <span className="font-medium">{profile.companyName}</span>
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="h-4 w-4 text-brand-teal-500" />
                      <span>{location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-teal-600 hover:text-brand-teal-700 font-medium">
                      <Globe className="h-4 w-4" /><span>Visit Website</span>
                    </a>
                  )}
                </div>
              </div>

              <Link href="/auth/signup">
                <Button size="lg" className="bg-gradient-to-r from-brand-teal-500 to-brand-gold-400 hover:from-brand-teal-600 hover:to-brand-gold-500 text-white shadow-lg">
                  <Mail className="mr-2 h-5 w-5" />Connect with Me
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-brand-teal-50 to-brand-teal-100 border-brand-teal-200">
                <CardContent className="p-4 text-center">
                  <Users className="h-6 w-6 text-brand-teal-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-teal-700">{stats.totalPartners}</div>
                  <div className="text-xs text-brand-teal-600 font-medium">Partners</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4 text-center">
                  <Send className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">{stats.totalReferralsGiven}</div>
                  <div className="text-xs text-green-600 font-medium">Referrals Given</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">{stats.totalReferralsReceived}</div>
                  <div className="text-xs text-blue-600 font-medium">Referrals Received</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-brand-gold-50 to-brand-gold-100 border-brand-gold-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="h-6 w-6 text-brand-gold-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-brand-gold-700">{stats.completedReferrals}</div>
                  <div className="text-xs text-brand-gold-600 font-medium">Completed</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 text-center">
                  <Briefcase className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">{stats.categories}</div>
                  <div className="text-xs text-purple-600 font-medium">Categories</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="partners">Partners ({partners.length})</TabsTrigger>
                <TabsTrigger value="referrals">Referrals ({stats.totalReferralsGiven + stats.totalReferralsReceived})</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                {profile.biography && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-brand-teal-700"><Briefcase className="h-5 w-5" />Professional Biography</CardTitle></CardHeader>
                    <CardContent><p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.biography}</p></CardContent>
                  </Card>
                )}

                {profile.services && (
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-brand-teal-700"><Star className="h-5 w-5" />Services Offered</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profile.services.split(',').map((service: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="bg-brand-teal-50 text-brand-teal-700 border-brand-teal-300">{service.trim()}</Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {profile.qrCodeUrl && (
                  <Card className="bg-gradient-to-br from-brand-teal-50 to-brand-gold-50 border-brand-teal-200">
                    <CardHeader><CardTitle className="text-brand-teal-700">Quick Connect</CardTitle></CardHeader>
                    <CardContent>
                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative w-48 h-48 bg-white rounded-xl shadow-lg p-4">
                          <Image src={profile.qrCodeUrl} alt="QR Code" width={176} height={176} className="w-full h-full" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <p className="text-gray-800 font-semibold text-lg mb-2">Scan to save my contact</p>
                          <p className="text-gray-600">Share this link with others who might benefit from my services</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="partners" className="space-y-6">
                {partners.length === 0 ? (
                  <Card><CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Partners Yet</h3>
                    <p className="text-gray-600">This professional is building their referral network.</p>
                  </CardContent></Card>
                ) : (
                  Object.entries(partnersByCategory).map(([category, categoryPartners]: [string, any]) => (
                    <Card key={category}>
                      <CardHeader><CardTitle className="flex items-center gap-2 text-brand-teal-700"><Briefcase className="h-5 w-5" />{category} ({categoryPartners.length})</CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categoryPartners.map((partner: any) => {
                            const p = partner.partnerProfile
                            if (!p) return null
                            return (
                              <Link key={partner.id} href={`/p/${p.referralSlug}`} className="group">
                                <Card className="h-full hover:shadow-lg transition-all hover:scale-105 border-brand-teal-200">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                      <Avatar className="h-12 w-12 border-2 border-brand-teal-200">
                                        <AvatarImage src={p.photo || undefined} alt={p.firstName} />
                                        <AvatarFallback className="bg-brand-teal-100 text-brand-teal-700">{`${p.firstName[0]}${p.lastName[0]}`.toUpperCase()}</AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 group-hover:text-brand-teal-600 truncate">{p.firstName} {p.lastName}</h4>
                                        <p className="text-sm text-gray-600 truncate">{p.profession}</p>
                                        {p.companyName && <p className="text-xs text-gray-500 truncate mt-1">{p.companyName}</p>}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </Link>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="referrals" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-green-700"><Send className="h-5 w-5" />Referrals Given ({referralsGiven.length})</CardTitle></CardHeader>
                    <CardContent>
                      {referralsGiven.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No referrals sent yet</p>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {referralsGiven.map((referral) => (
                            <div key={referral.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={referral.receiver.profile?.photo || undefined} />
                                <AvatarFallback className="bg-green-100 text-green-700 text-sm">{referral.receiver.profile?.firstName?.[0]}{referral.receiver.profile?.lastName?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm">To: {referral.receiver.profile?.firstName} {referral.receiver.profile?.lastName}</p>
                                <p className="text-xs text-gray-600 truncate">Client: {referral.clientName}</p>
                                <Badge className={`mt-1 text-xs ${referral.status === 'COMPLETED' ? 'bg-green-600' : referral.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-gray-600'}`}>{referral.status.replace('_', ' ')}</Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle className="flex items-center gap-2 text-blue-700"><TrendingUp className="h-5 w-5" />Referrals Received ({referralsReceived.length})</CardTitle></CardHeader>
                    <CardContent>
                      {referralsReceived.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No referrals received yet</p>
                      ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {referralsReceived.map((referral) => (
                            <div key={referral.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={referral.sender.profile?.photo || undefined} />
                                <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">{referral.sender.profile?.firstName?.[0]}{referral.sender.profile?.lastName?.[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm">From: {referral.sender.profile?.firstName} {referral.sender.profile?.lastName}</p>
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
              </TabsContent>
            </Tabs>

            {/* CTA */}
            <div className="mt-8 p-6 bg-gradient-to-r from-brand-teal-50 to-brand-gold-50 rounded-xl border-2 border-brand-teal-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to build your own referral network?</h3>
              <p className="text-gray-600 mb-4">Join Spotlight Circles to connect with professionals, exchange referrals, and grow your business.</p>
              <Link href="/auth/signup"><Button className="bg-gradient-to-r from-brand-teal-500 to-brand-gold-400 hover:from-brand-teal-600 hover:to-brand-gold-500">Get Started Free</Button></Link>
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

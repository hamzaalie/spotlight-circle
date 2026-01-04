import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { ProfileTabs } from "@/components/public/ProfileTabs"
import { ShareWithClientsTab } from "@/components/public/ShareWithClientsTab"
import { InviteProfessionalTab } from "@/components/public/InviteProfessionalTab"
import { PartnersTab } from "@/components/public/PartnersTab"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Briefcase, Building2, Globe, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { ExpandableBiography } from "@/components/public/ExpandableBiography"

export default async function MyProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    redirect("/onboarding")
  }

  // Fetch partners
  const partnerships = await prisma.partnership.findMany({
    where: {
      OR: [
        { initiatorId: session.user.id, status: "ACCEPTED" },
        { receiverId: session.user.id, status: "ACCEPTED" },
      ],
    },
    include: {
      initiator: {
        include: { profile: true },
      },
      receiver: {
        include: { profile: true },
      },
    },
  })

  const partners = partnerships
    .map((p: any) => {
      const partnerProfile = p.initiatorId === session.user.id ? p.receiver?.profile : p.initiator?.profile
      return partnerProfile
    })
    .filter(Boolean)
    .map((p: any) => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      profession: p.profession,
      city: p.city,
      state: p.state,
      photo: p.photo,
      referralSlug: p.referralSlug,
    }))

  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()
  const location = [profile.city, profile.state].filter(Boolean).join(", ")
  const profileUrl = `${process.env.NEXTAUTH_URL}/p/${profile.referralSlug}`

  // Profile content
  const profileContent = (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="h-48 w-48 border-2 border-gray-200 shadow-lg rounded-lg overflow-hidden mx-auto md:mx-0">
                {profile.photo ? (
                  <img 
                    src={profile.photo} 
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-brand-teal-500 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">{initials}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.companyName && (
                  <p className="text-lg text-gray-600 flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4" />
                    {profile.companyName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 text-brand-teal-600 font-medium text-lg">
                <Briefcase className="h-5 w-5" />
                {profile.profession}
              </div>

              {location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{location}</span>
                </div>
              )}

              {/* Services */}
              {profile.services && profile.services.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Services:</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.services.map((service: string) => (
                      <Badge key={service} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a href={`mailto:${session.user.email}`} className="flex items-center gap-2 text-brand-teal-600 hover:text-brand-teal-700">
                  <Mail className="h-4 w-4" />
                  <span>{session.user.email}</span>
                </a>
                {profile.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-brand-teal-600 hover:text-brand-teal-700">
                    <Globe className="h-4 w-4" />
                    <span>Website</span>
                  </a>
                )}
              </div>

              {/* Edit Button */}
              <div className="pt-4">
                <Link href="/dashboard/settings">
                  <Button variant="outline">Edit Profile</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biography */}
      {profile.biography && (
        <ExpandableBiography biography={profile.biography} />
      )}

      {/* Public Profile Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Public Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            This is how others see your profile
          </p>
          <Link href={`/p/${profile.referralSlug}`} target="_blank">
            <Button variant="outline">
              View Public Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your profile, share with clients, and grow your network
        </p>
      </div>

      <ProfileTabs>
        {{
          profile: profileContent,
          shareWithClients: (
            <ShareWithClientsTab
              profileUrl={profileUrl}
              qrCodeUrl={profile.qrCodeUrl || ""}
              firstName={profile.firstName}
              lastName={profile.lastName}
            />
          ),
          inviteProfessional: <InviteProfessionalTab />,
          partners: <PartnersTab partners={partners} />,
        }}
      </ProfileTabs>
    </div>
  )
}

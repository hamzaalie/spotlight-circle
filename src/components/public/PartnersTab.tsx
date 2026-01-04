"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, MapPin, Briefcase } from "lucide-react"
import Link from "next/link"

interface Partner {
  id: string
  firstName: string
  lastName: string
  profession: string
  city: string | null
  state: string | null
  photo: string | null
  referralSlug: string
}

interface PartnersTabProps {
  partners: Partner[]
}

export function PartnersTab({ partners }: PartnersTabProps) {
  if (partners.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Partners Yet</h3>
          <p className="text-gray-600 mb-6">
            Start building your referral network by inviting professionals
          </p>
          <Link href="?tab=invite">
            <Button className="bg-brand-gold-400 hover:bg-brand-gold-500">
              Invite Your First Partner
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Your Referral Partners</h2>
          <p className="text-gray-600">
            {partners.length} active {partners.length === 1 ? 'partner' : 'partners'} in your network
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => {
          const initials = `${partner.firstName[0]}${partner.lastName[0]}`.toUpperCase()
          const location = [partner.city, partner.state].filter(Boolean).join(", ")

          return (
            <Card key={partner.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                    {partner.photo ? (
                      <AvatarImage src={partner.photo} alt={`${partner.firstName} ${partner.lastName}`} />
                    ) : (
                      <AvatarFallback className="bg-brand-teal-500 text-white text-xl">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {partner.firstName} {partner.lastName}
                    </h3>
                    <div className="flex items-center justify-center gap-1 text-gray-600 text-sm mt-1">
                      <Briefcase className="h-3 w-3" />
                      <span>{partner.profession}</span>
                    </div>
                    {location && (
                      <div className="flex items-center justify-center gap-1 text-gray-500 text-sm mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 w-full">
                    <Link href={`/p/${partner.referralSlug}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/dashboard/referrals/send?partner=${partner.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-brand-teal-500 hover:bg-brand-teal-600">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

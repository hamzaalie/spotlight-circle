"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface PartnerCardProps {
  partnership: any
  partner: any
  profile: any
}

export function PartnerCard({ partnership, partner, profile }: PartnerCardProps) {
  if (!profile) return null

  const initials = `${profile.firstName?.[0] || ""}${profile.lastName?.[0] || ""}`.toUpperCase()

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={profile.photo || ""} alt={`${profile.firstName} ${profile.lastName}`} />
            <AvatarFallback className="bg-brand-teal-100 text-brand-teal-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-gray-600 truncate">{profile.profession}</p>
            {profile.city && (
              <p className="text-xs text-gray-500 mt-1">
                {profile.city}{profile.state && `, ${profile.state}`}
              </p>
            )}
            {partnership.category && (
              <Badge variant="secondary" className="mt-2">
                {partnership.category}
              </Badge>
            )}
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Link href={`/p/${profile.referralSlug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Profile
            </Button>
          </Link>
          <Link href={`/dashboard/referrals/send?partnerId=${partner.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-brand-gold-400 hover:bg-brand-gold-500">
              Send Referral
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}


import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Database, RefreshCw } from "lucide-react"
import { prisma } from "@/lib/prisma"
import GeocodeAdmin from "@/components/admin/GeocodeAdmin"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatCard } from "@/components/admin/StatCard"

export default async function AdminGeocodePage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  // Get geocoding stats
  const totalProfiles = await prisma.profile.count()
  const geocodedProfiles = await prisma.profile.count({
    where: {
      AND: [
        { latitude: { not: null } },
        { longitude: { not: null } },
      ],
    },
  })
  const missingGeocodes = totalProfiles - geocodedProfiles

  return (
    <div className="p-8 space-y-6">
      <AdminHeader
        title="Geocoding Administration"
        description="Manage location coordinates for professional directory using free OpenStreetMap"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          title="Total Profiles"
          value={totalProfiles}
          icon={Database}
          colorClass="bg-brand-teal-100 text-brand-teal-600"
        />
        <StatCard
          title="Geocoded"
          value={geocodedProfiles}
          icon={MapPin}
          colorClass="bg-green-100 text-green-600"
        />
        <StatCard
          title="Missing Geocodes"
          value={missingGeocodes}
          icon={RefreshCw}
          colorClass="bg-orange-100 text-orange-600"
        />
      </div>

      <GeocodeAdmin missingGeocodes={missingGeocodes} />
    </div>
  )
}


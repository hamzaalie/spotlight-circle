import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Database, RefreshCw } from "lucide-react"
import { prisma } from "@/lib/prisma"
import GeocodeAdmin from "@/components/admin/GeocodeAdmin"

export default async function AdminGeocodePage() {
  const session = await auth()

  // Simple admin check - you can enhance this with proper role-based access
  if (!session?.user?.email) {
    redirect("/auth/signin")
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Geocoding Administration
          </h1>
          <p className="text-gray-600">
            Manage location coordinates for professional directory using free OpenStreetMap
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Profiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Database className="h-8 w-8 text-brand-teal-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {totalProfiles}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Geocoded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <MapPin className="h-8 w-8 text-green-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {geocodedProfiles}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Missing Geocodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-8 w-8 text-orange-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {missingGeocodes}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <GeocodeAdmin missingGeocodes={missingGeocodes} />
      </div>
    </div>
  )
}


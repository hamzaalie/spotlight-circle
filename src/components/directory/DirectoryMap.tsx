"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { Icon, LatLngBounds } from "leaflet"
import { MapPin } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import "leaflet/dist/leaflet.css"

interface Professional {
  id: string
  firstName: string
  lastName: string
  profession: string | null
  companyName: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  photo: string | null
  biography: string | null
  phone: string | null
  website: string | null
  services: string[]
  referralSlug: string
  latitude?: number | null
  longitude?: number | null
  user: {
    id: string
  }
}

interface DirectoryMapProps {
  professionals: Professional[]
}

// Fix Leaflet default icon paths
const createCustomIcon = () => {
  return new Icon({
    iconUrl: "data:image/svg+xml;base64," + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
        <path fill="#7c3aed" d="M16 0C7.163 0 0 7.163 0 16c0 13 16 24 16 24s16-11 16-24C32 7.163 24.837 0 16 0z"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    `),
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  })
}

// Component to auto-fit bounds
function FitBounds({ professionals }: { professionals: Professional[] }) {
  const map = useMap()

  useEffect(() => {
    if (professionals.length > 0) {
      const bounds = new LatLngBounds(
        professionals.map((p) => [p.latitude!, p.longitude!])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 })
    }
  }, [professionals, map])

  return null
}

export default function DirectoryMap({ professionals }: DirectoryMapProps) {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)

  // Filter professionals with valid coordinates
  const professionalsWithCoords = professionals.filter(
    (p) => p.latitude && p.longitude
  )

  return (
    <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200 shadow-sm relative">
      <MapContainer
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds professionals={professionalsWithCoords} />

        {professionalsWithCoords.map((prof) => (
          <Marker
            key={prof.id}
            position={[prof.latitude!, prof.longitude!]}
            icon={createCustomIcon()}
            eventHandlers={{
              click: () => setSelectedProfessional(prof),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src={prof.photo || undefined}
                      alt={`${prof.firstName} ${prof.lastName}`}
                    />
                    <AvatarFallback className="bg-brand-gold-400 text-white">
                      {prof.firstName[0]}{prof.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-gray-900 truncate">
                      {prof.firstName} {prof.lastName}
                    </h3>
                    {prof.profession && (
                      <p className="text-xs text-brand-teal-600 truncate">
                        {prof.profession}
                      </p>
                    )}
                  </div>
                </div>

                {prof.companyName && (
                  <p className="text-xs text-gray-600 mb-1 truncate">
                    {prof.companyName}
                  </p>
                )}

                {(prof.city || prof.state) && (
                  <p className="text-xs text-gray-500 mb-3">
                    {[prof.city, prof.state].filter(Boolean).join(", ")}
                  </p>
                )}

                <Link href={`/p/${prof.referralSlug}`} target="_blank">
                  <Button size="sm" className="w-full bg-brand-gold-400 hover:bg-brand-gold-500 text-xs">
                    View Profile
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {professionalsWithCoords.length === 0 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No professionals with location data</p>
            <p className="text-sm text-gray-500 mt-2">
              Locations will appear as they are added
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


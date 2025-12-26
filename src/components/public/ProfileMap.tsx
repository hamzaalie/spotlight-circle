"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { MapPin } from "lucide-react"

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

interface ProfileMapProps {
  latitude?: number | null
  longitude?: number | null
  location?: string
  name: string
}

export default function ProfileMap({ latitude, longitude, location, name }: ProfileMapProps) {
  const hasCoordinates = latitude && longitude

  if (!hasCoordinates) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">{location || "Location not available"}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <MapContainer
        center={[latitude, longitude]}
        zoom={13}
        style={{ height: "100%", width: "100%", zIndex: 0 }}
        scrollWheelZoom={false}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">{name}</p>
              {location && <p className="text-xs text-gray-600">{location}</p>}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </>
  )
}

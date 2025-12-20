"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LocationStepProps {
  data: {
    city: string
    state: string
    zipCode: string
    latitude: number | null
    longitude: number | null
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function LocationStep({ data, onUpdate, onNext, onBack }: LocationStepProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!data.city || !data.zipCode) {
      alert("Please fill in all required fields")
      return
    }

    // Geocode the location
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          `${data.city}, ${data.state} ${data.zipCode}`
        )}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}`
      )
      
      const geocodeData = await response.json()
      
      if (geocodeData.features && geocodeData.features[0]) {
        const [longitude, latitude] = geocodeData.features[0].center
        onUpdate({ latitude, longitude })
      }
    } catch (error) {
      console.error("Geocoding failed:", error)
    } finally {
      setLoading(false)
    }

    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="city">City *</Label>
        <Input
          id="city"
          value={data.city}
          onChange={(e) => onUpdate({ city: e.target.value })}
          placeholder="Los Angeles"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={data.state}
          onChange={(e) => onUpdate({ state: e.target.value })}
          placeholder="CA"
          maxLength={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="zipCode">ZIP Code *</Label>
        <Input
          id="zipCode"
          value={data.zipCode}
          onChange={(e) => onUpdate({ zipCode: e.target.value })}
          placeholder="90001"
          pattern="^\d{5}(-\d{4})?$"
          required
        />
        <p className="text-xs text-gray-500">
          This helps us show you on the map and connect you with nearby partners
        </p>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={loading} className="bg-brand-gold-400 hover:bg-brand-gold-500">
          {loading ? "Validating..." : "Next"}
        </Button>
      </div>
    </form>
  )
}


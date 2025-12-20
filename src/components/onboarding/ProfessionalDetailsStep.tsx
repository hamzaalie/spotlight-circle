"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ProfessionalDetailsStepProps {
  data: {
    companyName: string
    profession: string
    services: string[]
    clientBaseSize: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

const COMMON_SERVICES = [
  "Real Estate", "Insurance", "Financial Planning", "Legal Services",
  "Accounting", "Marketing", "Web Design", "Photography",
  "Landscaping", "Home Renovation", "Plumbing", "Electrical",
  "HVAC", "Roofing", "Interior Design", "Event Planning"
]

export function ProfessionalDetailsStep({ data, onUpdate, onNext, onBack }: ProfessionalDetailsStepProps) {
  const [serviceInput, setServiceInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!data.profession || data.services.length === 0) {
      alert("Please fill in all required fields")
      return
    }
    onNext()
  }

  const addService = (service: string) => {
    if (!data.services.includes(service)) {
      onUpdate({ services: [...data.services, service] })
    }
  }

  const removeService = (service: string) => {
    onUpdate({ services: data.services.filter((s) => s !== service) })
  }

  const handleAddCustomService = () => {
    if (serviceInput.trim()) {
      addService(serviceInput.trim())
      setServiceInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={data.companyName}
          onChange={(e) => onUpdate({ companyName: e.target.value })}
          placeholder="Acme Inc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="profession">Profession *</Label>
        <Input
          id="profession"
          value={data.profession}
          onChange={(e) => onUpdate({ profession: e.target.value })}
          placeholder="Real Estate Agent, Financial Advisor, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Services You Offer *</Label>
        <div className="flex gap-2">
          <Input
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            placeholder="Add a service..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddCustomService()
              }
            }}
          />
          <Button type="button" onClick={handleAddCustomService} variant="outline">
            Add
          </Button>
        </div>
        
        {data.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.services.map((service) => (
              <Badge
                key={service}
                variant="secondary"
                className="cursor-pointer hover:bg-red-100"
                onClick={() => removeService(service)}
              >
                {service} ×
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-2">
            {COMMON_SERVICES.filter(s => !data.services.includes(s)).slice(0, 8).map((service) => (
              <Badge
                key={service}
                variant="outline"
                className="cursor-pointer hover:bg-brand-teal-50"
                onClick={() => addService(service)}
              >
                + {service}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientBaseSize">Estimated Client Base Size</Label>
        <Input
          id="clientBaseSize"
          type="number"
          value={data.clientBaseSize}
          onChange={(e) => onUpdate({ clientBaseSize: e.target.value })}
          placeholder="e.g., 100"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="bg-brand-gold-400 hover:bg-brand-gold-500">
          Next
        </Button>
      </div>
    </form>
  )
}


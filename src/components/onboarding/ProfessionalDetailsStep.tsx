"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ProfessionalDetailsStepProps {
  data: {
    companyName: string
    profession: string
    categoryId?: string
    services: string[]
    clientBaseSize: string
    yearBusinessStarted?: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

interface Category {
  id: string
  name: string
  order: number
}

const COMMON_SERVICES = [
  "Real Estate", "Insurance", "Financial Planning", "Legal Services",
  "Accounting", "Marketing", "Web Design", "Photography",
  "Landscaping", "Home Renovation", "Plumbing", "Electrical",
  "HVAC", "Roofing", "Interior Design", "Event Planning"
]

export function ProfessionalDetailsStep({ data, onUpdate, onNext, onBack }: ProfessionalDetailsStepProps) {
  const [serviceInput, setServiceInput] = useState("")
  const [showAddWarning, setShowAddWarning] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        if (res.ok) {
          const data = await res.json()
          setCategories(data.categories)
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

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
      setShowAddWarning(false)
    }
  }

  const removeService = (service: string) => {
    onUpdate({ services: data.services.filter((s) => s !== service) })
  }

  const handleAddCustomService = () => {
    if (serviceInput.trim()) {
      addService(serviceInput.trim())
      setServiceInput("")
      setShowAddWarning(false)
    } else {
      setShowAddWarning(true)
    }
  }

  const handleServiceInputChange = (value: string) => {
    setServiceInput(value)
    if (value.trim()) {
      setShowAddWarning(true)
    } else {
      setShowAddWarning(false)
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
        <Label htmlFor="profession">Profession Category *</Label>
        <Select
          value={data.categoryId || ""}
          onValueChange={(value) => {
            const category = categories.find(c => c.id === value)
            onUpdate({ 
              categoryId: value,
              profession: category?.name || data.profession 
            })
          }}
          disabled={loadingCategories}
        >
          <SelectTrigger>
            <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select your profession"} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Choose the category that best describes your profession
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionTitle">Your Professional Title (Optional)</Label>
        <Input
          id="professionTitle"
          value={data.profession}
          onChange={(e) => onUpdate({ profession: e.target.value })}
          placeholder="e.g., Senior Real Estate Agent, Certified Financial Planner"
        />
        <p className="text-xs text-gray-500">
          Add a specific title if you want to customize beyond the category
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearBusinessStarted">Year Business Started</Label>
        <Input
          id="yearBusinessStarted"
          type="number"
          value={data.yearBusinessStarted || ""}
          onChange={(e) => onUpdate({ yearBusinessStarted: e.target.value })}
          placeholder="e.g., 2015"
          min="1900"
          max={new Date().getFullYear()}
        />
      </div>

      <div className="space-y-2">
        <Label>Services You Offer *</Label>
        <div className="flex gap-2">
          <Input
            value={serviceInput}
            onChange={(e) => handleServiceInputChange(e.target.value)}
            placeholder="Add a service..."
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddCustomService()
              }
            }}
          />
          <Button 
            type="button" 
            onClick={handleAddCustomService} 
            variant={showAddWarning ? "default" : "outline"}
            className={showAddWarning ? "bg-red-500 hover:bg-red-600 text-white" : ""}
          >
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


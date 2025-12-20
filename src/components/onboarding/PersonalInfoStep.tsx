"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PersonalInfoStepProps {
  data: {
    firstName: string
    lastName: string
    phone: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
}

export function PersonalInfoStep({ data, onUpdate, onNext }: PersonalInfoStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={data.firstName}
          onChange={(e) => onUpdate({ firstName: e.target.value })}
          placeholder="John"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={data.lastName}
          onChange={(e) => onUpdate({ lastName: e.target.value })}
          placeholder="Doe"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={data.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          placeholder="(555) 123-4567"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-brand-gold-400 hover:bg-brand-gold-500">
          Next
        </Button>
      </div>
    </form>
  )
}


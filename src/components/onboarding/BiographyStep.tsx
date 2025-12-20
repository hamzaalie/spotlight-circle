"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface BiographyStepProps {
  data: {
    biography: string
    website: string
    profession: string
    companyName: string
    services: string[]
    city: string
    state: string
  }
  onUpdate: (data: any) => void
  onSubmit: () => void
  onBack: () => void
  loading: boolean
}

export function BiographyStep({ data, onUpdate, onSubmit, onBack, loading }: BiographyStepProps) {
  const [generating, setGenerating] = useState(false)

  const handleGenerateBio = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profession: data.profession,
          companyName: data.companyName,
          services: data.services,
          city: data.city,
          state: data.state,
          website: data.website,
        }),
      })

      const result = await response.json()
      
      if (result.biography) {
        onUpdate({ biography: result.biography })
      } else {
        throw new Error(result.error || "Failed to generate biography")
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }

  const charCount = data.biography.length
  const minChars = 50

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          value={data.website}
          onChange={(e) => onUpdate({ website: e.target.value })}
          placeholder="https://www.example.com"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="biography">Professional Biography</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateBio}
            disabled={generating}
          >
            {generating ? "Generating..." : "✨ Generate with AI"}
          </Button>
        </div>
        <div className="bg-brand-teal-50 border border-brand-teal-200 rounded-lg p-3 mb-2">
          <p className="text-xs text-brand-teal-700">
            💡 <strong>Tip:</strong> Use AI to create a professional biography, then feel free to modify it to match your personal style and voice.
          </p>
        </div>
        <Textarea
          id="biography"
          value={data.biography}
          onChange={(e) => onUpdate({ biography: e.target.value })}
          placeholder="Tell potential partners and clients about yourself, your experience, and what makes you unique..."
          rows={8}
        />
        <div className="flex justify-between text-xs">
          <span className={charCount < minChars ? "text-orange-600" : "text-gray-500"}>
            {charCount < minChars 
              ? `${minChars - charCount} characters needed (minimum ${minChars})`
              : `${charCount} characters`
            }
          </span>
          <span className="text-gray-400">Recommended: 200-400 words for best results</span>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button 
          type="submit" 
          disabled={loading || charCount < minChars}
          className="bg-brand-gold-400 hover:bg-brand-gold-500"
        >
          {loading ? "Creating Profile..." : "Complete Profile"}
        </Button>
      </div>
    </form>
  )
}


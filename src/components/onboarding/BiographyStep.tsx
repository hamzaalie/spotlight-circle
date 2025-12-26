"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface BiographyStepProps {
  data: {
    firstName: string
    lastName: string
    biography: string
    website: string
    profession: string
    companyName: string
    services: string[]
    clientBaseSize: string
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
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState("")

  const handleGenerateBio = async () => {
    setGenerating(true)
    setShowAIDialog(false)
    try {
      const response = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          profession: data.profession,
          companyName: data.companyName,
          services: data.services,
          clientBaseSize: data.clientBaseSize,
          city: data.city,
          state: data.state,
          website: data.website,
          additionalInfo: additionalInfo,
        }),
      })

      const result = await response.json()
      
      if (result.biography) {
        onUpdate({ biography: result.biography })
        
        // Show warning if there was an error but fallback was used
        if (result.error) {
          if (result.error === 'OPENAI_NOT_CONFIGURED') {
            alert('⚠️ OpenAI API is not configured. Using a template biography.\n\nPlease configure OPENAI_API_KEY in your .env file for AI-generated biographies.')
          } else {
            alert('⚠️ AI generation had an issue, so we created a template biography for you. Feel free to edit it!\n\nError: ' + result.error)
          }
        }
      } else {
        throw new Error(result.error || "Failed to generate biography")
      }
    } catch (error: any) {
      alert('Failed to generate biography: ' + error.message)
    } finally {
      setGenerating(false)
      setAdditionalInfo("") // Reset for next use
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
          onBlur={(e) => {
            // Auto-add https:// if user enters a domain without protocol
            const value = e.target.value.trim()
            if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
              onUpdate({ website: `https://${value}` })
            }
          }}
          placeholder="https://www.example.com"
        />
        <p className="text-xs text-gray-500">
          💡 If you have a website, we'll use its content to make your bio more accurate
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="biography">Professional Biography</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAIDialog(true)}
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

      {/* AI Generation Dialog */}
      <Dialog open={showAIDialog} onOpenChange={setShowAIDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate AI Biography</DialogTitle>
            <DialogDescription>
              Help us create a personalized biography by sharing a bit more about yourself.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-brand-teal-50 border border-brand-teal-200 rounded-lg p-3">
              <p className="text-sm text-brand-teal-700">
                <strong>We'll use:</strong>
              </p>
              <ul className="text-xs text-brand-teal-600 mt-2 space-y-1 ml-4">
                <li>• Your name: {data.firstName} {data.lastName}</li>
                <li>• Profession: {data.profession || "Not provided"}</li>
                <li>• Company: {data.companyName || "Not provided"}</li>
                <li>• Services: {data.services.length > 0 ? data.services.join(", ") : "Not provided"}</li>
                <li>• Location: {data.city}, {data.state}</li>
                {data.website && <li>• Website content from: {data.website}</li>}
              </ul>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additional-info">Tell us more about yourself (Optional)</Label>
              <Textarea
                id="additional-info"
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                placeholder="E.g., Years of experience, specializations, achievements, unique approach to your work, what motivates you, or any other details that make you stand out..."
                rows={6}
              />
              <p className="text-xs text-gray-500">
                💡 The more details you provide, the more personalized and accurate your biography will be!
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAIDialog(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleGenerateBio}
              disabled={generating}
              className="bg-brand-teal-600 hover:bg-brand-teal-700"
            >
              {generating ? "Generating..." : "Generate Biography"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}


"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PhotoUploadStepProps {
  data: {
    photo: string
    firstName: string
    lastName: string
  }
  onUpdate: (data: any) => void
  onNext: () => void
  onBack: () => void
}

export function PhotoUploadStep({ data, onUpdate, onNext, onBack }: PhotoUploadStepProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = () => {
        onUpdate({ photo: reader.result as string })
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      alert("Failed to upload photo")
      setUploading(false)
    }
  }

  const initials = `${data.firstName[0] || ""}${data.lastName[0] || ""}`.toUpperCase()

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32">
          <AvatarImage src={data.photo} alt="Profile photo" />
          <AvatarFallback className="text-2xl bg-brand-teal-100 text-brand-teal-600">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-2 text-center">
          <Label>Profile Photo (Optional)</Label>
          <p className="text-sm text-gray-500">
            Add a professional photo to help partners recognize you
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : data.photo ? "Change Photo" : "Upload Photo"}
        </Button>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onNext} className="bg-brand-gold-400 hover:bg-brand-gold-500">
          {data.photo ? "Next" : "Skip for now"}
        </Button>
      </div>
    </div>
  )
}


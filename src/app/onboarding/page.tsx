export const dynamic = "force-dynamic";
"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PersonalInfoStep } from "@/components/onboarding/PersonalInfoStep"
import { PhotoUploadStep } from "@/components/onboarding/PhotoUploadStep"
import { ProfessionalDetailsStep } from "@/components/onboarding/ProfessionalDetailsStep"
import { LocationStep } from "@/components/onboarding/LocationStep"
import { BiographyStep } from "@/components/onboarding/BiographyStep"

const TOTAL_STEPS = 5

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const inviteId = searchParams.get("invite")
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    phone: "",
    
    // Photo
    photo: "",
    
    // Professional Details
    companyName: "",
    profession: "",
    services: [] as string[],
    clientBaseSize: "",
    
    // Location
    city: "",
    state: "",
    zipCode: "",
    latitude: null as number | null,
    longitude: null as number | null,
    
    // Biography
    biography: "",
    website: "",
  })

  useEffect(() => {
    // Check if user already has a profile
    async function checkProfile() {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          // Profile exists, redirect to dashboard
          router.push("/dashboard")
        }
      } catch (error) {
        // Profile doesn't exist, continue with onboarding
      } finally {
        setChecking(false)
      }
    }
    checkProfile()
  }, [router])

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // First, geocode the location if not already done
      if (!formData.latitude || !formData.longitude) {
        try {
          const geocodeRes = await fetch("/api/geocode", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode,
            }),
          })

          if (geocodeRes.ok) {
            const geocodeData = await geocodeRes.json()
            formData.latitude = geocodeData.latitude
            formData.longitude = geocodeData.longitude
          }
        } catch (geocodeError) {
          console.error("Geocoding failed:", geocodeError)
          // Continue anyway, geocoding is optional
        }
      }

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error("Profile creation error:", data)
        throw new Error(data.error || "Failed to create profile")
      }

      // Always redirect to payment page, but preserve invite parameter
      if (inviteId) {
        window.location.href = `/payment/subscribe?invite=${inviteId}`
      } else {
        window.location.href = "/payment/subscribe"
      }
    } catch (error: any) {
      console.error("Submit error:", error)
      alert(`Error: ${error.message}\n\nPlease try signing out and creating a new account.`)
    } finally {
      setLoading(false)
    }
  }

  const progress = (currentStep / TOTAL_STEPS) * 100

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-teal-500 via-brand-teal-400 to-brand-gold-300 flex items-center justify-center">
        <div className="text-white text-lg font-medium animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-teal-500 via-brand-teal-400 to-brand-gold-300 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-brand-teal-50 to-brand-gold-50 border-b border-brand-teal-200">
          <CardTitle className="text-2xl md:text-3xl text-brand-teal-700">
            Welcome! Let's Build Your Profile ✨
          </CardTitle>
          <CardDescription className="text-base text-brand-teal-600">
            Step {currentStep} of {TOTAL_STEPS} • Complete your profile to choose your plan
          </CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <PersonalInfoStep
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
            />
          )}
          
          {currentStep === 2 && (
            <PhotoUploadStep
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          
          {currentStep === 3 && (
            <ProfessionalDetailsStep
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          
          {currentStep === 4 && (
            <LocationStep
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          
          {currentStep === 5 && (
            <BiographyStep
              data={formData}
              onUpdate={updateFormData}
              onSubmit={handleSubmit}
              onBack={prevStep}
              loading={loading}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}


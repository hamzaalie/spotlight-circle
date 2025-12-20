"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"

interface GeocodeAdminProps {
  missingGeocodes: number
}

export default function GeocodeAdmin({ missingGeocodes }: GeocodeAdminProps) {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<{
    success?: boolean
    total?: number
    successCount?: number
    errorCount?: number
    error?: string
  } | null>(null)

  const handleBatchGeocode = async () => {
    if (!confirm(`This will geocode ${missingGeocodes} profiles. Continue?`)) {
      return
    }

    setLoading(true)
    setProgress(0)
    setResult(null)

    try {
      const res = await fetch("/api/geocode", {
        method: "PUT",
      })

      const data = await res.json()

      if (res.ok) {
        setResult(data)
        setProgress(100)
      } else {
        setResult({ error: data.error || "Failed to geocode profiles" })
      }
    } catch (error: any) {
      setResult({ error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const hasMapboxToken = true // OpenStreetMap is free, no token needed

  return (
    <>
      {/* Batch Geocode Card */}
      <Card>
        <CardHeader>
          <CardTitle>Batch Geocode Profiles</CardTitle>
          <CardDescription>
            Convert addresses to geographic coordinates for all profiles missing location data.
            This process uses the Mapbox Geocoding API and may take several minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="bg-brand-teal-50 border border-brand-teal-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Before you start:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>Uses free OpenStreetMap/Nominatim geocoding (no API key needed)</li>
                <li>Process includes 1 second delay between requests (Nominatim rate limit)</li>
                <li>Only profiles with city and ZIP code will be geocoded</li>
                <li>This operation cannot be undone</li>
              </ul>
            </div>          {loading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Processing...</span>
                <span className="text-gray-900 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {result && (
            <div
              className={`rounded-lg p-4 ${
                result.error
                  ? "bg-red-50 border border-red-200"
                  : "bg-green-50 border border-green-200"
              }`}
            >
              {result.error ? (
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-red-900 mb-1">Error</h4>
                    <p className="text-sm text-red-800">{result.error}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900 mb-1">Success!</h4>
                    <p className="text-sm text-green-800">
                      Geocoded {result.successCount} of {result.total} profiles.
                      {result.errorCount! > 0 && ` ${result.errorCount} errors encountered.`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <Button
            onClick={handleBatchGeocode}
            disabled={missingGeocodes === 0 || !hasMapboxToken || loading}
            className="w-full bg-brand-gold-400 hover:bg-brand-gold-500"
            size="lg"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading
              ? "Geocoding..."
              : `Geocode ${missingGeocodes} Profile${missingGeocodes !== 1 ? "s" : ""}`}
          </Button>

          {missingGeocodes === 0 && (
            <p className="text-center text-sm text-gray-600">
              ✅ All profiles have been geocoded
            </p>
          )}
        </CardContent>
      </Card>

      {/* Manual Geocode Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manual Geocoding</CardTitle>
          <CardDescription>For individual profiles or testing purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm">
            <p className="text-gray-600 mb-2">POST /api/geocode</p>
            <pre className="text-gray-800 overflow-x-auto">{`{
  "profileId": "profile_id_here",
  "city": "Los Angeles",
  "state": "CA",
  "zipCode": "90001"
}`}</pre>
          </div>
        </CardContent>
      </Card>
    </>
  )
}


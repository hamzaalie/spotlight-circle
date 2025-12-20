"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function AITestPage() {
  const [bioLoading, setBioLoading] = useState(false)
  const [bioResult, setBioResult] = useState("")
  const [profession, setProfession] = useState("Real Estate Agent")
  const [city, setCity] = useState("San Francisco")
  const [state, setState] = useState("CA")

  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastResult, setForecastResult] = useState<any>(null)

  const [gapsLoading, setGapsLoading] = useState(false)
  const [gapsResult, setGapsResult] = useState<any>(null)

  const [emailLoading, setEmailLoading] = useState(false)
  const [emailResult, setEmailResult] = useState<any>(null)
  const [emailAddress, setEmailAddress] = useState("")

  const testBioGenerator = async () => {
    setBioLoading(true)
    try {
      const res = await fetch("/api/generate-bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profession, city, state }),
      })
      const data = await res.json()
      setBioResult(data.biography || "Error generating bio")
    } catch (error) {
      setBioResult("Error: " + error)
    } finally {
      setBioLoading(false)
    }
  }

  const testForecast = async () => {
    setForecastLoading(true)
    try {
      const res = await fetch("/api/ai/forecast", {
        method: "GET",
      })
      const data = await res.json()
      setForecastResult(data)
    } catch (error) {
      setForecastResult({ error: String(error) })
    } finally {
      setForecastLoading(false)
    }
  }

  const testPartnerGaps = async () => {
    setGapsLoading(true)
    try {
      const res = await fetch("/api/ai/partner-gaps", {
        method: "GET",
      })
      const data = await res.json()
      setGapsResult(data)
    } catch (error) {
      setGapsResult({ error: String(error) })
    } finally {
      setGapsLoading(false)
    }
  }

  const testEmail = async () => {
    setEmailLoading(true)
    try {
      const res = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddress }),
      })
      const data = await res.json()
      setEmailResult(data)
    } catch (error) {
      setEmailResult({ error: String(error) })
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Features Test Page</h1>
          <p className="text-gray-600">Test all AI-powered features with your OpenAI API key</p>
        </div>

        {/* Bio Generator Test */}
        <Card>
          <CardHeader>
            <CardTitle>1. AI Biography Generator</CardTitle>
            <CardDescription>
              Generates professional biographies using GPT-4
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Profession</Label>
                <Input
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g., Real Estate Agent"
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., San Francisco"
                />
              </div>
              <div>
                <Label>State</Label>
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g., CA"
                />
              </div>
            </div>
            
            <Button 
              onClick={testBioGenerator} 
              disabled={bioLoading}
              className="w-full"
            >
              {bioLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Biography"
              )}
            </Button>

            {bioResult && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-900 mb-2">Generated Biography:</p>
                <p className="text-gray-700">{bioResult}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Forecast Test */}
        <Card>
          <CardHeader>
            <CardTitle>2. Client Forecasting</CardTitle>
            <CardDescription>
              Predicts monthly referral volume based on your network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testForecast} 
              disabled={forecastLoading}
              className="w-full"
            >
              {forecastLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Calculating...
                </>
              ) : (
                "Calculate Forecast"
              )}
            </Button>

            {forecastResult && (
              <div className="mt-4 p-4 bg-brand-teal-50 border border-brand-teal-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">Forecast Result:</p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(forecastResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Partner Gaps Test */}
        <Card>
          <CardHeader>
            <CardTitle>3. Smart Partner Gaps™</CardTitle>
            <CardDescription>
              AI-powered analysis of missing professional categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testPartnerGaps} 
              disabled={gapsLoading}
              className="w-full"
            >
              {gapsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Partner Gaps"
              )}
            </Button>

            {gapsResult && (
              <div className="mt-4 p-4 bg-brand-teal-50 border border-brand-teal-200 rounded-lg">
                <p className="text-sm font-semibold text-purple-900 mb-2">Analysis Result:</p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(gapsResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Test */}
        <Card>
          <CardHeader>
            <CardTitle>4. Email Service (Resend)</CardTitle>
            <CardDescription>
              Test sending emails via Resend API
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emailAddress">Your Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                placeholder="your@email.com"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={testEmail} 
              disabled={emailLoading || !emailAddress}
              className="w-full"
            >
              {emailLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Test Email"
              )}
            </Button>

            {emailResult && (
              <div className={`mt-4 p-4 border rounded-lg ${
                emailResult.success 
                  ? "bg-green-50 border-green-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <p className={`text-sm font-semibold mb-2 ${
                  emailResult.success ? "text-green-900" : "text-red-900"
                }`}>
                  {emailResult.success ? "Email Sent Successfully!" : "Email Failed"}
                </p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(emailResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Status */}
        <Card>
          <CardHeader>
            <CardTitle>OpenAI API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">
                  Ready to Test
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Model:</span>
                <span className="font-mono text-gray-900">GPT-4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Features:</span>
                <span className="text-gray-900">Bio, Forecast, Gaps, Email</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Target, Bell, Loader2, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AIInsights() {
  const [forecast, setForecast] = useState<any>(null)
  const [gaps, setGaps] = useState<any>(null)
  const [staleCount, setStaleCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [sendingFollowups, setSendingFollowups] = useState(false)

  useEffect(() => {
    fetchInsights()
  }, [])

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const [forecastRes, gapsRes, followupRes] = await Promise.all([
        fetch("/api/ai/forecast"),
        fetch("/api/ai/partner-gaps"),
        fetch("/api/ai/follow-up"),
      ])

      if (forecastRes.ok) {
        const data = await forecastRes.json()
        setForecast(data)
      }

      if (gapsRes.ok) {
        const data = await gapsRes.json()
        setGaps(data)
      }

      if (followupRes.ok) {
        const data = await followupRes.json()
        setStaleCount(data.staleReferrals || 0)
      }
    } catch (error) {
      console.error("Failed to fetch AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendFollowups = async () => {
    setSendingFollowups(true)
    try {
      const res = await fetch("/api/ai/follow-up", {
        method: "POST",
      })

      if (res.ok) {
        const data = await res.json()
        alert(`✅ Sent ${data.count} follow-up email${data.count !== 1 ? "s" : ""}`)
        setStaleCount(0)
      } else {
        alert("Failed to send follow-ups")
      }
    } catch (error) {
      alert("Error sending follow-ups")
    } finally {
      setSendingFollowups(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Client Forecasting */}
      {forecast && (
        <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-brand-teal-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-teal-600" />
              <CardTitle className="text-purple-900">Referral Forecast</CardTitle>
            </div>
            <CardDescription className="text-purple-700">
              AI-powered prediction based on your network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Monthly</p>
                <p className="text-3xl font-bold text-brand-teal-600">
                  {forecast.forecast.monthly}
                </p>
                <p className="text-xs text-gray-500 mt-1">referrals/month</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Quarterly</p>
                <p className="text-3xl font-bold text-brand-teal-600">
                  {forecast.forecast.quarterly}
                </p>
                <p className="text-xs text-gray-500 mt-1">referrals/quarter</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Confidence</p>
                <p className="text-3xl font-bold text-green-600">
                  {forecast.forecast.confidence}%
                </p>
                <p className="text-xs text-gray-500 mt-1">prediction accuracy</p>
              </div>
            </div>

            {forecast.insights && forecast.insights.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-purple-900 mb-3">
                  <Sparkles className="h-4 w-4 inline mr-1" />
                  AI Insights
                </p>
                {forecast.insights.map((insight: string, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-3 text-sm text-gray-700">
                    {insight}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Partner Gaps */}
      {gaps && gaps.recommendations && gaps.recommendations.length > 0 && (
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-orange-900">Smart Partner Gaps™</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              Missing categories to expand your network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Category Diversity
                </span>
                <span className="text-sm font-semibold text-orange-600">
                  {gaps.summary.diversityScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${gaps.summary.diversityScore}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {gaps.categoryCount} of {gaps.categoryCount + gaps.potentialGaps} categories covered
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-orange-900">
                Recommended Partners:
              </p>
              {gaps.recommendations.slice(0, 5).map((rec: any, idx: number) => (
                <div key={idx} className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900">{rec.category}</p>
                    <Badge
                      variant={rec.priority === "high" ? "default" : "secondary"}
                      className={rec.priority === "high" ? "bg-orange-600" : ""}
                    >
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{rec.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Automated Follow-ups */}
      {staleCount > 0 && (
        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-600" />
              <CardTitle className="text-red-900">Follow-Up Reminders</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              Referrals needing attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-2xl font-bold text-red-600 mb-1">{staleCount}</p>
              <p className="text-sm text-gray-600">
                referral{staleCount !== 1 ? "s" : ""} pending for 7+ days
              </p>
            </div>

            <Button
              onClick={handleSendFollowups}
              disabled={sendingFollowups}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {sendingFollowups ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Follow-Up Reminders
                </>
              )}
            </Button>

            <p className="text-xs text-gray-600 mt-3 text-center">
              Sends polite reminders to you and your partners
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


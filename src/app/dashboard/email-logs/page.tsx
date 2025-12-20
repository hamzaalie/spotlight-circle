"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react"

interface EmailLog {
  id: string
  to: string
  subject: string
  status: string
  createdAt: string
  sentAt: string | null
  deliveredAt: string | null
  error: string | null
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/email-logs")
      const data = await res.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Failed to fetch email logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      PENDING: { label: "Pending", className: "bg-gray-100 text-gray-700", icon: Clock },
      SENT: { label: "Sent", className: "bg-brand-teal-100 text-blue-700", icon: Mail },
      DELIVERED: { label: "Delivered", className: "bg-green-100 text-green-700", icon: CheckCircle },
      BOUNCED: { label: "Bounced", className: "bg-red-100 text-red-700", icon: XCircle },
      COMPLAINED: { label: "Complained", className: "bg-orange-100 text-orange-700", icon: AlertCircle },
      FAILED: { label: "Failed", className: "bg-red-100 text-red-700", icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading email logs...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Email Delivery Logs</h1>
        <p className="text-gray-600 mt-1">
          Track the status of all sent emails
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Emails</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No emails sent yet
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-sm">{log.to}</span>
                      </div>
                      <p className="text-sm text-gray-600 ml-6">{log.subject}</p>
                      {log.error && (
                        <p className="text-xs text-red-600 ml-6 mt-1">
                          Error: {log.error}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(log.status)}
                      <span className="text-xs text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                      {log.deliveredAt && (
                        <span className="text-xs text-green-600">
                          Delivered: {new Date(log.deliveredAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


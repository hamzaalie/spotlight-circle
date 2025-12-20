"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Plus, Clock, CheckCircle, XCircle } from "lucide-react"

interface Ticket {
  id: string
  subject: string
  category: string
  status: string
  priority: string
  createdAt: string
  messages: { message: string; isStaff: boolean; createdAt: string }[]
}

export default function SupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    subject: "",
    category: "Technical",
    message: "",
  })

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/support/tickets")
      const data = await res.json()
      setTickets(data.tickets || [])
    } catch (error) {
      console.error("Failed to fetch tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error("Failed to create ticket")
      }

      // Reset form and refresh tickets
      setFormData({ subject: "", category: "Technical", message: "" })
      setShowNewTicket(false)
      fetchTickets()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: any }> = {
      OPEN: { label: "Open", className: "bg-brand-teal-100 text-blue-700", icon: MessageCircle },
      IN_PROGRESS: { label: "In Progress", className: "bg-yellow-100 text-yellow-700", icon: Clock },
      RESOLVED: { label: "Resolved", className: "bg-green-100 text-green-700", icon: CheckCircle },
      CLOSED: { label: "Closed", className: "bg-gray-100 text-gray-700", icon: XCircle },
    }

    const { label, className, icon: Icon } = config[status] || config.OPEN

    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support</h1>
          <p className="text-gray-600 mt-1">
            Get help from our support team
          </p>
        </div>
        <Button
          onClick={() => setShowNewTicket(!showNewTicket)}
          className="bg-brand-gold-400 hover:bg-brand-gold-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Ticket
        </Button>
      </div>

      {showNewTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Create Support Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Technical">Technical Issue</option>
                  <option value="Billing">Billing & Subscription</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewTicket(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  {submitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading tickets...
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No support tickets yet. Click "New Ticket" to get help.
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => router.push(`/dashboard/support/${ticket.id}`)}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{ticket.subject}</h3>
                        {ticket.priority === "HIGH" && (
                          <Badge className="bg-orange-100 text-orange-700">
                            High Priority
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {ticket.category} • {ticket.messages.length} message{ticket.messages.length !== 1 ? "s" : ""}
                      </p>
                      <p className="text-sm text-gray-500">
                        Created {new Date(ticket.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {getStatusBadge(ticket.status)}
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


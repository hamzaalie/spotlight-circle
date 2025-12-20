"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, User, Headphones } from "lucide-react"

interface TicketMessage {
  id: string
  message: string
  isStaff: boolean
  authorEmail: string
  createdAt: string
}

interface Ticket {
  id: string
  subject: string
  category: string
  status: string
  priority: string
  createdAt: string
  messages: TicketMessage[]
  user: {
    email: string
    profile: {
      firstName: string
      lastName: string
    } | null
  }
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTicket()
  }, [params.id])

  const fetchTicket = async () => {
    try {
      const res = await fetch(`/api/support/tickets/${params.id}`)
      const data = await res.json()
      setTicket(data.ticket)
    } catch (error) {
      console.error("Failed to fetch ticket:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSubmitting(true)

    try {
      const res = await fetch(`/api/support/tickets/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: newMessage }),
      })

      if (!res.ok) {
        throw new Error("Failed to send message")
      }

      setNewMessage("")
      fetchTicket()
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading ticket...</div>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Ticket not found</p>
        <Link href="/dashboard/support">
          <Button className="mt-4">Back to Support</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard/support">
          <Button variant="outline" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Support
          </Button>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{ticket.subject}</h1>
            <p className="text-gray-600 mt-1">
              Ticket #{ticket.id.slice(-8)} • {ticket.category}
            </p>
          </div>
          <div className="flex gap-2">
            {ticket.priority === "HIGH" && (
              <Badge className="bg-orange-100 text-orange-700">
                High Priority
              </Badge>
            )}
            <Badge
              className={
                ticket.status === "RESOLVED"
                  ? "bg-green-100 text-green-700"
                  : ticket.status === "CLOSED"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-blue-100 text-blue-700"
              }
            >
              {ticket.status}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.isStaff ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div
                className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                  message.isStaff
                    ? "bg-purple-100 text-purple-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {message.isStaff ? (
                  <Headphones className="h-5 w-5" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div className={`flex-1 ${message.isStaff ? "" : "flex justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.isStaff
                      ? "bg-purple-50 border border-purple-200"
                      : "bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {message.isStaff ? "Support Team" : "You"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {ticket.status !== "CLOSED" && (
        <Card>
          <CardHeader>
            <CardTitle>Reply to Ticket</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                rows={4}
                disabled={submitting}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting || !newMessage.trim()}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {submitting ? "Sending..." : "Send Message"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {ticket.status === "CLOSED" && (
        <Card className="bg-gray-50">
          <CardContent className="py-4">
            <p className="text-sm text-gray-600 text-center">
              This ticket has been closed. Please create a new ticket if you need further assistance.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

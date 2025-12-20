"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft, Headphones, User, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
  updatedAt: string
  user: {
    email: string
    firstName: string
    lastName: string
  }
  messages: TicketMessage[]
}

export default function AdminTicketDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const router = useRouter()
  const { toast } = useToast()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [newStatus, setNewStatus] = useState<string>("")

  useEffect(() => {
    fetchTicket()
  }, [params.id])

  const fetchTicket = async () => {
    try {
      const response = await fetch(`/api/support/tickets/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setTicket(data.ticket)
        setNewStatus(data.ticket.status)
      } else {
        toast({
          title: "Error",
          description: "Failed to load ticket",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ticket",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() && newStatus === ticket?.status) {
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/support/tickets/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message.trim() || undefined,
          status: newStatus !== ticket?.status ? newStatus : undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: message.trim()
            ? "Response sent successfully"
            : "Status updated successfully",
        })
        setMessage("")
        await fetchTicket()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to update ticket",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800"
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800"
      case "RESOLVED":
        return "bg-green-100 text-green-800"
      case "CLOSED":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-100 text-red-800"
      case "HIGH":
        return "bg-orange-100 text-orange-800"
      case "NORMAL":
        return "bg-blue-100 text-blue-800"
      case "LOW":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Ticket not found</p>
          <Link href="/admin/support">
            <Button className="mt-4">Back to Tickets</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/admin/support"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Tickets
        </Link>

        <Card className="p-6">
          {/* Ticket Header */}
          <div className="mb-6 border-b pb-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {ticket.subject}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Ticket #{ticket.id.slice(0, 8)}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace("_", " ")}
                </Badge>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
              <div>
                <span className="text-gray-600">Customer:</span>
                <p className="mt-1 font-medium">
                  {ticket.user.firstName} {ticket.user.lastName}
                </p>
                <p className="text-gray-600">{ticket.user.email}</p>
              </div>
              <div>
                <span className="text-gray-600">Category:</span>
                <p className="mt-1 font-medium">{ticket.category}</p>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <p className="mt-1 font-medium">
                  {new Date(ticket.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="mb-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Conversation
            </h2>
            {ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.isStaff ? "flex-row" : "flex-row-reverse"}`}
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    msg.isStaff ? "bg-purple-100" : "bg-gray-100"
                  }`}
                >
                  {msg.isStaff ? (
                    <Headphones className="h-5 w-5 text-purple-600" />
                  ) : (
                    <User className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-lg p-4 ${
                    msg.isStaff
                      ? "bg-purple-50 text-purple-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {msg.isStaff ? "Support Team" : msg.authorEmail}
                    </span>
                    <span className="text-xs text-gray-600">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Update Status
              </label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="RESOLVED">Resolved</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Reply to Customer
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your response..."
                rows={4}
                disabled={submitting}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="submit"
                disabled={
                  submitting ||
                  (!message.trim() && newStatus === ticket.status)
                }
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {message.trim() ? "Send Reply" : "Update Status"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

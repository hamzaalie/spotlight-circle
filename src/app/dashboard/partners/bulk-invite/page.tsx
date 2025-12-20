"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface InviteResult {
  email: string
  success: boolean
  error?: string
}

export default function BulkInvitePage() {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState("")
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<InviteResult[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResults([]) // Clear previous results
    }
  }

  const downloadTemplate = () => {
    const csv = "email,firstName,lastName,companyName,notes\njohn@example.com,John,Doe,ABC Company,Great professional\njane@example.com,Jane,Smith,XYZ Corp,Expert in their field"
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk-invite-template.csv"
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file || !category) {
      alert("Please select a file and category")
      return
    }

    setProcessing(true)
    setProgress(0)

    try {
      const text = await file.text()
      const lines = text.split("\n").filter(line => line.trim())
      const headers = lines[0].split(",").map(h => h.trim())
      
      // Validate headers
      const requiredHeaders = ["email"]
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h))
      if (missingHeaders.length > 0) {
        throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
      }

      // Parse CSV
      const invites = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim())
        const invite: any = {}
        headers.forEach((header, index) => {
          invite[header] = values[index] || ""
        })
        return invite
      })

      // Send invites
      const inviteResults: InviteResult[] = []
      for (let i = 0; i < invites.length; i++) {
        const invite = invites[i]
        
        try {
          const response = await fetch("/api/partnerships/bulk-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: invite.email,
              category,
              notes: invite.notes || "",
              firstName: invite.firstName || "",
              lastName: invite.lastName || "",
              companyName: invite.companyName || "",
            }),
          })

          if (response.ok) {
            inviteResults.push({ email: invite.email, success: true })
          } else {
            const error = await response.json()
            inviteResults.push({ 
              email: invite.email, 
              success: false, 
              error: error.error || "Failed to send invite" 
            })
          }
        } catch (error) {
          inviteResults.push({ 
            email: invite.email, 
            success: false, 
            error: "Network error" 
          })
        }

        setProgress(((i + 1) / invites.length) * 100)
      }

      setResults(inviteResults)
    } catch (error: any) {
      alert(error.message || "Failed to process file")
    } finally {
      setProcessing(false)
    }
  }

  const successCount = results.filter(r => r.success).length
  const failCount = results.filter(r => !r.success).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Bulk Partner Invitations</h1>
        <p className="text-gray-600 mt-1">
          Upload a CSV file to invite multiple partners at once
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Download the template below to see the required format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            onClick={downloadTemplate}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download CSV Template
          </Button>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">CSV File</Label>
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={processing}
              />
              <p className="text-sm text-gray-500">
                Required columns: email. Optional: firstName, lastName, companyName, notes
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Partnership Category</Label>
              <Select value={category} onValueChange={setCategory} disabled={processing}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accountant">Accountant</SelectItem>
                  <SelectItem value="Attorney">Attorney</SelectItem>
                  <SelectItem value="Financial Advisor">Financial Advisor</SelectItem>
                  <SelectItem value="Insurance Agent">Insurance Agent</SelectItem>
                  <SelectItem value="Real Estate Agent">Real Estate Agent</SelectItem>
                  <SelectItem value="Mortgage Broker">Mortgage Broker</SelectItem>
                  <SelectItem value="Business Consultant">Business Consultant</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Processing invitations...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-brand-gold-400 hover:bg-brand-gold-500 gap-2"
              disabled={!file || !category || processing}
            >
              <Upload className="h-4 w-4" />
              {processing ? "Sending Invitations..." : "Send Bulk Invitations"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {successCount} successful, {failCount} failed out of {results.length} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className="font-medium">{result.email}</span>
                  </div>
                  {result.error && (
                    <span className="text-sm text-red-600">{result.error}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


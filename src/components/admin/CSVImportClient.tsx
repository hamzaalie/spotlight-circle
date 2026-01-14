"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, FileSpreadsheet, CheckCircle, XCircle, Loader2, Download, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Papa from "papaparse"

interface ParsedProfessional {
  Email: string
  "First Name": string
  "Last Name": string
  Company?: string
  Title?: string
  Phone?: string
  Website?: string
  Street?: string
  City: string
  State?: string
  "Zip Code": string
  Country?: string
  "Sub Category"?: string
}

interface ImportResult {
  success: boolean
  email: string
  name: string
  error?: string
}

interface ImportSummary {
  total: number
  successful: number
  failed: number
}

export default function CSVImportClient() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [results, setResults] = useState<ImportResult[] | null>(null)
  const [summary, setSummary] = useState<ImportSummary | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<ParsedProfessional[] | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentBatch, setCurrentBatch] = useState(0)
  const [totalBatches, setTotalBatches] = useState(0)
  const [processedCount, setProcessedCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      setResults(null)
      setSummary(null)
      
      // Preview first 5 rows
      Papa.parse(selectedFile, {
        header: true,
        preview: 5,
        complete: (result) => {
          setPreview(result.data as ParsedProfessional[])
        },
        error: (error) => {
          setError(`Failed to parse CSV: ${error.message}`)
        },
      })
    }
  }

  const handleImport = async () => {
    if (!file) return

    setImporting(true)
    setError(null)
    setResults(null)
    setSummary(null)
    setProgress(0)
    setProcessedCount(0)

    try {
      // Parse entire CSV
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (result) => {
          try {
            const professionals = result.data as ParsedProfessional[]

            if (professionals.length === 0) {
              setError('No data found in CSV file')
              setImporting(false)
              return
            }

            // Transform CSV data to API format (map CSV columns to camelCase)
            const transformedProfessionals = professionals.map(p => ({
              email: p.Email,
              firstName: p["First Name"],
              lastName: p["Last Name"],
              company: p.Company,
              profession: p.Profession || p.Title || 'Professional',
              title: p.Title,
              phone: p.Phone,
              website: p.Website,
              street: p.Street,
              city: p.City,
              state: p.State,
              zipCode: p["Zip Code"],
              country: p.Country || 'US',
              subCategory: p["Sub Category"],
            }))

            setTotalCount(transformedProfessionals.length)

            // Process in batches of 50 to avoid timeouts and memory issues
            const BATCH_SIZE = 50
            const batches: any[][] = []
            
            for (let i = 0; i < transformedProfessionals.length; i += BATCH_SIZE) {
              batches.push(transformedProfessionals.slice(i, i + BATCH_SIZE))
            }

            setTotalBatches(batches.length)

            let allResults: ImportResult[] = []
            let successCount = 0
            let failureCount = 0

            // Process each batch sequentially
            for (let i = 0; i < batches.length; i++) {
              setCurrentBatch(i + 1)
              
              try {
                const response = await fetch('/api/admin/import/professionals', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ professionals: batches[i] }),
                })

                const data = await response.json()

                if (!response.ok) {
                  throw new Error(data.error || 'Batch import failed')
                }

                // Accumulate results
                allResults = [...allResults, ...data.results]
                successCount += data.summary.successful
                failureCount += data.summary.failed

                // Update progress
                const processed = (i + 1) * BATCH_SIZE
                setProcessedCount(Math.min(processed, professionals.length))
                setProgress(Math.round((processed / professionals.length) * 100))

              } catch (batchError) {
                console.error(`Error in batch ${i + 1}:`, batchError)
                // Continue with next batch even if one fails
                const batchResults: ImportResult[] = batches[i].map(prof => ({
                  success: false,
                  email: prof.Email || 'unknown',
                  name: `${prof['First Name'] || ''} ${prof['Last Name'] || ''}`.trim() || 'Unknown',
                  error: batchError instanceof Error ? batchError.message : 'Batch processing failed'
                }))
                allResults = [...allResults, ...batchResults]
                failureCount += batches[i].length
              }
            }

            // Set final results
            setSummary({
              total: professionals.length,
              successful: successCount,
              failed: failureCount,
            })
            setResults(allResults)
            setProgress(100)
            setProcessedCount(professionals.length)

          } catch (err) {
            console.error('Import error:', err)
            setError(err instanceof Error ? err.message : 'Failed to import professionals')
          } finally {
            setImporting(false)
          }
        },
        error: (error) => {
          setError(`Failed to parse CSV: ${error.message}`)
          setImporting(false)
        },
      })
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      setImporting(false)
    }
  }

  const downloadTemplate = () => {
    const template = [
      ['Company', 'Email', 'Street', 'City', 'State', 'Zip Code', 'Country', 'Phone', 'Website', 'Sub Category', 'First Name', 'Last Name', 'Title'],
      ['Acme Corp', 'john.doe@example.com', '123 Main St', 'New York', 'NY', '10001', 'US', '(555) 123-4567', 'https://example.com', 'Real Estate', 'John', 'Doe', 'Real Estate Agent'],
    ]

    const csv = template.map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'professionals-import-template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const reset = () => {
    setFile(null)
    setResults(null)
    setSummary(null)
    setError(null)
    setPreview(null)
    setProgress(0)
    setCurrentBatch(0)
    setTotalBatches(0)
    setProcessedCount(0)
    setTotalCount(0)
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            CSV Import Instructions
          </CardTitle>
          <CardDescription>
            Import multiple professionals at once using a CSV file
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm text-gray-700">
            <p className="font-medium">Required CSV Columns:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li><strong>Email</strong> - Professional's email address (required, must be unique)</li>
              <li><strong>First Name</strong> - First name (required)</li>
              <li><strong>Last Name</strong> - Last name (required)</li>
              <li><strong>City</strong> - City (required)</li>
              <li><strong>Zip Code</strong> - Postal code (required)</li>
              <li><strong>Title</strong> - Job title/profession (required)</li>
            </ul>
            
            <p className="font-medium mt-4">Optional Columns:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Company - Company name</li>
              <li>Phone - Phone number</li>
              <li>Website - Website URL</li>
              <li>Street - Street address</li>
              <li>State - State (2-letter code)</li>
              <li>Country - Country code (default: US)</li>
              <li>Sub Category - Professional category</li>
            </ul>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> Imported professionals will receive a default password of <code className="bg-gray-100 px-1 rounded">Welcome2024!</code> 
              {" "}and should be instructed to change it on first login.
            </AlertDescription>
          </Alert>

          <Button onClick={downloadTemplate} variant="outline" className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Download CSV Template
          </Button>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>
            Select a CSV file containing professional data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand-teal-500 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
              disabled={importing}
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                {file ? file.name : 'Click to upload CSV file'}
              </p>
              <p className="text-xs text-gray-500">
                or drag and drop
              </p>
            </label>
          </div>

          {file && !importing && !results && (
            <div className="flex gap-3">
              <Button onClick={handleImport} className="flex-1 bg-brand-teal-600 hover:bg-brand-teal-700">
                <Upload className="h-4 w-4 mr-2" />
                Import Professionals
              </Button>
              <Button onClick={reset} variant="outline">
                Cancel
              </Button>
            </div>
          )}

          {importing && (
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-teal-600" />
                  <span className="text-gray-600">
                    Importing professionals... Batch {currentBatch} of {totalBatches}
                  </span>
                </div>
                <span className="text-gray-600 font-medium">
                  {processedCount} / {totalCount}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-gray-500 text-center">
                Processing in batches of 50. Please don't close this page.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview */}
      {preview && preview.length > 0 && !results && (
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
            <CardDescription>
              First {preview.length} rows from your CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Company</th>
                    <th className="text-left p-2">Title</th>
                    <th className="text-left p-2">City, State</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-2">{row["First Name"]} {row["Last Name"]}</td>
                      <td className="p-2">{row.Email}</td>
                      <td className="p-2">{row.Company || '-'}</td>
                      <td className="p-2">{row.Title || '-'}</td>
                      <td className="p-2">{row.City}, {row.State || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Import Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
                <div className="text-sm text-gray-600">Total Records</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{summary.successful}</div>
                <div className="text-sm text-green-700">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
            </div>

            <Button onClick={reset} className="w-full">
              Import Another File
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results */}
      {results && results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Import Details</CardTitle>
            <CardDescription>
              Individual results for each professional
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{result.name}</p>
                      <p className="text-xs text-gray-600">{result.email}</p>
                    </div>
                  </div>
                  {result.error && (
                    <span className="text-xs text-red-600">{result.error}</span>
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

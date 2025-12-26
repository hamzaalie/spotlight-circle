"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Loader2, FileImage, Palette, Printer, Users } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface PosterData {
  template: string
  profile: {
    firstName: string
    lastName: string
    profession: string
    companyName: string | null
    phone: string | null
    website: string | null
    email: string
    photo: string | null
    city: string
    state: string | null
  }
  partners: Array<{
    name: string
    profession: string
    companyName: string | null
    photo: string | null
    city: string
    state: string | null
  }>
  customText: string
  qrCode: string | null
  profileUrl: string
}

const templates = [
  { id: "network", name: "Professional Network", color: "teal" },
  { id: "modern", name: "Modern Professional", color: "purple" },
  { id: "classic", name: "Classic Elegant", color: "blue" },
  { id: "bold", name: "Bold & Vibrant", color: "orange" },
  { id: "minimal", name: "Minimal Clean", color: "gray" },
]

export default function PosterGenerator() {
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [template, setTemplate] = useState("network")
  const [customText, setCustomText] = useState("Let's collaborate and grow together!")
  const [includeQR, setIncludeQR] = useState(true)
  const [includePhoto, setIncludePhoto] = useState(true)
  const [posterData, setPosterData] = useState<PosterData | null>(null)
  const posterRef = useRef<HTMLDivElement>(null)

  const generatePosterData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/poster/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template,
          customText,
          includeQR,
          includePhoto,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setPosterData(data.posterData)
      } else {
        alert(data.error || "Failed to generate poster")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Failed to generate poster")
    } finally {
      setLoading(false)
    }
  }

  const downloadPoster = async (format: "png" | "pdf") => {
    if (!posterRef.current) return

    setGenerating(true)
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      })

      if (format === "png") {
        const link = document.createElement("a")
        link.download = `referral-poster-${Date.now()}.png`
        link.href = canvas.toDataURL("image/png")
        link.click()
      } else {
        const imgData = canvas.toDataURL("image/png")
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        })

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const imgWidth = canvas.width
        const imgHeight = canvas.height
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
        const imgX = (pdfWidth - imgWidth * ratio) / 2
        const imgY = 0

        pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio)
        pdf.save(`referral-poster-${Date.now()}.pdf`)
      }
    } catch (error) {
      console.error("Download error:", error)
      alert("Failed to download poster")
    } finally {
      setGenerating(false)
    }
  }

  const orderPrint = async () => {
    if (!posterRef.current) return

    setGenerating(true)
    try {
      const canvas = await html2canvas(posterRef.current, {
        scale: 3, // Higher quality for printing
        backgroundColor: "#ffffff",
        logging: false,
      })

      const imageData = canvas.toDataURL("image/png")
      
      // Create a form to submit to VistaPrint or similar service
      // For now, we'll prepare the data and show options
      const printOptions = {
        vistaprint: `https://www.vistaprint.com/upload-your-own.aspx`,
        printful: `https://www.printful.com/custom-products`,
        canva: `https://www.canva.com/create/posters/`,
      }

      // Show user options to choose print service
      const choice = window.confirm(
        "Would you like to:\n\n" +
        "OK - Order from VistaPrint (Professional printing & shipping)\n" +
        "Cancel - Download high-res file for local printing"
      )

      if (choice) {
        // Open VistaPrint upload page
        window.open(printOptions.vistaprint, '_blank')
        // Also download the file for them to upload
        const link = document.createElement("a")
        link.download = `referral-poster-print-${Date.now()}.png`
        link.href = imageData
        link.click()
      } else {
        // Download high-res version
        const link = document.createElement("a")
        link.download = `referral-poster-highres-${Date.now()}.png`
        link.href = imageData
        link.click()
      }
    } catch (error) {
      console.error("Print preparation error:", error)
      alert("Failed to prepare print file")
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    generatePosterData()
  }, [])

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Poster Configuration
          </CardTitle>
          <CardDescription>Customize your marketing poster</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <Label htmlFor="template">Template Style</Label>
            <Select value={template} onValueChange={setTemplate}>
              <SelectTrigger id="template">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {templates.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Text */}
          <div className="space-y-2">
            <Label htmlFor="customText">Custom Message</Label>
            <Textarea
              id="customText"
              placeholder="Add a custom message..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={3}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="includeQR"
                checked={includeQR}
                onCheckedChange={(checked) => setIncludeQR(checked as boolean)}
              />
              <Label htmlFor="includeQR" className="cursor-pointer">
                Include QR Code
              </Label>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="includePhoto"
                checked={includePhoto}
                onCheckedChange={(checked) => setIncludePhoto(checked as boolean)}
              />
              <Label htmlFor="includePhoto" className="cursor-pointer">
                Include Profile Photo
              </Label>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generatePosterData}
            disabled={loading}
            className="w-full bg-brand-gold-400 hover:bg-brand-gold-500"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4 mr-2" />
                Update Preview
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Preview */}
      {posterData && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              Preview your poster before downloading (Letter size: 8.5" × 11")
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              {/* Poster Preview */}
              <div
                ref={posterRef}
                className="w-full max-w-2xl aspect-[8.5/11] bg-white border-2 border-gray-200 shadow-lg overflow-hidden"
              >
                {template === "network" && <NetworkTemplate data={posterData} />}
                {template === "modern" && <ModernTemplate data={posterData} />}
                {template === "classic" && <ClassicTemplate data={posterData} />}
                {template === "bold" && <BoldTemplate data={posterData} />}
                {template === "minimal" && <MinimalTemplate data={posterData} />}
              </div>

              {/* Download Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={() => downloadPoster("png")}
                  disabled={generating}
                  variant="outline"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download PNG
                </Button>
                <Button
                  onClick={() => downloadPoster("pdf")}
                  disabled={generating}
                  variant="outline"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download PDF
                </Button>
                <Button
                  onClick={orderPrint}
                  disabled={generating}
                  className="bg-brand-gold-400 hover:bg-brand-gold-500 text-white"
                >
                  {generating ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Printer className="h-4 w-4 mr-2" />
                  )}
                  Order Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Network Template (BrightHaven Style)
function NetworkTemplate({ data }: { data: PosterData }) {

  // Use person's full name
  const personName = `${data.profile.firstName} ${data.profile.lastName}`;

  // Show real partners if available, otherwise show placeholders
  let professionals = [];
  if (data.partners && data.partners.length > 0) {
    professionals = data.partners.slice(0, 4);
  } else {
    professionals = Array(4).fill(null).map(() => ({
      name: "Professional Name",
      profession: "Their Profession",
      companyName: "Company Name",
      photo: null,
      city: null,
      state: null,
    }));
  }

  return (
    <div className="h-full bg-white px-6 py-8 flex flex-col items-center justify-start">
      {/* Company Name or Name Header */}
      <div className="flex flex-col items-center mb-3">
        <div className="bg-[#0A2540] text-white px-6 py-2 rounded-lg inline-block">
          <h1 className="text-lg font-bold">{data.profile.companyName || personName}</h1>
        </div>
      </div>

      {/* Title Section */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-2">
          Trusted Referral Partners of<br />{data.profile.companyName || personName}
        </h2>
        <p className="text-sm text-gray-700">
          These professionals are part of our extended care network –<br />providers we trust and recommend for our clients and families.
        </p>
      </div>

      {/* Professional Cards Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-3xl">
        {professionals.map((pro, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-row min-h-[140px]">
            {/* Photo - Left side */}
            <div className="w-28 h-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              {pro.photo ? (
                <img src={pro.photo} alt={pro.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded" />
              )}
            </div>
            {/* Info - Right side */}
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-bold text-gray-900 text-sm mb-0.5 leading-tight">{pro.name}</h3>
              {pro.companyName && (
                <p className="text-xs font-medium text-gray-700 mb-1 leading-tight">{pro.companyName}</p>
              )}
              <div className="bg-gray-50 px-2 py-1 rounded mb-1">
                <p className="text-xs text-gray-600 leading-tight">Specialties: {pro.profession}</p>
              </div>
              {(pro.city || pro.state) && (
                <p className="text-xs text-gray-600 leading-tight">
                  {pro.city && pro.state ? `${pro.city}, ${pro.state}` : pro.city || pro.state}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Why We Refer Section */}
      <div className="border border-gray-300 rounded-lg p-4 mb-6 w-full max-w-3xl text-left">
        <h2 className="text-lg font-bold text-[#0A2540] mb-2">Why We Refer</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          We only recommend professionals we <span className="font-semibold">personally</span> know and trust.<br />
          These aren’t paid placements — just great people who do great work.
        </p>
      </div>

      {/* QR Code Section */}
      {data.qrCode && (
        <div className="w-full max-w-3xl flex items-center justify-between mt-auto">
          <div className="flex flex-col items-start">
            <button className="bg-[#D4AF37] text-white px-6 py-2 rounded font-bold text-base mb-1 cursor-default" disabled>
              Scan the QR code or<br />Enter Website address (URL)
            </button>
            <span className="text-xs text-gray-600">{data.profileUrl}</span>
          </div>
          <div className="bg-white p-2 border border-gray-300 rounded">
            <img src={data.qrCode} alt="QR Code" className="w-24 h-24" />
            <div className="text-xs text-gray-500 text-center mt-1">Scan for Details</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Modern Template
function ModernTemplate({ data }: { data: PosterData }) {
  return (
    <div className="h-full bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 p-12 flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        {data.profile.photo && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white mx-auto mb-6 shadow-xl">
            <img
              src={data.profile.photo}
              alt={`${data.profile.firstName} ${data.profile.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <h1 className="text-5xl font-bold text-white mb-2">
          {data.profile.companyName || `${data.profile.firstName} ${data.profile.lastName}`}
        </h1>
        <p className="text-2xl text-purple-100">{data.profile.profession}</p>
        {data.profile.companyName && (
          <p className="text-xl text-purple-200 mt-2">{data.profile.firstName} {data.profile.lastName}</p>
        )}
      </div>

      {/* Custom Message */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <p className="text-2xl text-white text-center font-medium leading-relaxed">
            {data.customText}
          </p>
        </div>
      </div>

      {/* Footer with QR and Contact */}
      <div className="mt-8 flex items-end justify-between">
        <div className="text-white space-y-2">
          {data.profile.phone && <p className="text-lg">📞 {data.profile.phone}</p>}
          {data.profile.email && <p className="text-lg">📧 {data.profile.email}</p>}
          {data.profile.website && <p className="text-lg">🌐 {data.profile.website}</p>}
          <p className="text-sm text-purple-200 mt-4">
            {data.profile.city}, {data.profile.state}
          </p>
        </div>

        {data.qrCode && (
          <div className="bg-white p-4 rounded-xl shadow-xl">
            <img src={data.qrCode} alt="QR Code" className="w-40 h-40" />
            <p className="text-xs text-center text-gray-600 mt-2">Scan to connect</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Classic Template
function ClassicTemplate({ data }: { data: PosterData }) {
  return (
    <div className="h-full bg-white p-12 flex flex-col border-8 border-blue-900">
      <div className="border-4 border-blue-900 h-full p-8 flex flex-col">
        {/* Header */}
        <div className="text-center border-b-4 border-blue-900 pb-6 mb-6">
          <h1 className="text-5xl font-serif font-bold text-blue-900 mb-2">
            {data.profile.companyName || `${data.profile.firstName} ${data.profile.lastName}`}
          </h1>
          <p className="text-2xl text-blue-700 font-serif">{data.profile.profession}</p>
          {data.profile.companyName && (
            <p className="text-xl text-gray-700 mt-2 italic">{data.profile.firstName} {data.profile.lastName}</p>
          )}
        </div>

        {/* Photo */}
        {data.profile.photo && (
          <div className="flex justify-center mb-6">
            <div className="w-48 h-48 rounded-lg overflow-hidden border-4 border-blue-900 shadow-lg">
              <img
                src={data.profile.photo}
                alt={`${data.profile.firstName} ${data.profile.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Message */}
        <div className="flex-1 flex items-center justify-center">
          <p className="text-2xl text-gray-800 text-center font-serif leading-relaxed max-w-xl">
            "{data.customText}"
          </p>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-blue-900 pt-6 mt-6 flex justify-between items-end">
          <div className="text-blue-900 space-y-1">
            {data.profile.phone && <p className="text-lg">{data.profile.phone}</p>}
            {data.profile.email && <p className="text-lg">{data.profile.email}</p>}
            {data.profile.website && <p className="text-lg">{data.profile.website}</p>}
          </div>

          {data.qrCode && (
            <div className="bg-brand-teal-50 p-3 border-2 border-blue-900">
              <img src={data.qrCode} alt="QR Code" className="w-32 h-32" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Bold Template
function BoldTemplate({ data }: { data: PosterData }) {
  return (
    <div className="h-full bg-black p-0 flex flex-col">
      {/* Top Section - Orange */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-12 text-center">
        <h1 className="text-6xl font-black text-white mb-3 uppercase tracking-wider">
          {data.profile.companyName || data.profile.firstName}
        </h1>
        {!data.profile.companyName && (
          <h1 className="text-6xl font-black text-white uppercase tracking-wider">
            {data.profile.lastName}
          </h1>
        )}
        <div className="h-2 w-32 bg-white mx-auto my-6"></div>
        <p className="text-3xl text-white font-bold uppercase">{data.profile.profession}</p>
        {data.profile.companyName && (
          <p className="text-2xl text-white mt-3">{data.profile.firstName} {data.profile.lastName}</p>
        )}
      </div>

      {/* Middle Section - White */}
      <div className="flex-1 bg-white p-12 flex flex-col justify-center items-center">
        {data.profile.photo && (
          <div className="w-40 h-40 rounded-full overflow-hidden border-8 border-orange-500 mb-8 shadow-2xl">
            <img
              src={data.profile.photo}
              alt={`${data.profile.firstName} ${data.profile.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <p className="text-3xl text-gray-900 text-center font-bold leading-tight max-w-2xl mb-8">
          {data.customText}
        </p>

        {data.qrCode && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <img src={data.qrCode} alt="QR Code" className="w-36 h-36" />
          </div>
        )}
      </div>

      {/* Bottom Section - Black */}
      <div className="bg-black p-8 text-center">
        <div className="flex justify-center items-center gap-8 text-white">
          {data.profile.phone && <p className="text-xl">📞 {data.profile.phone}</p>}
          {data.profile.email && <p className="text-xl">✉️ {data.profile.email}</p>}
          {data.profile.website && <p className="text-xl">🌐 {data.profile.website}</p>}
        </div>
      </div>
    </div>
  )
}

// Minimal Template
function MinimalTemplate({ data }: { data: PosterData }) {
  return (
    <div className="h-full bg-gray-50 p-16 flex flex-col justify-between">
      {/* Header */}
      <div className="text-left">
        {data.profile.companyName ? (
          <h1 className="text-6xl font-light text-gray-900 mb-6">
            {data.profile.companyName}
          </h1>
        ) : (
          <>
            <h1 className="text-6xl font-light text-gray-900 mb-2">
              {data.profile.firstName}
            </h1>
            <h1 className="text-6xl font-light text-gray-900 mb-6">
              {data.profile.lastName}
            </h1>
          </>
        )}
        <div className="h-1 w-24 bg-gray-900 mb-4"></div>
        <p className="text-2xl text-gray-700 font-light">{data.profile.profession}</p>
        {data.profile.companyName && (
          <p className="text-xl text-gray-500 mt-2">{data.profile.firstName} {data.profile.lastName}</p>
        )}
      </div>

      {/* Middle Content */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {data.profile.photo && (
            <div className="w-56 h-56 overflow-hidden border border-gray-300 mb-8">
              <img
                src={data.profile.photo}
                alt={`${data.profile.firstName} ${data.profile.lastName}`}
                className="w-full h-full object-cover grayscale"
              />
            </div>
          )}

          <p className="text-2xl text-gray-800 font-light leading-relaxed max-w-lg">
            {data.customText}
          </p>
        </div>

        {data.qrCode && (
          <div className="ml-8">
            <img src={data.qrCode} alt="QR Code" className="w-48 h-48" />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-6">
        <div className="flex justify-between text-gray-700">
          <div className="space-y-1">
            {data.profile.phone && <p className="text-lg">{data.profile.phone}</p>}
            {data.profile.email && <p className="text-lg">{data.profile.email}</p>}
          </div>
          <div className="text-right space-y-1">
            {data.profile.website && <p className="text-lg">{data.profile.website}</p>}
            <p className="text-sm text-gray-500">
              {data.profile.city}, {data.profile.state}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


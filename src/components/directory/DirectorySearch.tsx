"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Briefcase, Building2, Globe, Search, Loader2, ExternalLink, Map as MapIcon, Grid3x3 } from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const DirectoryMap = dynamic(() => import("./DirectoryMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand-teal-600" />
    </div>
  ),
})

interface Professional {
  id: string
  firstName: string
  lastName: string
  profession: string | null
  companyName: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  photo: string | null
  biography: string | null
  phone: string | null
  website: string | null
  services: string[]
  referralSlug: string
  latitude?: number | null
  longitude?: number | null
  user: {
    id: string
  }
}

interface DirectorySearchProps {
  professions: string[]
  states: string[]
  initialProfessionals: Professional[]
}

export default function DirectorySearch({
  professions,
  states,
  initialProfessionals,
}: DirectorySearchProps) {
  const [professionals, setProfessionals] = useState<Professional[]>(initialProfessionals)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid")
  const [filters, setFilters] = useState({
    profession: "all",
    state: "all",
    city: "",
    zipCode: "",
    search: "",
  })

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.profession !== "all") params.append("profession", filters.profession)
      if (filters.state !== "all") params.append("state", filters.state)
      if (filters.city) params.append("city", filters.city)
      if (filters.zipCode) params.append("zipCode", filters.zipCode)
      if (filters.search) params.append("search", filters.search)

      const res = await fetch(`/api/directory/search?${params.toString()}`)
      const data = await res.json()

      if (res.ok) {
        setProfessionals(data.professionals)
      }
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFilters({
      profession: "all",
      state: "all",
      city: "",
      zipCode: "",
      search: "",
    })
    setProfessionals(initialProfessionals)
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (filters.search) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(debounce)
  }, [filters.search])

  return (
    <div className="space-y-8">
      {/* Search Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Professionals
          </CardTitle>
          <CardDescription>
            Find professionals by location, profession, or keywords
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="space-y-2 lg:col-span-3">
              <Label htmlFor="search">Search Keywords</Label>
              <Input
                id="search"
                placeholder="Name, company, or services..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Profession Filter */}
            <div className="space-y-2">
              <Label htmlFor="profession">Profession</Label>
              <Select
                value={filters.profession}
                onValueChange={(value) => setFilters({ ...filters, profession: value })}
              >
                <SelectTrigger id="profession">
                  <SelectValue placeholder="All Professions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Professions</SelectItem>
                  {professions.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State Filter */}
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={filters.state}
                onValueChange={(value) => setFilters({ ...filters, state: value })}
              >
                <SelectTrigger id="state">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City Input */}
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="Enter city..."
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
            </div>

            {/* ZIP Code Input */}
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                placeholder="Enter ZIP..."
                value={filters.zipCode}
                onChange={(e) => setFilters({ ...filters, zipCode: e.target.value })}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 items-end">
              <Button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 bg-brand-gold-400 hover:bg-brand-gold-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {professionals.length} Professional{professionals.length !== 1 ? "s" : ""} Found
          </h2>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              onClick={() => setViewMode("grid")}
              size="sm"
              className={viewMode === "grid" ? "bg-brand-gold-400 hover:bg-brand-gold-500" : ""}
            >
              <Grid3x3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "outline"}
              onClick={() => setViewMode("map")}
              size="sm"
              className={viewMode === "map" ? "bg-brand-gold-400 hover:bg-brand-gold-500" : ""}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map
            </Button>
          </div>
        </div>

        {professionals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No professionals found matching your criteria</p>
              <Button onClick={handleReset} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Map View */}
            {viewMode === "map" && <DirectoryMap professionals={professionals} />}

            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {professionals.map((prof) => (
              <Card key={prof.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center text-center mb-4">
                    <div className="h-24 w-24 mb-3 rounded-lg overflow-hidden border-2 border-gray-200">
                      {prof.photo ? (
                        <img 
                          src={prof.photo} 
                          alt={`${prof.firstName} ${prof.lastName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-2xl bg-brand-gold-400 text-white font-bold">
                          {prof.firstName[0]}{prof.lastName[0]}
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">
                      {prof.firstName} {prof.lastName}
                    </h3>
                    {prof.profession && (
                      <p className="text-brand-teal-600 font-medium">{prof.profession}</p>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {prof.companyName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Building2 className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{prof.companyName}</span>
                      </div>
                    )}
                    {(prof.city || prof.state) && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {[prof.city, prof.state].filter(Boolean).join(", ")}
                        </span>
                      </div>
                    )}
                    {prof.services && prof.services.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Briefcase className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{prof.services.join(", ")}</span>
                      </div>
                    )}
                  </div>

                  {/* Biography */}
                  {prof.biography && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {prof.biography}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    <Link href={`/p/${prof.referralSlug}`} target="_blank">
                      <Button className="w-full bg-brand-gold-400 hover:bg-brand-gold-500">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Profile
                      </Button>
                    </Link>
                    {prof.website && (
                      <a href={prof.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full">
                          <Globe className="h-4 w-4 mr-2" />
                          Visit Website
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


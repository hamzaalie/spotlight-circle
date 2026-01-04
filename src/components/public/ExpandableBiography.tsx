"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

interface ExpandableBiographyProps {
  biography: string
}

export function ExpandableBiography({ biography }: ExpandableBiographyProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Split biography into paragraphs
  const paragraphs = biography.split('\n\n').filter(p => p.trim())
  
  // Show first 2 paragraphs or ~300 characters
  const shouldTruncate = biography.length > 300 || paragraphs.length > 2
  const truncatedBio = shouldTruncate && !isExpanded
    ? paragraphs.slice(0, 2).join('\n\n')
    : biography

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-teal-700">
          <Briefcase className="h-5 w-5" />
          Professional Biography
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {truncatedBio}
        </p>
        {shouldTruncate && (
          <Button
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 text-brand-teal-600 hover:text-brand-teal-700 p-0"
          >
            {isExpanded ? "Show less" : "Read more"}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { UpdateStatusDialog } from "./UpdateStatusDialog"

interface ReferralCardProps {
  referral: any
  partner: any
  profile: any
  type: "sent" | "received"
}

const statusColors: Record<string, string> = {
  NEW: "bg-brand-teal-100 text-brand-teal-800",
  CONTACTED: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-brand-teal-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  LOST: "bg-gray-100 text-gray-800",
}

export function ReferralCard({ referral, partner, profile, type }: ReferralCardProps) {
  const router = useRouter()
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)

  if (!profile) return null

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{referral.clientName}</h3>
                <Badge className={statusColors[referral.status] || ""}>
                  {referral.status.replace("_", " ")}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{referral.clientEmail}</p>
                </div>
                {referral.clientPhone && (
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{referral.clientPhone}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">
                    {type === "sent" ? "Sent to" : "Sent by"}
                  </p>
                  <p className="font-medium">
                    {profile.firstName} {profile.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Date</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(referral.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {referral.clientNotes && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700">{referral.clientNotes}</p>
                </div>
              )}

              {referral.completedAt && (
                <div className="text-sm text-gray-500">
                  Completed {formatDistanceToNow(new Date(referral.completedAt), { addSuffix: true })}
                </div>
              )}
            </div>

            {type === "received" && referral.status !== "COMPLETED" && referral.status !== "LOST" && (
              <Button
                size="sm"
                onClick={() => setShowUpdateDialog(true)}
                className="ml-4"
              >
                Update Status
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <UpdateStatusDialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        referral={referral}
        onSuccess={() => {
          setShowUpdateDialog(false)
          router.refresh()
        }}
      />
    </>
  )
}


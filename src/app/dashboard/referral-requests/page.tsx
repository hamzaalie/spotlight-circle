import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, MessageSquare, Calendar, Users } from "lucide-react"
import { ReferralRequestActions } from "@/components/dashboard/ReferralRequestActions"

export default async function ReferralRequestsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  // Fetch all referral requests for this user
  const referralRequests = await prisma.referralRequest.findMany({
    where: {
      profileOwnerId: session.user.id,
    },
    include: {
      partnerUser: {
        include: {
          profile: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const pendingRequests = referralRequests.filter(r => r.status === "PENDING")
  const forwardedRequests = referralRequests.filter(r => r.status === "FORWARDED")
  const otherRequests = referralRequests.filter(r => !["PENDING", "FORWARDED"].includes(r.status))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Requests</h1>
        <p className="text-gray-600">
          Manage incoming requests from people who want referrals to your partners.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-700">{pendingRequests.length}</div>
            <div className="text-xs text-yellow-600 font-medium">Pending Requests</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{forwardedRequests.length}</div>
            <div className="text-xs text-green-600 font-medium">Forwarded</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4 text-center">
            <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{referralRequests.length}</div>
            <div className="text-xs text-blue-600 font-medium">Total Requests</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Requests</h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => {
              const partner = request.partnerUser.profile
              const partnerName = partner
                ? `${partner.firstName} ${partner.lastName}`
                : "Unknown Partner"

              return (
                <Card key={request.id} className="border-l-4 border-l-yellow-400">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Left: Partner Info */}
                      <div className="flex items-start gap-4 md:w-1/3 border-r pr-6">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={partner?.photo || undefined} alt={partnerName} />
                          <AvatarFallback className="bg-gradient-to-br from-brand-teal-400 to-brand-gold-300 text-white text-xl font-bold">
                            {partner ? `${partner.firstName[0]}${partner.lastName[0]}` : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{partnerName}</h3>
                          <p className="text-sm text-gray-600">{partner?.profession}</p>
                          <Badge className="mt-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                            Referral Request
                          </Badge>
                        </div>
                      </div>

                      {/* Middle: Requester Info */}
                      <div className="md:w-1/3 space-y-3">
                        <h4 className="font-semibold text-gray-900 mb-2">Requester Details</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{request.requesterName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <a
                            href={`mailto:${request.requesterEmail}`}
                            className="text-brand-teal-600 hover:underline"
                          >
                            {request.requesterEmail}
                          </a>
                        </div>
                        {request.requesterPhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 text-gray-500" />
                            <a
                              href={`tel:${request.requesterPhone}`}
                              className="text-brand-teal-600 hover:underline"
                            >
                              {request.requesterPhone}
                            </a>
                          </div>
                        )}
                        {request.requesterMessage && (
                          <div className="mt-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                              <div className="text-sm">
                                <p className="font-medium text-gray-700 mb-1">Message:</p>
                                <p className="text-gray-600 italic">{request.requesterMessage}</p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.createdAt).toLocaleDateString()} at{" "}
                          {new Date(request.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="md:w-1/3 flex flex-col justify-center">
                        <ReferralRequestActions requestId={request.id} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Forwarded Requests */}
      {forwardedRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Forwarded Requests</h2>
          <div className="space-y-4">
            {forwardedRequests.map((request) => {
              const partner = request.partnerUser.profile
              const partnerName = partner
                ? `${partner.firstName} ${partner.lastName}`
                : "Unknown Partner"

              return (
                <Card key={request.id} className="border-l-4 border-l-green-400">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={partner?.photo || undefined} alt={partnerName} />
                        <AvatarFallback className="bg-gradient-to-br from-brand-teal-400 to-brand-gold-300 text-white font-bold">
                          {partner ? `${partner.firstName[0]}${partner.lastName[0]}` : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900">{partnerName}</h3>
                            <p className="text-sm text-gray-600">{partner?.profession}</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 border-green-300">
                            Forwarded
                          </Badge>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>
                            <span className="font-medium">Requester:</span> {request.requesterName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Forwarded on {new Date(request.forwardedAt!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Other Requests (Declined, Expired) */}
      {otherRequests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Other Requests</h2>
          <div className="space-y-4">
            {otherRequests.map((request) => {
              const partner = request.partnerUser.profile
              const partnerName = partner
                ? `${partner.firstName} ${partner.lastName}`
                : "Unknown Partner"

              return (
                <Card key={request.id} className="opacity-60">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={partner?.photo || undefined} alt={partnerName} />
                          <AvatarFallback className="bg-gray-300 text-gray-700 font-bold">
                            {partner ? `${partner.firstName[0]}${partner.lastName[0]}` : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{partnerName}</p>
                          <p className="text-xs text-gray-500">
                            {request.requesterName} • {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        {request.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {referralRequests.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Referral Requests Yet</h3>
            <p className="text-gray-600">
              When people request referrals to your partners, they'll appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PrintOrder } from "@prisma/client"

export default async function PrintOrdersPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const orders = await prisma.printOrder.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8 text-brand-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            Print Orders
          </h1>
        </div>
        <p className="text-gray-600">
          Track your poster print orders and shipments
        </p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Print Orders Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Order your first poster from the Poster Generator
                </p>
                <a
                  href="/dashboard/poster"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold-400 hover:bg-brand-gold-500 text-white rounded-lg font-medium"
                >
                  Create Poster
                </a>
              </div>
            </CardContent>
          </Card>
        ) : (
          orders.map((order: PrintOrder) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {order.size}" Poster
                      {order.frameStyle && order.frameStyle !== 'none' && 
                        ` with ${order.frameStyle.replace('_', ' ')} frame`
                      }
                    </CardTitle>
                    <CardDescription>
                      Order placed {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Quantity</p>
                      <p className="font-medium">{order.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Size</p>
                      <p className="font-medium">{order.size}"</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Price</p>
                      <p className="font-medium">
                        ${((order.totalPrice + (order.shippingCost || 0)) / 100).toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-mono text-xs">{order.id.slice(0, 8)}</p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipping To</p>
                    <p className="text-sm">
                      {order.shippingName}<br />
                      {order.shippingAddress1}
                      {order.shippingAddress2 && <>, {order.shippingAddress2}</>}<br />
                      {order.shippingCity}, {order.shippingState} {order.shippingZip}
                    </p>
                  </div>

                  {/* Tracking Info */}
                  {order.trackingNumber && (
                    <div className="bg-brand-teal-50 border border-brand-teal-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-brand-teal-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-brand-teal-900 mb-1">
                            Tracking Information
                          </p>
                          <p className="text-sm text-brand-teal-700 mb-2">
                            {order.carrier && `${order.carrier}: `}
                            {order.trackingNumber}
                          </p>
                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-brand-teal-600 hover:text-brand-teal-700 underline"
                            >
                              Track Package →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {order.errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-red-900 mb-1">
                            Order Issue
                          </p>
                          <p className="text-sm text-red-700">
                            {order.errorMessage}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-3">Order Timeline</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="h-4 w-4" />
                        Order placed: {new Date(order.createdAt).toLocaleString()}
                      </div>
                      {order.paidAt && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <CheckCircle className="h-4 w-4" />
                          Payment received: {new Date(order.paidAt).toLocaleString()}
                        </div>
                      )}
                      {order.shippedAt && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <CheckCircle className="h-4 w-4" />
                          Shipped: {new Date(order.shippedAt).toLocaleString()}
                        </div>
                      )}
                      {order.deliveredAt && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Delivered: {new Date(order.deliveredAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    PENDING: { label: "Pending", color: "bg-gray-100 text-gray-800", icon: Clock },
    PROCESSING: { label: "Processing", color: "bg-blue-100 text-blue-800", icon: Package },
    IN_PRODUCTION: { label: "In Production", color: "bg-purple-100 text-purple-800", icon: Package },
    SHIPPED: { label: "Shipped", color: "bg-brand-teal-100 text-brand-teal-800", icon: Truck },
    DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
    CANCELLED: { label: "Cancelled", color: "bg-gray-100 text-gray-800", icon: XCircle },
    FAILED: { label: "Failed", color: "bg-red-100 text-red-800", icon: XCircle },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  const Icon = config.icon

  return (
    <Badge className={`${config.color} flex items-center gap-1`} variant="outline">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}

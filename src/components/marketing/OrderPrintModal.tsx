"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Truck, CreditCard } from "lucide-react"
import { POSTER_SIZES, FRAME_STYLES, MATERIAL_FINISHES } from "@/lib/artelo"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface OrderPrintModalProps {
  open: boolean
  onClose: () => void
  posterImageUrl: string
}

export function OrderPrintModal({ open, onClose, posterImageUrl }: OrderPrintModalProps) {
  const [step, setStep] = useState<"configure" | "shipping" | "payment">("configure")
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState("")
  const [orderId, setOrderId] = useState("")

  // Configuration state
  const [size, setSize] = useState("18x24")
  const [frameStyle, setFrameStyle] = useState("black_metal")
  const [material, setMaterial] = useState("premium_matte")
  const [quantity, setQuantity] = useState(1)

  // Shipping state
  const [shippingName, setShippingName] = useState("")
  const [shippingAddress1, setShippingAddress1] = useState("")
  const [shippingAddress2, setShippingAddress2] = useState("")
  const [shippingCity, setShippingCity] = useState("")
  const [shippingState, setShippingState] = useState("")
  const [shippingZip, setShippingZip] = useState("")
  const [shippingPhone, setShippingPhone] = useState("")

  // Pricing state
  const [pricing, setPricing] = useState<any>(null)
  const [loadingPricing, setLoadingPricing] = useState(false)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep("configure")
      setClientSecret("")
      setOrderId("")
      setPricing(null)
    }
  }, [open])

  // Fetch pricing when configuration changes
  useEffect(() => {
    if (size && shippingZip.length >= 5) {
      fetchPricing()
    }
  }, [size, frameStyle, material, quantity, shippingZip])

  const fetchPricing = async () => {
    if (shippingZip.length < 5) return

    setLoadingPricing(true)
    try {
      const res = await fetch("/api/print-orders/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posterImageUrl,
          size,
          frameStyle,
          material,
          quantity,
          shippingZip,
          shippingCountry: "US",
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setPricing(data)
      }
    } catch (error) {
      console.error("Error fetching pricing:", error)
    } finally {
      setLoadingPricing(false)
    }
  }

  const handleContinueToShipping = () => {
    setStep("shipping")
  }

  const handleContinueToPayment = async () => {
    if (!validateShipping()) {
      alert("Please fill in all required shipping information")
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/print-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posterImageUrl,
          size,
          frameStyle,
          material,
          quantity,
          shippingName,
          shippingAddress1,
          shippingAddress2,
          shippingCity,
          shippingState,
          shippingZip,
          shippingCountry: "US",
          shippingPhone,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setClientSecret(data.clientSecret)
        setOrderId(data.orderId)
        setPricing(data.pricing)
        setStep("payment")
      } else {
        const error = await res.json()
        alert(error.error || "Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      alert("Failed to create order")
    } finally {
      setLoading(false)
    }
  }

  const validateShipping = () => {
    return (
      shippingName &&
      shippingAddress1 &&
      shippingCity &&
      shippingState &&
      shippingZip.length >= 5
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Professional Print</DialogTitle>
          <DialogDescription>
            Get your poster professionally printed and shipped to your door
          </DialogDescription>
        </DialogHeader>

        {step === "configure" && (
          <ConfigureStep
            size={size}
            setSize={setSize}
            frameStyle={frameStyle}
            setFrameStyle={setFrameStyle}
            material={material}
            setMaterial={setMaterial}
            quantity={quantity}
            setQuantity={setQuantity}
            shippingZip={shippingZip}
            setShippingZip={setShippingZip}
            pricing={pricing}
            loadingPricing={loadingPricing}
            onContinue={handleContinueToShipping}
          />
        )}

        {step === "shipping" && (
          <ShippingStep
            shippingName={shippingName}
            setShippingName={setShippingName}
            shippingAddress1={shippingAddress1}
            setShippingAddress1={setShippingAddress1}
            shippingAddress2={shippingAddress2}
            setShippingAddress2={setShippingAddress2}
            shippingCity={shippingCity}
            setShippingCity={setShippingCity}
            shippingState={shippingState}
            setShippingState={setShippingState}
            shippingZip={shippingZip}
            setShippingZip={setShippingZip}
            shippingPhone={shippingPhone}
            setShippingPhone={setShippingPhone}
            loading={loading}
            onBack={() => setStep("configure")}
            onContinue={handleContinueToPayment}
          />
        )}

        {step === "payment" && clientSecret && (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentStep
              orderId={orderId}
              pricing={pricing}
              onBack={() => setStep("shipping")}
              onSuccess={() => {
                alert("Order placed successfully! You'll receive a confirmation email shortly.")
                onClose()
              }}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ConfigureStep({
  size,
  setSize,
  frameStyle,
  setFrameStyle,
  material,
  setMaterial,
  quantity,
  setQuantity,
  shippingZip,
  setShippingZip,
  pricing,
  loadingPricing,
  onContinue,
}: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="size">Poster Size</Label>
          <Select value={size} onValueChange={setSize}>
            <SelectTrigger id="size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {POSTER_SIZES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label} - {s.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="frame">Frame Style</Label>
          <Select value={frameStyle} onValueChange={setFrameStyle}>
            <SelectTrigger id="frame">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FRAME_STYLES.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label} - {f.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="material">Material Finish</Label>
          <Select value={material} onValueChange={setMaterial}>
            <SelectTrigger id="material">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_FINISHES.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label} - {m.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            max="100"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          />
        </div>

        <div>
          <Label htmlFor="zip">ZIP Code (for shipping estimate)</Label>
          <Input
            id="zip"
            placeholder="12345"
            value={shippingZip}
            onChange={(e) => setShippingZip(e.target.value)}
            maxLength={5}
          />
        </div>
      </div>

      {/* Pricing Display */}
      {loadingPricing && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Loader2 className="h-4 w-4 animate-spin" />
          Calculating pricing...
        </div>
      )}

      {pricing && !loadingPricing && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Unit Price:</span>
            <span>${(pricing.unitPrice / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Subtotal ({quantity}x):</span>
            <span>${(pricing.totalPrice / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>${(pricing.shippingCost / 100).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold">
            <span>Total:</span>
            <span>${(pricing.grandTotal / 100).toFixed(2)}</span>
          </div>
          {pricing.estimatedDeliveryDays && (
            <p className="text-xs text-gray-600 flex items-center gap-1">
              <Truck className="h-3 w-3" />
              Estimated delivery: {pricing.estimatedDeliveryDays} business days
            </p>
          )}
        </div>
      )}

      <Button
        onClick={onContinue}
        disabled={!pricing || loadingPricing}
        className="w-full bg-brand-gold-400 hover:bg-brand-gold-500"
      >
        Continue to Shipping
      </Button>
    </div>
  )
}

function ShippingStep({
  shippingName,
  setShippingName,
  shippingAddress1,
  setShippingAddress1,
  shippingAddress2,
  setShippingAddress2,
  shippingCity,
  setShippingCity,
  shippingState,
  setShippingState,
  shippingZip,
  setShippingZip,
  shippingPhone,
  setShippingPhone,
  loading,
  onBack,
  onContinue,
}: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={shippingName}
            onChange={(e) => setShippingName(e.target.value)}
            placeholder="John Doe"
          />
        </div>

        <div>
          <Label htmlFor="address1">Address Line 1 *</Label>
          <Input
            id="address1"
            value={shippingAddress1}
            onChange={(e) => setShippingAddress1(e.target.value)}
            placeholder="123 Main St"
          />
        </div>

        <div>
          <Label htmlFor="address2">Address Line 2</Label>
          <Input
            id="address2"
            value={shippingAddress2}
            onChange={(e) => setShippingAddress2(e.target.value)}
            placeholder="Apt 4B"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
              placeholder="New York"
            />
          </div>

          <div>
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              value={shippingState}
              onChange={(e) => setShippingState(e.target.value.toUpperCase())}
              placeholder="NY"
              maxLength={2}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zip">ZIP Code *</Label>
            <Input
              id="zip"
              value={shippingZip}
              onChange={(e) => setShippingZip(e.target.value)}
              placeholder="12345"
              maxLength={5}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={shippingPhone}
              onChange={(e) => setShippingPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={loading}
          className="flex-1 bg-brand-gold-400 hover:bg-brand-gold-500"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Continue to Payment
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function PaymentStep({ orderId, pricing, onBack, onSuccess }: any) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || "Payment failed")
        setLoading(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      })

      if (confirmError) {
        setError(confirmError.message || "Payment failed")
        setLoading(false)
        return
      }

      // Payment successful, confirm order with Artelo
      const res = await fetch(`/api/print-orders/${orderId}/confirm`, {
        method: "POST",
      })

      if (res.ok) {
        onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to process order")
      }
    } catch (err) {
      console.error("Payment error:", err)
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {pricing && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>${(pricing.totalPrice / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping:</span>
            <span>${(pricing.shippingCost / 100).toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${(pricing.grandTotal / 100).toFixed(2)}</span>
          </div>
        </div>
      )}

      <div>
        <Label>Payment Information</Label>
        <div className="mt-2 p-4 border rounded-lg">
          <PaymentElement />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={loading}>
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 bg-brand-gold-400 hover:bg-brand-gold-500"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4 mr-2" />
              Place Order
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

# 🖨️ Artelo Print Integration Guide

Complete guide for the Artelo poster printing integration in Spotlight Circles.

---

## 📋 Overview

The Artelo integration allows partners to order professional printed posters directly from their dashboard. Orders are automatically sent to Artelo for fulfillment, with tracking and status updates synced back to the platform.

### Key Features
- ✅ Direct poster ordering from dashboard
- ✅ Multiple size options (12x18", 18x24", 24x36", 27x40")
- ✅ Frame style selection (black metal, white metal, natural wood, etc.)
- ✅ Material finish options (matte, glossy, semi-gloss)
- ✅ Real-time pricing calculation
- ✅ Integrated payment via Stripe
- ✅ Automated order fulfillment
- ✅ Shipment tracking
- ✅ Order history and status updates

---

## 🔧 Setup Instructions

### 1. Get Artelo API Credentials

1. Contact Artelo at https://www.artelo.io/contact
2. Request API access and wholesale pricing
3. Mention you're integrating for automated poster orders
4. You'll receive:
   - API Key
   - API Base URL
   - Webhook Secret

### 2. Add Environment Variables

Add these to your `.env` file:

```env
# Artelo Print Service
ARTELO_API_KEY="your-artelo-api-key-here"
ARTELO_API_URL="https://api.artelo.io/v1"
ARTELO_WEBHOOK_SECRET="your-webhook-secret-here"
```

### 3. Run Database Migration

```bash
npx prisma db push
```

This creates the `PrintOrder` table and `PrintOrderStatus` enum.

### 4. Configure Webhook (After Deployment)

Once deployed, provide Artelo with your webhook URL:
```
https://your-domain.com/api/webhooks/artelo
```

This endpoint receives order status updates from Artelo.

---

## 🏗️ Architecture

### Database Schema

```prisma
model PrintOrder {
  id                    String           @id @default(cuid())
  userId                String
  posterImageUrl        String
  size                  String
  frameStyle            String?
  material              String?
  quantity              Int
  unitPrice             Float
  totalPrice            Float
  shippingCost          Float?
  arteloOrderId         String?          @unique
  arteloStatus          String?
  stripePaymentIntentId String?          @unique
  paid                  Boolean
  shippingName          String
  shippingAddress1      String
  shippingAddress2      String?
  shippingCity          String
  shippingState         String
  shippingZip           String
  shippingCountry       String
  trackingNumber        String?
  trackingUrl           String?
  carrier               String?
  status                PrintOrderStatus
  createdAt             DateTime
  updatedAt             DateTime
}

enum PrintOrderStatus {
  PENDING
  PROCESSING
  IN_PRODUCTION
  SHIPPED
  DELIVERED
  CANCELLED
  FAILED
}
```

### Key Components

#### 1. **Artelo Service** (`src/lib/artelo.ts`)
- API wrapper for Artelo endpoints
- Pricing calculation
- Order creation
- Order status retrieval
- Webhook verification

#### 2. **Order API Routes**
- `POST /api/print-orders` - Create new order
- `GET /api/print-orders` - Get user's orders
- `POST /api/print-orders/pricing` - Get pricing estimate
- `POST /api/print-orders/[id]/confirm` - Confirm payment & submit to Artelo

#### 3. **Webhook Handler** (`src/app/api/webhooks/artelo/route.ts`)
- Receives order status updates from Artelo
- Updates order status in database
- Sends email notifications (TODO)

#### 4. **UI Components**
- `OrderPrintModal` - Multi-step order flow
- `PosterGenerator` - Poster creation with "Order Print" button
- Print Orders Page - Order history and tracking

---

## 🔄 Order Flow

### User Perspective

1. **Create Poster** → User designs poster in `/dashboard/poster`
2. **Click "Order Print"** → Opens order modal
3. **Configure** → Select size, frame, material, quantity
4. **Enter Shipping** → Provide shipping address
5. **Pay** → Complete payment via Stripe
6. **Confirmation** → Receives order confirmation
7. **Track** → Monitor order status in `/dashboard/print-orders`

### Technical Flow

```
1. User clicks "Order Print"
   ↓
2. Generate high-res poster image
   ↓
3. User configures order (size, frame, etc.)
   ↓
4. Fetch pricing from Artelo API
   ↓
5. User enters shipping information
   ↓
6. Create PrintOrder in database (PENDING)
   ↓
7. Create Stripe PaymentIntent
   ↓
8. User completes payment
   ↓
9. Payment confirmed → Call /api/print-orders/[id]/confirm
   ↓
10. Submit order to Artelo API
   ↓
11. Artelo returns order ID
   ↓
12. Update PrintOrder (PROCESSING, save Artelo ID)
   ↓
13. Artelo processes and ships order
   ↓
14. Artelo sends webhook updates
   ↓
15. Status updates displayed to user
```

---

## 📡 API Reference

### Create Order

**Endpoint:** `POST /api/print-orders`

**Request Body:**
```json
{
  "posterImageUrl": "data:image/png;base64,...",
  "size": "18x24",
  "frameStyle": "black_metal",
  "material": "premium_matte",
  "quantity": 1,
  "shippingName": "John Doe",
  "shippingAddress1": "123 Main St",
  "shippingAddress2": "Apt 4B",
  "shippingCity": "New York",
  "shippingState": "NY",
  "shippingZip": "10001",
  "shippingCountry": "US",
  "shippingPhone": "(555) 123-4567"
}
```

**Response:**
```json
{
  "orderId": "clxxx...",
  "clientSecret": "pi_xxx_secret_xxx",
  "pricing": {
    "unitPrice": 2500,
    "totalPrice": 2500,
    "shippingCost": 800,
    "grandTotal": 3300
  }
}
```

### Get Pricing

**Endpoint:** `POST /api/print-orders/pricing`

**Request Body:**
```json
{
  "posterImageUrl": "data:image/png;base64,...",
  "size": "18x24",
  "frameStyle": "black_metal",
  "material": "premium_matte",
  "quantity": 1,
  "shippingZip": "10001",
  "shippingCountry": "US"
}
```

**Response:**
```json
{
  "unitPrice": 2500,
  "totalPrice": 2500,
  "shippingCost": 800,
  "grandTotal": 3300,
  "estimatedDeliveryDays": 5
}
```

### Confirm Order

**Endpoint:** `POST /api/print-orders/[id]/confirm`

Called automatically after successful payment.

**Response:**
```json
{
  "success": true,
  "order": { /* PrintOrder object */ },
  "arteloOrderId": "artelo_xxx"
}
```

---

## 🎨 Available Options

### Poster Sizes
- **12x18"** - Small
- **18x24"** - Medium (default)
- **24x36"** - Large
- **27x40"** - Movie Poster

### Frame Styles
- **None** - Poster only
- **Black Metal** - Modern black frame
- **White Metal** - Clean white frame
- **Natural Wood** - Warm wood frame
- **Black Wood** - Classic black wood

### Material Finishes
- **Premium Matte** - Professional finish (default)
- **Glossy** - Vibrant colors
- **Semi-Gloss** - Balanced finish

---

## 🔔 Webhook Events

Artelo sends webhook events to `/api/webhooks/artelo` for order updates:

### Event Types

- `order.created` - Order received by Artelo
- `order.processing` - Order being processed
- `order.in_production` - Poster being printed/framed
- `order.shipped` - Order shipped (includes tracking info)
- `order.delivered` - Order delivered
- `order.cancelled` - Order cancelled
- `order.failed` - Order failed (includes error message)

### Webhook Payload Example

```json
{
  "type": "order.shipped",
  "data": {
    "id": "artelo_xxx",
    "status": "shipped",
    "tracking": {
      "number": "1Z999AA10123456784",
      "url": "https://track.ups.com/...",
      "carrier": "UPS"
    }
  }
}
```

---

## 💰 Pricing & Revenue

### Wholesale Pricing
- Negotiate wholesale pricing with Artelo
- Pricing typically based on:
  - Poster size
  - Frame style
  - Material finish
  - Quantity (volume discounts)

### Revenue Share
- Configure fee structure with Artelo
- Options:
  1. Mark up wholesale price
  2. Receive commission per order
  3. Hybrid model

### Example Pricing Structure
```
18x24" Premium Matte, No Frame:
  Wholesale: $15.00
  Shipping: $8.00
  Your Price: $25.00
  Profit: $2.00 per order
```

---

## 🧪 Testing

### Test Mode Setup

1. Request Artelo test API credentials
2. Add to `.env`:
```env
ARTELO_API_KEY="test_key_xxx"
ARTELO_API_URL="https://api.artelo.io/v1/test"
```

3. Test the complete flow:
   - Create poster
   - Configure order
   - Use Stripe test card: `4242 4242 4242 4242`
   - Verify order in database
   - Check order status updates

### Manual Testing Checklist

- [ ] Generate poster
- [ ] Click "Order Print via Artelo"
- [ ] Configure size, frame, material
- [ ] See pricing update
- [ ] Enter shipping address
- [ ] Complete payment (Stripe test mode)
- [ ] Verify order created in database
- [ ] Check order appears in `/dashboard/print-orders`
- [ ] Test webhook with mock payload
- [ ] Verify status updates reflected

---

## 🚨 Error Handling

### Common Issues

**1. Artelo API Key Invalid**
```
Error: ARTELO_API_KEY is not configured
```
**Solution:** Add `ARTELO_API_KEY` to `.env`

**2. Pricing Request Fails**
```
Error: Failed to get pricing
```
**Solution:** 
- Check API key validity
- Verify poster image URL is accessible
- Check shipping ZIP code format

**3. Order Submission Fails**
```
Error: Failed to submit order to Artelo
```
**Solution:**
- Check order data format
- Verify shipping address is complete
- Check Artelo API status

**4. Payment Fails**
```
Error: Payment failed
```
**Solution:**
- Verify Stripe configuration
- Check card details
- Ensure amount calculation is correct

---

## 📊 Admin Features (TODO)

Future enhancements for admin dashboard:

- [ ] View all print orders across users
- [ ] Order analytics (volume, revenue)
- [ ] Manual order creation
- [ ] Order cancellation/refund
- [ ] Artelo integration health monitoring
- [ ] Pricing management
- [ ] Bulk order export

---

## 🔐 Security Considerations

### Best Practices

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys periodically

2. **Webhook Verification**
   - Always verify webhook signatures
   - Use `ARTELO_WEBHOOK_SECRET`
   - Implement replay attack prevention

3. **Payment Security**
   - Use Stripe's secure payment flow
   - Never store full card details
   - Implement idempotency for order creation

4. **User Data**
   - Encrypt sensitive shipping info
   - Comply with PCI-DSS for payment data
   - Follow GDPR for EU customers

---

## 📈 Monitoring & Analytics

### Metrics to Track

- Order volume (daily, weekly, monthly)
- Order status distribution
- Average order value
- Revenue per order
- Failed order rate
- Delivery time
- Customer satisfaction

### Logging

Key events to log:
- Order creation
- Payment processing
- Artelo API calls
- Webhook receipts
- Order status changes
- Errors and failures

---

## 🆘 Support & Troubleshooting

### Artelo Support
- Email: support@artelo.io
- API Documentation: https://www.artelo.io/artelo-api/documentation
- Status Page: (check with Artelo)

### Internal Support
- Check application logs
- Review Stripe dashboard for payment issues
- Verify database consistency
- Test webhook endpoint with curl

---

## 🔮 Future Enhancements

Potential improvements:

- [ ] Bulk order discounts
- [ ] Partner branding on posters
- [ ] Custom poster sizes
- [ ] International shipping
- [ ] Order scheduling
- [ ] Reorder functionality
- [ ] Gift orders
- [ ] Order notifications via SMS
- [ ] Print quality guarantee
- [ ] Custom framing options
- [ ] Canvas prints
- [ ] Digital download option

---

**Integration Complete! Partners can now order professional posters with just a few clicks. 🎉**

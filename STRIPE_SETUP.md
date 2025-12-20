# Stripe Configuration Guide

## Required Environment Variables

Add these to your `.env` file:

```env
# Stripe API Keys (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...  # For testing, use sk_live_... for production
STRIPE_PUBLISHABLE_KEY=pk_test_...  # For testing, use pk_live_... for production

# Stripe Webhook Secret (Get from https://dashboard.stripe.com/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (Created in next step)
STRIPE_SETUP_FEE_PRICE_ID=price_...
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_ANNUAL_PRICE_ID=price_...
```

## Setup Steps

### 1. Create Stripe Account
- Go to https://stripe.com and create an account
- Complete business verification (required for production)

### 2. Get API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Secret key** (starts with `sk_test_`)
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Add both to your `.env` file

### 3. Create Products & Prices

#### Setup Fee Product
1. Go to https://dashboard.stripe.com/products
2. Click **+ Add product**
3. Product details:
   - Name: `Spotlight Circles - Setup Fee`
   - Description: `One-time setup fee for new members`
4. Pricing:
   - One time
   - Price: `$99.00 USD`
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_`) to `STRIPE_SETUP_FEE_PRICE_ID`

#### Monthly Subscription
1. Click **+ Add product**
2. Product details:
   - Name: `Spotlight Circles - Monthly`
   - Description: `Monthly subscription to Spotlight Circles`
3. Pricing:
   - Recurring
   - Billing period: `Monthly`
   - Price: `$29.00 USD`
4. Click **Save product**
5. Copy the **Price ID** to `STRIPE_MONTHLY_PRICE_ID`

#### Annual Subscription
1. Click **+ Add product**
2. Product details:
   - Name: `Spotlight Circles - Annual`
   - Description: `Annual subscription to Spotlight Circles (save $58)`
3. Pricing:
   - Recurring
   - Billing period: `Yearly`
   - Price: `$290.00 USD`
4. Click **Save product**
5. Copy the **Price ID** to `STRIPE_ANNUAL_PRICE_ID`

### 4. Set Up Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click **+ Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - For local testing: Use **Stripe CLI** or **ngrok**
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Click on the endpoint you just created
7. Click **Reveal** under **Signing secret**
8. Copy the webhook secret (starts with `whsec_`) to `STRIPE_WEBHOOK_SECRET`

### 5. Enable Billing Portal (Customer Portal)

1. Go to https://dashboard.stripe.com/settings/billing/portal
2. Click **Activate**
3. Configure settings:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to view billing history
   - ✅ Allow customers to cancel subscriptions
4. Click **Save changes**

## Testing Locally

### Option 1: Stripe CLI (Recommended)
```bash
# Install Stripe CLI
# Windows: scoop install stripe
# Mac: brew install stripe/stripe-cli/stripe
# Or download from: https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will give you a webhook secret like: whsec_...
# Use this for STRIPE_WEBHOOK_SECRET in your local .env
```

### Option 2: ngrok
```bash
# Install ngrok: https://ngrok.com/download
ngrok http 3000

# Use the https URL for your webhook endpoint in Stripe Dashboard
# Example: https://abc123.ngrok.io/api/webhooks/stripe
```

## Test Cards

Use these test cards in test mode:

### Successful Payment
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

### Declined Payment
- Card: `4000 0000 0000 0002`
- Use this to test payment failures

### Requires Authentication (3D Secure)
- Card: `4000 0025 0000 3155`
- Use this to test SCA (Strong Customer Authentication)

## Production Checklist

Before going live:

- [ ] Switch to live API keys (`sk_live_...` and `pk_live_...`)
- [ ] Create live products and prices
- [ ] Update webhook endpoint with production URL
- [ ] Enable live mode in Stripe Dashboard
- [ ] Test a real payment with a real card
- [ ] Set up email receipts in Stripe settings
- [ ] Configure tax settings if applicable
- [ ] Set up billing portal for live mode

## Troubleshooting

### Webhook not receiving events
- Check that webhook secret is correct
- Verify webhook URL is accessible
- Check Stripe webhook logs in Dashboard
- Make sure events are selected in webhook settings

### Payment not creating subscription
- Check webhook logs for errors
- Verify database connection
- Check server logs for errors
- Ensure metadata is being passed correctly

### Customer portal not working
- Make sure billing portal is activated
- Verify customer has a Stripe customer ID
- Check that return URL is correct

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Test your integration: https://stripe.com/docs/testing

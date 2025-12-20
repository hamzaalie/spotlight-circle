# 🌍 Complete Environment Setup Guide

This guide will walk you through obtaining all necessary API keys and setting up external services.

---

## 📋 Required Services (Priority Order)

### ✅ 1. Database (PostgreSQL) - REQUIRED

**Recommended: Neon (Free)**

1. Go to https://neon.tech
2. Click "Sign Up" → Use GitHub (fastest)
3. Create New Project
   - Name: `spotlight-circles`
   - Region: Choose closest to you
   - PostgreSQL version: 15 (default)
4. Click "Create Project"
5. **Copy Connection String**
   - Will look like: `postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb`
6. Paste in `.env`:
   ```
   DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb"
   ```

**Alternative: Supabase**
- https://supabase.com
- Create project → Database → Connection String

**Alternative: Railway**
- https://railway.app
- New Project → PostgreSQL → Copy connection string

---

### ✅ 2. Authentication Secret - REQUIRED

**Generate Locally (Free)**

```powershell
# In your terminal, run:
npm run generate:secret

# Copy the output and paste in .env:
AUTH_SECRET="your-generated-secret-here"
```

**Or use online generator:**
- https://generate-secret.vercel.app/32

---

### ⏳ 3. Email Service (Resend) - OPTIONAL (for MVP)

**Can skip initially, add later for production**

1. Go to https://resend.com
2. Sign up (free 3,000 emails/month)
3. Go to "API Keys"
4. Create API Key
   - Name: "Spotlight Circles Dev"
   - Permission: "Sending access"
5. Copy key (starts with `re_`)
6. Add to `.env`:
   ```
   RESEND_API_KEY="re_your_key_here"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

**For Development:**
- Use a personal email domain
- Or use Resend's test domain

**For Production:**
- Verify your domain in Resend
- Update `EMAIL_FROM` to your verified domain

---

### ⏳ 4. Stripe (Payments) - OPTIONAL (Week 5)

**Use Test Mode for Development**

1. Go to https://stripe.com
2. Create account
3. Dashboard → Developers → API Keys
4. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)
5. Add to `.env`:
   ```
   STRIPE_SECRET_KEY="sk_test_your_key_here"
   STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
   ```

**Create Products (Week 5):**
1. Dashboard → Products → Add Product
2. Create:
   - Setup Fee: $99 one-time
   - Monthly Plan: $29/month
   - Annual Plan: $290/year
3. Copy Price IDs (start with `price_`)
4. Add to `.env`:
   ```
   STRIPE_PRICE_MONTHLY="price_xxx"
   STRIPE_PRICE_ANNUAL="price_yyy"
   STRIPE_SETUP_FEE="price_zzz"
   ```

**Webhook Setup (Week 5):**
```powershell
# Install Stripe CLI
# Download from: https://stripe.com/docs/stripe-cli

# Listen for webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Copy webhook signing secret to .env
STRIPE_WEBHOOK_SECRET="whsec_xxx"
```

---

### ⏳ 5. OpenAI (AI Features) - OPTIONAL (Week 4)

**Required for AI Bio Generator & Insights**

1. Go to https://platform.openai.com
2. Sign up / Sign in
3. Go to "API Keys"
4. Create new secret key
   - Name: "Spotlight Circles"
5. Copy key (starts with `sk-`)
6. Add to `.env`:
   ```
   OPENAI_API_KEY="sk-your_key_here"
   ```

**Usage & Costs:**
- Bio generation: ~$0.002 per request (GPT-3.5)
- Forecast/analysis: ~$0.01 per request (GPT-4)
- Free $5 credit for new accounts

**Cost Control:**
- Set usage limits in OpenAI dashboard
- Use GPT-3.5-turbo (cheaper) for MVP

---

### ⏳ 6. Mapbox (Maps) - OPTIONAL (Week 4)

**For Public Directory Map Feature**

1. Go to https://www.mapbox.com
2. Sign up (free 50,000 map loads/month)
3. Go to "Account" → "Access Tokens"
4. Copy default public token (starts with `pk.`)
5. Add to `.env`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN="pk.your_token_here"
   ```

**Note:** Use public token (safe to expose in browser)

**Alternative (Free):**
- OpenStreetMap (no API key needed)
- Google Maps (requires billing setup)

---

## 🔧 Complete .env File Template

```env
# ============================================
# DATABASE (REQUIRED)
# ============================================
DATABASE_URL="postgresql://user:password@host:5432/database"

# ============================================
# AUTHENTICATION (REQUIRED)
# ============================================
# Generate with: npm run generate:secret
AUTH_SECRET="your-32-byte-base64-secret"
NEXTAUTH_URL="http://localhost:3000"

# ============================================
# EMAIL (OPTIONAL - Add later)
# ============================================
RESEND_API_KEY="re_your_key"
EMAIL_FROM="noreply@yourdomain.com"

# ============================================
# PAYMENTS (OPTIONAL - Week 5)
# ============================================
STRIPE_SECRET_KEY="sk_test_your_key"
STRIPE_PUBLISHABLE_KEY="pk_test_your_key"
STRIPE_WEBHOOK_SECRET="whsec_your_secret"
STRIPE_PRICE_MONTHLY="price_monthly_id"
STRIPE_PRICE_ANNUAL="price_annual_id"
STRIPE_SETUP_FEE="price_setup_id"

# ============================================
# AI (OPTIONAL - Week 4)
# ============================================
OPENAI_API_KEY="sk-your_openai_key"

# ============================================
# MAPS (OPTIONAL - Week 4)
# ============================================
NEXT_PUBLIC_MAPBOX_TOKEN="pk.your_mapbox_token"

# ============================================
# DEVELOPMENT SETTINGS
# ============================================
NEXT_PUBLIC_MAX_FILE_SIZE="5242880"
```

---

## 🚀 Minimal Setup (Get Started Now)

**To start developing immediately, you only need:**

1. **Database** (Neon - Free)
   - Takes 2 minutes to set up
   
2. **Auth Secret** (Generated locally)
   - Run `npm run generate:secret`

**Everything else can be added later!**

---

## 📅 When to Add Each Service

### Week 1-2 (Now)
- ✅ Database (Neon)
- ✅ Auth Secret

### Week 2-3 (Onboarding & Partners)
- ⏳ Email (Resend) - for partner invitations

### Week 4 (AI & Directory)
- ⏳ OpenAI - for bio generator
- ⏳ Mapbox - for directory map

### Week 5 (Payments & Launch)
- ⏳ Stripe - for subscriptions
- ⏳ Stripe Webhook - for payment events

---

## 🔒 Security Best Practices

### Never Commit .env
✅ Already in `.gitignore`

### Use Different Keys per Environment
```
Development:  sk_test_xxx
Production:   sk_live_xxx
```

### Rotate Secrets Regularly
- Change AUTH_SECRET every 90 days
- Rotate API keys if compromised

### Limit API Key Permissions
- Stripe: Test mode only in dev
- OpenAI: Set monthly spending limit
- Database: Use read-only user for analytics

---

## 🧪 Testing Your Setup

### 1. Test Database Connection

```powershell
npx prisma db push
# Should succeed with: "Your database is now in sync with your schema."

npx prisma studio
# Should open http://localhost:5555
```

### 2. Test Authentication

```powershell
npm run dev
# Visit http://localhost:3000
# Click "Sign Up"
# Create account
# Should redirect to dashboard
```

### 3. Test Email (Optional)

```typescript
// Create test file: src/app/api/test-email/route.ts
import { NextResponse } from "next/server"
import { sendEmail } from "@/lib/email"

export async function GET() {
  const result = await sendEmail({
    to: "your-email@example.com",
    subject: "Test Email",
    html: "<p>Hello from Spotlight Circles!</p>"
  })
  
  return NextResponse.json({ result })
}
```

Visit: http://localhost:3000/api/test-email

---

## 🌍 Production Environment (Vercel)

### Setup in Vercel Dashboard

1. Go to project → Settings → Environment Variables
2. Add all variables from `.env`
3. Use production values:
   - `DATABASE_URL` → Production database
   - `NEXTAUTH_URL` → Your domain
   - `STRIPE_*` → Live keys (not test)
   - `EMAIL_FROM` → Verified domain

### Environment-Specific Variables

```
Development (.env.local):
DATABASE_URL="postgresql://localhost/dev"

Preview (Vercel):
DATABASE_URL="postgresql://preview-db/test"

Production (Vercel):
DATABASE_URL="postgresql://production-db/prod"
```

---

## 💰 Cost Breakdown (Monthly)

### Free Tier (Development)
- ✅ Neon DB: $0 (3GB free)
- ✅ Vercel: $0 (hobby plan)
- ✅ Resend: $0 (3,000 emails/month)
- ✅ Mapbox: $0 (50,000 loads/month)
- ⚠️ OpenAI: ~$5-10 (usage-based)

**Total: ~$5-10/month for development**

### Production (Estimated)
- Neon DB: $0-20 (scale-to-zero)
- Vercel: $0-20 (Pro if needed)
- Resend: $0-20 (based on emails sent)
- Mapbox: $0 (under free tier)
- OpenAI: $20-50 (based on usage)
- Stripe: 2.9% + 30¢ per transaction

**Total: $40-110/month + transaction fees**

---

## 🆘 Troubleshooting

### Database Connection Failed
```
Error: P1001: Can't reach database server
```
**Solution:**
- Check `DATABASE_URL` format
- Ensure database is running (Neon is always on)
- Check firewall settings
- Try connection string in Prisma Studio

### NextAuth Error
```
Error: Please define an `AUTH_SECRET` environment variable
```
**Solution:**
- Run `npm run generate:secret`
- Copy output to `.env`
- Restart dev server

### Stripe Webhook Not Working
```
Error: No signatures found matching the expected signature
```
**Solution:**
- Use Stripe CLI for local testing
- Ensure `STRIPE_WEBHOOK_SECRET` matches CLI output
- Check webhook URL in Stripe dashboard

### Email Not Sending
```
Error: Invalid API key
```
**Solution:**
- Check `RESEND_API_KEY` is correct
- Verify API key has sending permissions
- Check email from address is valid

---

## 📞 Support Resources

### Service Support
- **Neon**: https://neon.tech/docs
- **Resend**: https://resend.com/docs
- **Stripe**: https://stripe.com/docs
- **OpenAI**: https://platform.openai.com/docs
- **Mapbox**: https://docs.mapbox.com

### Community
- **Next.js Discord**: https://nextjs.org/discord
- **Prisma Discord**: https://pris.ly/discord
- **Stack Overflow**: Tag with `nextjs`, `prisma`, etc.

---

## ✅ Setup Verification Checklist

Before proceeding with development:

- [ ] `.env` file created
- [ ] `DATABASE_URL` added and tested
- [ ] `AUTH_SECRET` generated and added
- [ ] `npx prisma db push` succeeds
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can create account and sign in
- [ ] Dashboard loads after authentication

**Optional (add as needed):**
- [ ] Email service configured
- [ ] Stripe test keys added
- [ ] OpenAI key added
- [ ] Mapbox token added

---

**Once you complete this setup, you're ready to build! 🚀**

Refer to `QUICK_START.md` for next steps.

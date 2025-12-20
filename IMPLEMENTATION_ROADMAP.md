# Spotlight Circles - Detailed Implementation Roadmap

## 🎯 Overview

This document provides step-by-step implementation guidance for the remaining features of the Spotlight Circles platform. Follow this roadmap week by week to meet the 5-week delivery timeline.

---

## 📅 Week 2: Professional Portal Completion

### Task 1: Profile Onboarding Flow

**Files to Create:**
- `src/app/onboarding/page.tsx` - Multi-step form
- `src/app/api/profile/create/route.ts` - API endpoint
- `src/components/onboarding/StepIndicator.tsx`
- `src/components/onboarding/PhotoUpload.tsx`

**Implementation Steps:**

1. **Create Onboarding Page**
```typescript
// Multi-step form with:
// Step 1: Personal info (firstName, lastName, phone)
// Step 2: Photo upload
// Step 3: Professional details (profession, services, company)
// Step 4: Location (city, state, zipCode)
// Step 5: Biography (with AI generator button)
```

2. **Photo Upload Component**
```typescript
// Use Next.js Image component
// Client-side preview
// Convert to base64 or upload to storage
// Store URL in profile.photo
```

3. **AI Bio Generator**
```typescript
// API route: /api/ai/generate-bio
// Input: profession, services, clientBaseSize
// OpenAI prompt: "Write a professional bio for a {profession}..."
// Store in profile.generatedBio
```

4. **Geocoding for ZIP**
```typescript
// Use geocoding API or library
// Convert zipCode to latitude/longitude
// Store in profile.latitude, profile.longitude
```

5. **Generate Referral Slug**
```typescript
// Use generateSlug() from utils.ts
// Format: firstname-lastname-xxxx
// Ensure uniqueness in database
// Store in profile.referralSlug
```

---

### Task 2: Partner Invitation System

**Files to Create:**
- `src/app/dashboard/partners/page.tsx` - Partner list
- `src/app/dashboard/partners/invite/page.tsx` - Invite form
- `src/app/api/partners/invite/route.ts` - Send invitation
- `src/app/api/partners/accept/route.ts` - Accept invitation
- `src/app/api/partners/decline/route.ts` - Decline invitation

**Implementation Steps:**

1. **Partner List Page**
```typescript
// Fetch all partnerships where:
// initiatorId = currentUser OR receiverId = currentUser
// Display partner cards with:
// - Name, photo, profession
// - Status badge (PENDING, ACCEPTED)
// - Action buttons (if pending)
```

2. **Invite Partner Form**
```typescript
// Fields: email, category, notes (optional)
// Validation with Zod
// Check if user already exists
// If exists: create Partnership
// If not: send invitation email with signup link
```

3. **Invitation Email**
```typescript
// Use getPartnerInvitationEmail() from email.ts
// Include signup link with query param: ?invitedBy={userId}
// Track invitation in database
```

4. **Accept/Decline Logic**
```typescript
// Update Partnership.status to ACCEPTED or DECLINED
// If accepted: create reciprocal partnership
// Send confirmation email to both parties
// Update UserAnalytics for both users
```

---

### Task 3: QR Code & Referral Link

**Files to Create:**
- `src/app/dashboard/marketing/page.tsx` - Marketing hub
- `src/app/api/qr/generate/route.ts` - QR code generation
- `src/components/marketing/QRCodeDisplay.tsx`
- `src/components/marketing/SocialShare.tsx`

**Implementation Steps:**

1. **Display Referral Link**
```typescript
// Show: https://spotlightcircles.com/r/{slug}
// Copy to clipboard button
// Click tracking (increment profile.linkClicks)
```

2. **Generate QR Code**
```typescript
// Use qrcode library
// Input: referral URL
// Output: Base64 image
// Download as PNG button
```

3. **Social Sharing**
```typescript
// LinkedIn: Share URL with pre-filled text
// Facebook: Share dialog
// Instagram: Copy text + "Link in bio" message
// Twitter/X: Tweet with link
```

---

## 📅 Week 3: Client Referral Experience

### Task 4: Public Referral Page

**Files to Create:**
- `src/app/r/[slug]/page.tsx` - Public page (SSR)
- `src/app/api/referral/create/route.ts` - Submit referral
- `src/components/referral/PartnerCard.tsx`
- `src/components/referral/ReferralForm.tsx`

**Implementation Steps:**

1. **Server-Side Rendering**
```typescript
// Fetch profile by slug
// Fetch all accepted partners
// Display professional's info (photo, bio, services)
// Display partner grid (photos, professions, locations)
```

2. **Partner Selection**
```typescript
// Checkboxes for multi-select
// At least one partner required
// Display selected count
```

3. **Referral Form**
```typescript
// Fields: clientName, clientEmail, clientPhone, clientNotes
// Validation with Zod
// Submit to API
```

4. **Referral Creation**
```typescript
// For each selected partner:
//   Create Referral record
//   Send email to professional (referral sender)
//   Send email to partner (referral receiver)
//   Send confirmation email to client
```

5. **Track Link Clicks**
```typescript
// Increment profile.linkClicks on page load
// Use middleware or API route
```

---

### Task 5: Referral Management Dashboard

**Files to Create:**
- `src/app/dashboard/referrals/page.tsx` - Referral inbox/outbox
- `src/app/dashboard/referrals/[id]/page.tsx` - Referral detail
- `src/app/api/referral/update-status/route.ts`
- `src/components/referrals/ReferralCard.tsx`
- `src/components/referrals/StatusBadge.tsx`

**Implementation Steps:**

1. **Referral Inbox (Received)**
```typescript
// Fetch referrals where receiverId = currentUser
// Display: client info, sender name, date, status
// Actions: Update status, add notes
```

2. **Referral Outbox (Sent)**
```typescript
// Fetch referrals where senderId = currentUser
// Display: client info, receiver name, date, status
// View-only (sender can't update status)
```

3. **Status Updates**
```typescript
// Dropdown: NEW → CONTACTED → IN_PROGRESS → COMPLETED/LOST
// Update Referral.status
// Send notification email to sender
// Update UserAnalytics.completedReferrals
```

4. **Filters & Search**
```typescript
// Filter by status
// Filter by date range
// Search by client name
```

---

## 📅 Week 4: AI Features & Public Directory

### Task 6: AI Integration

**Files to Create:**
- `src/app/api/ai/generate-bio/route.ts`
- `src/app/api/ai/forecast/route.ts`
- `src/app/api/ai/partner-gaps/route.ts`
- `src/app/api/ai/follow-up/route.ts`
- `src/lib/openai.ts` - OpenAI client wrapper

**Implementation Steps:**

1. **AI Bio Generator**
```typescript
// OpenAI Chat Completion
// Prompt: Professional bio based on inputs
// Return 2-3 paragraph bio
// Save to profile.generatedBio
```

2. **Client Forecasting**
```typescript
// Algorithm:
// baseReferrals = totalPartners * 0.5
// categoryMultiplier = diversityScore
// engagementBonus = acceptanceRate * 10
// predicted = baseReferrals * categoryMultiplier + engagementBonus
// Save to UserAnalytics.predictedMonthlyReferrals
```

3. **Smart Partner Gaps™**
```typescript
// Get all partner professions
// Compare against high-value categories list
// Identify missing categories
// OpenAI suggestion for specific roles
// Save to UserAnalytics.missingCategories
```

4. **Automated Follow-Ups**
```typescript
// Cron job or API endpoint
// Find referrals where:
//   status = NEW or CONTACTED
//   updatedAt > 7 days ago
// Send reminder email to receiver
// Create FollowUp record
```

---

### Task 7: Public Directory

**Files to Create:**
- `src/app/directory/page.tsx` - Directory search
- `src/app/api/directory/search/route.ts`
- `src/components/directory/SearchFilters.tsx`
- `src/components/directory/Map.tsx`
- `src/components/directory/ProfessionalCard.tsx`

**Implementation Steps:**

1. **Search Filters**
```typescript
// Profession dropdown (from all profiles)
// ZIP code input
// Radius slider (5, 10, 25, 50 miles)
// Search button
```

2. **Search Algorithm**
```typescript
// Filter by profession (if selected)
// Calculate distance using calculateDistance()
// Filter by radius
// Return matching profiles
```

3. **Map Integration**
```typescript
// Use react-map-gl + Mapbox
// Display pins for each result
// Click pin → show profile popup
// Center map on search ZIP
```

4. **Profile Cards**
```typescript
// Display: photo, name, profession, city
// "Request Introduction" button → opens modal
// Modal: sends referral request to professional
```

---

### Task 8: Poster Generator

**Files to Create:**
- `src/app/dashboard/marketing/poster/page.tsx`
- `src/app/api/poster/generate/route.ts`
- `src/components/poster/TemplateSelector.tsx`
- `src/components/poster/PosterPreview.tsx`

**Implementation Steps:**

1. **Template System**
```typescript
// Create 3-4 poster templates (React components)
// Variables: name, photo, QR code, tagline
// Customizable colors
```

2. **Poster Preview**
```typescript
// Render selected template with user data
// Show QR code (generated earlier)
// Real-time preview
```

3. **PDF Generation**
```typescript
// Use jsPDF + html2canvas
// Convert preview to canvas
// Export as PDF
// Download file: spotlight-circles-poster.pdf
```

---

## 📅 Week 5: Payments, Admin & Deployment

### Task 9: Stripe Integration

**Files to Create:**
- `src/app/api/stripe/checkout/route.ts` - Create checkout session
- `src/app/api/stripe/portal/route.ts` - Customer portal
- `src/app/api/webhooks/stripe/route.ts` - Webhook handler
- `src/app/payment/success/page.tsx`
- `src/app/payment/cancel/page.tsx`

**Implementation Steps:**

1. **Stripe Products**
```bash
# Create in Stripe Dashboard:
# 1. Setup Fee (one-time, $99)
# 2. Monthly Plan ($29/month)
# 3. Annual Plan ($290/year)
```

2. **Checkout Flow**
```typescript
// User clicks "Subscribe"
// API creates Stripe Checkout Session
// Redirect to Stripe hosted page
// Collect payment
// Redirect to success page
```

3. **Webhook Handler**
```typescript
// Events to handle:
// - checkout.session.completed
// - customer.subscription.updated
// - customer.subscription.deleted
// - invoice.payment_failed
// Update Subscription model
```

4. **Customer Portal**
```typescript
// Stripe-hosted page
// Manage payment methods
// Cancel subscription
// View invoices
```

---

### Task 10: Admin Dashboard

**Files to Create:**
- `src/app/admin/layout.tsx`
- `src/app/admin/page.tsx` - Overview
- `src/app/admin/users/page.tsx` - User management
- `src/app/admin/referrals/page.tsx` - Referral oversight
- `src/app/admin/analytics/page.tsx` - Platform stats
- `src/app/admin/settings/page.tsx` - Email templates

**Implementation Steps:**

1. **Admin Middleware**
```typescript
// Check user.role === ADMIN
// Redirect if not admin
```

2. **Platform Analytics**
```typescript
// Total users (count)
// Active subscriptions
// Total referrals (all time)
// Monthly growth chart
// Revenue metrics (from Stripe)
```

3. **User Management**
```typescript
// List all users
// Approve/suspend accounts
// View user details
// Reset passwords
// Delete accounts
```

4. **Email Template Editor**
```typescript
// CRUD for EmailTemplate model
// Variables: {{firstName}}, {{link}}, etc.
// Preview with sample data
// Send test email
```

---

### Task 11: Analytics Dashboard

**Files to Create:**
- `src/app/dashboard/analytics/page.tsx`
- `src/components/analytics/Chart.tsx` - Recharts wrapper
- `src/components/analytics/Metrics.tsx`

**Implementation Steps:**

1. **Referral Metrics**
```typescript
// Total referrals given/received
// Completion rate
// Average time to close
// Referrals by month (line chart)
```

2. **Partner Metrics**
```typescript
// Partner growth over time
// Top referring partners
// Partner acceptance rate
```

3. **Geographic Distribution**
```typescript
// Partners by state/city
// Heatmap visualization
```

---

## 🚀 Deployment Checklist

### Vercel Deployment

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main

# 2. Connect to Vercel
# - Import project
# - Add environment variables
# - Deploy

# 3. Configure Database
# - Use Neon or Supabase
# - Update DATABASE_URL in Vercel

# 4. Configure Domain
# - Add custom domain in Vercel
# - Update NEXTAUTH_URL

# 5. Test Production
# - Sign up flow
# - Payment flow
# - Email delivery
```

---

## 🔧 Testing Strategy

### Manual Testing Checklist

- [ ] Sign up new account
- [ ] Complete onboarding
- [ ] Invite a partner
- [ ] Accept partnership
- [ ] Generate QR code
- [ ] Visit public referral page
- [ ] Submit referral as client
- [ ] Update referral status
- [ ] View analytics
- [ ] Subscribe to plan
- [ ] Access admin panel (as admin)
- [ ] Search directory
- [ ] Generate poster

### Automated Testing (Optional)

```typescript
// Use Playwright or Cypress
// Test critical flows:
// - Authentication
// - Profile creation
// - Partner invitations
// - Referral submission
```

---

## 📊 Performance Optimization

1. **Image Optimization**
   - Use Next.js Image component
   - Compress uploads
   - Lazy load images

2. **Database Queries**
   - Add indexes (already in schema)
   - Use pagination
   - Implement caching (Redis)

3. **API Routes**
   - Rate limiting
   - Input validation
   - Error handling

4. **SEO**
   - Meta tags for public pages
   - Sitemap generation
   - robots.txt

---

## 🎓 Best Practices

1. **Code Organization**
   - Keep components small and focused
   - Use TypeScript interfaces
   - Extract reusable logic to hooks

2. **Error Handling**
   - Try-catch in API routes
   - User-friendly error messages
   - Log errors to monitoring service

3. **Security**
   - Validate all inputs (Zod)
   - Sanitize user content
   - Rate limit API endpoints
   - Use environment variables

4. **UX/UI**
   - Loading states
   - Empty states
   - Success confirmations
   - Clear error messages

---

## 🆘 Support & Resources

- **Prisma Studio**: `npx prisma studio`
- **Next.js DevTools**: Browser extension
- **Stripe CLI**: Test webhooks locally
- **Postman**: Test API endpoints

---

**This roadmap will guide you through building the complete Spotlight Circles platform. Follow it step-by-step, and you'll have a production-ready SaaS application in 5 weeks!**

Good luck! 🚀

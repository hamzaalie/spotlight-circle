# 🚀 Waitlist System Setup - Complete Guide

## ✅ What I've Built for You

### 1. **Database Model** (`prisma/schema.prisma`)
- New `Waitlist` table to store email signups
- Tracks email, source, IP, user agent, and conversion status
- Indexed for fast queries

### 2. **API Endpoint** (`src/app/api/waitlist/route.ts`)
- `POST /api/waitlist` - Saves email to database
- `GET /api/waitlist` - Retrieves all signups (admin only)
- Prevents duplicate emails
- Returns proper success/error messages

### 3. **Admin Dashboard** (`src/app/admin/waitlist/page.tsx`)
- View all waitlist signups
- Stats: Total, This Week, Today
- Export to CSV button
- Shows signup dates and conversion status

### 4. **Landing Page Integration** (`landing-page/index.html`)
- Form now POSTs to your API
- Shows loading state while submitting
- Displays success confirmation
- Handles errors gracefully

---

## 📋 SETUP STEPS (DO THESE IN ORDER)

### **STEP 1: Run Database Migration**

When your database is online, run this command:

```bash
npx prisma migrate dev --name add_waitlist
```

This creates the `waitlist` table in your database.

**To verify it worked:**
```bash
npx prisma studio
```
You should see a new "waitlist" table.

---

### **STEP 2: Test Locally First**

1. **Start your Next.js development server:**
   ```bash
   npm run dev
   ```

2. **Open the landing page:**
   - Open `landing-page/index.html` in your browser
   - The API_URL is already set to `http://localhost:3000/api/waitlist`

3. **Test the form:**
   - Enter an email
   - Click "Request Early Access"
   - Should see "You're on the list!" message

4. **Check the admin dashboard:**
   - Go to: `http://localhost:3000/admin/waitlist`
   - You should see the test email

---

### **STEP 3: Deploy Main App**

Deploy your Next.js app to your hosting provider (Vercel, Railway, etc.):

```bash
# Example for Vercel
npm install -g vercel
vercel --prod
```

After deployment, note your production URL:
- Example: `https://your-app.vercel.app`

**Run production migration:**
```bash
npx prisma migrate deploy
```

---

### **STEP 4: Update Landing Page API URL**

1. Open `landing-page/index.html`

2. Find line ~212:
   ```javascript
   const API_URL = 'http://localhost:3000/api/waitlist';
   ```

3. Change to your production URL:
   ```javascript
   const API_URL = 'https://your-app.vercel.app/api/waitlist';
   ```

4. Save the file

---

### **STEP 5: Upload Landing Page to Hostinger**

1. **Log into Hostinger cPanel**

2. **Go to File Manager**

3. **Navigate to `public_html`**

4. **Upload these files from `landing-page/` folder:**
   - ✅ `index.html` (with updated API_URL)
   - ✅ `images/logo.png`
   - ✅ `.htaccess`
   - ✅ `404.html`

5. **Set permissions:**
   - Files: 644
   - Directories: 755

6. **Enable SSL in Hostinger:**
   - Go to SSL section
   - Enable SSL certificate
   - Force HTTPS

---

### **STEP 6: Test Production**

1. Visit your Hostinger domain (e.g., `https://yourdomain.com`)
2. Submit a test email
3. Check admin dashboard: `https://your-app.vercel.app/admin/waitlist`
4. Verify email appears

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ Visits
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            LANDING PAGE (Hostinger)                         │
│         https://yourdomain.com                              │
│                                                             │
│  - Static HTML/CSS/JS                                       │
│  - Form collects email                                      │
│  - Submits via fetch() to API                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ POST /api/waitlist
                     │ { email: "user@example.com" }
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         MAIN APP (Vercel/Railway/etc.)                      │
│      https://your-app.vercel.app                            │
│                                                             │
│  ┌─────────────────────────────────────────────┐            │
│  │  API Route: /api/waitlist                   │            │
│  │  - Validates email                          │            │
│  │  - Checks for duplicates                    │            │
│  │  - Saves to database                        │            │
│  └──────────────────┬──────────────────────────┘            │
│                     │                                        │
│                     ▼                                        │
│  ┌─────────────────────────────────────────────┐            │
│  │  PostgreSQL Database (Neon)                 │            │
│  │  Table: waitlist                            │            │
│  │  - id, email, source, createdAt, etc.       │            │
│  └─────────────────────────────────────────────┘            │
│                                                             │
│  ┌─────────────────────────────────────────────┐            │
│  │  Admin Dashboard: /admin/waitlist           │            │
│  │  - View all signups                         │            │
│  │  - Export CSV                               │            │
│  │  - See stats                                │            │
│  └─────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Viewing Your Waitlist

### **Option 1: Admin Dashboard**
Visit: `https://your-app.vercel.app/admin/waitlist`

Features:
- See total signups, weekly count, daily count
- Full table of all emails with dates
- Export to CSV button

### **Option 2: Prisma Studio**
```bash
npx prisma studio
```
Opens a database GUI at `http://localhost:5555`

### **Option 3: Direct API Call**
```bash
curl https://your-app.vercel.app/api/waitlist
```

---

## 🔧 Configuration Reference

### Landing Page API URL Locations
File: `landing-page/index.html`
Line: ~212

```javascript
// For local testing:
const API_URL = 'http://localhost:3000/api/waitlist';

// For production:
const API_URL = 'https://your-app.vercel.app/api/waitlist';
```

### Database Schema
File: `prisma/schema.prisma`
Lines: 474-493

```prisma
model Waitlist {
  id           String   @id @default(cuid())
  email        String   @unique
  source       String?  @default("landing-page")
  ipAddress    String?
  userAgent    String?
  referrer     String?
  convertedAt  DateTime?
  userId       String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 🚨 Troubleshooting

### **Form submission fails with "Network error"**
- ✅ Check API_URL in index.html is correct
- ✅ Verify main app is running and accessible
- ✅ Check browser console for CORS errors

### **"Can't reach database server" error**
- ✅ Check your `.env` file has correct `DATABASE_URL`
- ✅ Verify database is online (check Neon dashboard)
- ✅ Try: `npx prisma db push` instead of migrate

### **Emails not appearing in dashboard**
- ✅ Check API route is working: `curl -X POST https://your-app.com/api/waitlist -d '{"email":"test@test.com"}' -H "Content-Type: application/json"`
- ✅ Look at server logs for errors
- ✅ Verify database migration ran: `npx prisma studio`

### **CORS errors in browser**
Add CORS headers to `src/app/api/waitlist/route.ts`:

```typescript
const headers = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

return NextResponse.json({ success: true }, { headers })
```

---

## ✅ Success Checklist

- [ ] Database migration completed (`npx prisma migrate dev`)
- [ ] Tested form locally (works with localhost:3000)
- [ ] Main app deployed to production
- [ ] API_URL updated in landing page index.html
- [ ] Landing page uploaded to Hostinger
- [ ] SSL enabled on Hostinger
- [ ] Test email submitted from production landing page
- [ ] Email appears in admin dashboard
- [ ] Export CSV button works

---

## 📧 Next Steps (Optional Enhancements)

1. **Email Notifications**: Send yourself an email when someone signs up
2. **Auto-Reply**: Send confirmation email to the user
3. **Mailchimp Integration**: Sync waitlist to Mailchimp
4. **Analytics**: Track conversion rate from waitlist to signup
5. **Bulk Invite**: Send invite emails to entire waitlist

Let me know if you want any of these features!

---

## 🆘 Need Help?

If you encounter issues:
1. Check browser console for errors
2. Check server logs for API errors
3. Verify database connection
4. Test API endpoint directly with curl
5. Check Hostinger file permissions

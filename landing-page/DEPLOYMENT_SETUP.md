# Landing Page Configuration for Hostinger Deployment

This folder contains a standalone landing page that can be uploaded to Hostinger separately from the main Next.js application.

## 📋 Setup Instructions

### 1. **Update API URL**

Before uploading to Hostinger, you need to update the API endpoint URL in `index.html`:

1. Open `index.html`
2. Find line ~212 where it says:
   ```javascript
   const API_URL = 'http://localhost:3000/api/waitlist';
   ```
3. Change it to your production API URL:
   ```javascript
   const API_URL = 'https://your-main-app-domain.com/api/waitlist';
   ```

### 2. **Database Setup** (Do this FIRST before deploying landing page)

Run these commands in your main Next.js app directory:

```bash
# Generate Prisma migration for the new Waitlist table
npx prisma migrate dev --name add_waitlist

# Push to production database (when ready)
npx prisma migrate deploy
```

### 3. **Deploy Main App First**

Your main Next.js app needs to be deployed and running because the landing page sends data to its API endpoint:

1. Deploy your Next.js app to Vercel/Railway/etc.
2. Make sure the `/api/waitlist` endpoint is working
3. Test it: `curl -X POST https://your-app.com/api/waitlist -H "Content-Type: application/json" -d '{"email":"test@example.com"}'`

### 4. **Upload to Hostinger**

Once the main app is deployed:

1. Log into your Hostinger cPanel
2. Go to File Manager
3. Navigate to `public_html` folder
4. Upload all files from this `landing-page` folder:
   - `index.html`
   - `images/logo.png`
   - `.htaccess`
   - `404.html`
   - `README.md`

### 5. **Enable SSL**

In Hostinger:
1. Go to SSL section
2. Enable SSL certificate for your domain
3. Force HTTPS redirect (already configured in .htaccess)

### 6. **Test the Form**

1. Visit your landing page URL
2. Submit an email
3. Check your admin panel: `https://your-main-app.com/admin/waitlist`
4. Verify the email appears in the database

## 🔧 Architecture

```
Landing Page (Hostinger)          Main App (Vercel/Railway/etc.)
┌─────────────────────┐          ┌──────────────────────────┐
│                     │          │                          │
│  HTML/CSS/JS        │  POST    │  Next.js API Route       │
│  Form Submission ───┼─────────>│  /api/waitlist           │
│                     │          │         │                │
└─────────────────────┘          │         ▼                │
                                 │  PostgreSQL Database     │
                                 │  (Waitlist Table)        │
                                 │                          │
                                 │  Admin Dashboard         │
                                 │  /admin/waitlist         │
                                 └──────────────────────────┘
```

## 🔐 CORS Configuration

If you encounter CORS errors, add this to your Next.js API route:

```typescript
// In src/app/api/waitlist/route.ts
export async function POST(req: NextRequest) {
  // Add CORS headers
  const origin = req.headers.get('origin')
  const allowedOrigins = [
    'https://your-landing-page-domain.com',
    'http://localhost:3000', // for testing
  ]

  const headers = new Headers()
  if (origin && allowedOrigins.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type')
  }

  // ... rest of your code
}
```

## 📊 Viewing Signups

After deployment, view all waitlist signups at:
- **Admin Dashboard**: `https://your-main-app.com/admin/waitlist`
- **Export CSV**: Click "Export CSV" button in admin panel
- **API Endpoint**: `GET https://your-main-app.com/api/waitlist` (admin only)

## 🚨 Important Notes

1. **Database must be running** before anyone submits the form
2. **HTTPS is required** for form submissions to work properly
3. **Update API_URL** in index.html before uploading to Hostinger
4. **Test locally first**: Run your Next.js app locally and set `API_URL` to `http://localhost:3000/api/waitlist`

## 📝 Files Included

- `index.html` - Main landing page
- `images/logo.png` - Your Spotlight Circles logo
- `.htaccess` - Apache server configuration
- `404.html` - Custom error page
- `README.md` - This file
- `DEPLOYMENT_CHECKLIST.md` - Deployment steps

## 🆘 Troubleshooting

**Form submission fails:**
- Check browser console for errors
- Verify API_URL is correct in index.html
- Test API endpoint directly with curl
- Check CORS headers if cross-domain

**Emails not appearing in database:**
- Verify database migration ran successfully
- Check API route logs for errors
- Test with: `npx prisma studio` and check `waitlist` table

**404 errors:**
- Ensure .htaccess is uploaded
- Check Apache mod_rewrite is enabled
- Verify file permissions (644 for files, 755 for directories)

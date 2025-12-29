# ⚡ Quick Setup Checklist

## Before Uploading to Hostinger

### 1️⃣ Setup Database (One Time Only)
```bash
# In your main app directory
npx prisma migrate dev --name add_waitlist
```

### 2️⃣ Deploy Main App First
```bash
# Deploy to Vercel/Railway/etc
vercel --prod

# Note your production URL
# Example: https://spotlight-circles.vercel.app
```

### 3️⃣ Update Landing Page
Open `landing-page/index.html` and change line ~212:

**FROM:**
```javascript
const API_URL = 'http://localhost:3000/api/waitlist';
```

**TO:**
```javascript
const API_URL = 'https://YOUR-APP-URL.vercel.app/api/waitlist';
```

### 4️⃣ Upload to Hostinger
Upload these files to `public_html/`:
- ✅ index.html (with updated API_URL!)
- ✅ images/logo.png
- ✅ .htaccess
- ✅ 404.html

### 5️⃣ Enable SSL
In Hostinger cPanel → SSL → Enable

### 6️⃣ Test!
1. Visit your domain
2. Submit test email
3. Check: `https://YOUR-APP-URL.vercel.app/admin/waitlist`

---

## 📍 Important URLs

### Your Landing Page (Hostinger)
`https://yourdomain.com`

### Admin Dashboard
`https://YOUR-APP-URL.vercel.app/admin/waitlist`

### API Endpoint
`https://YOUR-APP-URL.vercel.app/api/waitlist`

---

## ⚠️ Don't Forget!

- [ ] Update API_URL in index.html before uploading
- [ ] Deploy main app BEFORE uploading landing page
- [ ] Run database migration BEFORE testing
- [ ] Enable SSL on Hostinger

---

## 🎯 How It Works

```
Landing Page (Hostinger) → API (Your App) → Database → Admin Dashboard
     HTML Form          →   POST Request  → PostgreSQL →   View Emails
```

The landing page is **just HTML/CSS/JS** that sends data to your main app's API.

This means:
- ✅ Landing page can be on Hostinger
- ✅ Main app can be on Vercel/Railway/anywhere
- ✅ They work together seamlessly
- ✅ All emails saved to your database
- ✅ View them anytime in admin dashboard

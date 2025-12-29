# 🎯 Spotlight Circles - Landing Page

A beautiful, professional landing page for Spotlight Circles - a private referral network for trusted professionals.

## ✨ Features

- **Responsive Design**: Perfect on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradients, smooth animations, and professional styling
- **Email Collection**: Early access signup form with validation
- **SEO Optimized**: Meta tags, semantic HTML, and fast loading
- **Production Ready**: Optimized for Hostinger deployment

## 📁 Project Structure

```
landing-page/
├── index.html          # Main HTML file
├── .htaccess          # Apache configuration for Hostinger
├── css/
│   └── style.css      # All styling
├── js/
│   └── script.js      # JavaScript functionality
└── images/            # Image assets (optional)
```

## 🚀 Deployment to Hostinger

### Step 1: Prepare Your Files

1. All files are ready in the `landing-page` folder
2. The landing page uses external images from Unsplash (no local images needed)
3. Everything is optimized and production-ready

### Step 2: Upload to Hostinger

**Option A: Using File Manager**

1. Log in to your Hostinger control panel (hPanel)
2. Navigate to **Files → File Manager**
3. Go to `public_html` directory (or your domain's root folder)
4. Upload all files from the `landing-page` folder:
   - `index.html`
   - `.htaccess`
   - `css/` folder with `style.css`
   - `js/` folder with `script.js`
   - `images/` folder (for future custom images)

**Option B: Using FTP (FileZilla)**

1. Download FileZilla (free FTP client)
2. Get FTP credentials from Hostinger:
   - Host: Your domain or Hostinger FTP host
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Connect and upload all files to `public_html`

### Step 3: Configure Your Domain

1. In Hostinger hPanel, go to **Domains**
2. Make sure your domain points to the `public_html` folder
3. If using a subdomain (e.g., landing.yourdomain.com):
   - Create subdomain in Hostinger
   - Point it to a subfolder
   - Upload files there instead

### Step 4: Test Your Landing Page

1. Visit your domain (e.g., https://yourdomain.com)
2. Test the email signup form
3. Check on mobile devices
4. Verify all images load correctly

## 🔧 Customization

### Update Content

Edit [index.html](index.html) to change:
- Page title and meta description (lines 8-10)
- Hero text and features
- Email form text
- Footer links

### Change Colors/Branding

Edit [css/style.css](css/style.css) CSS variables (lines 6-18):
```css
:root {
    --primary: #6366f1;        /* Main brand color */
    --secondary: #8b5cf6;      /* Accent color */
    /* ... other variables */
}
```

### Replace Images

Currently using Unsplash images. To use your own:
1. Add images to the `images/` folder
2. Update image URLs in [index.html](index.html)
3. Optimize images before uploading (use TinyPNG.com)

## 📧 Email Integration

The form currently saves to localStorage for static deployment. To connect to a backend:

### Option 1: Connect to Your Main App API

Update [js/script.js](js/script.js) line 37:
```javascript
const response = await fetch('https://yourdomain.com/api/early-access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
});
```

### Option 2: Use Form Services

**Formspree** (Easiest):
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <input type="email" name="email" required>
    <button type="submit">Submit</button>
</form>
```

**Netlify Forms** (If hosting on Netlify):
```html
<form name="signup" method="POST" data-netlify="true">
```

**Google Sheets** (Via Google Apps Script):
- Create a Google Apps Script to receive form data
- Update fetch URL in JavaScript

## 🎨 Design System

### Colors
- Primary: Indigo (#6366f1)
- Secondary: Purple (#8b5cf6)
- Background: Slate (#f8fafc)
- Text: Dark slate (#1e293b)

### Typography
- Font: Inter (Google Fonts)
- Headings: 700 weight
- Body: 400 weight

### Spacing
- Container: 1280px max-width
- Padding: 24px mobile, 80px+ desktop
- Grid gap: 80px desktop, 60px tablet, 40px mobile

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

Included in `.htaccess`:
- HTTPS redirect
- Security headers
- XSS protection
- Directory listing prevention
- File protection

## 🚀 Performance

- Optimized CSS (single file)
- Minimal JavaScript
- External images with CDN
- Gzip compression enabled
- Browser caching configured

## 📊 Analytics (Optional)

To add Google Analytics, insert before `</head>` in [index.html](index.html):
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🆘 Troubleshooting

### Images Not Loading
- Check image URLs are correct
- Verify HTTPS is enabled
- Check browser console for errors

### Form Not Working
- Check JavaScript console for errors
- Verify email validation
- Test on different browsers

### CSS Not Applying
- Clear browser cache
- Check file paths are correct
- Verify .htaccess is uploaded

### 404 Errors
- Ensure index.html is in root folder
- Check .htaccess configuration
- Verify domain settings in Hostinger

## 📞 Support

For issues specific to:
- **Hostinger**: Contact Hostinger support
- **Code**: Check browser console for errors
- **Design**: Modify CSS variables in style.css

## 📝 License

© 2025 Spotlight Circles. All rights reserved.

---

**Need help?** Check the Hostinger knowledge base or contact support.

**Ready to deploy?** Follow the deployment steps above! 🚀

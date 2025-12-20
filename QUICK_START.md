# Quick Start Guide - Get Running in 5 Minutes! ⚡

## Step 1: Environment Setup (2 minutes)

### Create `.env` file

```powershell
# Copy the example file
Copy-Item .env.example .env
```

### Edit `.env` with minimum required values:

```env
# For local development, use a simple PostgreSQL connection
DATABASE_URL="postgresql://postgres:password@localhost:5432/spotlight_circles"

# Generate a random secret (run this command in terminal)
# node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
AUTH_SECRET="YOUR_GENERATED_SECRET_HERE"

NEXTAUTH_URL="http://localhost:3000"

# Optional for now (can add later):
# STRIPE_SECRET_KEY=""
# OPENAI_API_KEY=""
# RESEND_API_KEY=""
# NEXT_PUBLIC_MAPBOX_TOKEN=""
```

---

## Step 2: Database Setup (1 minute)

### Option A: Local PostgreSQL

```powershell
# If you have PostgreSQL installed locally
# Make sure it's running, then:
npx prisma db push
```

### Option B: Free Cloud Database (Recommended)

**Use Neon (Free, No Credit Card)**

1. Go to https://neon.tech
2. Sign up (GitHub auth is fastest)
3. Create a new project called "spotlight-circles"
4. Copy the connection string
5. Paste it in `.env` as `DATABASE_URL`
6. Run:

```powershell
npx prisma db push
```

---

## Step 3: Generate Auth Secret (30 seconds)

```powershell
# Run this command to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Copy the output and paste it in .env as AUTH_SECRET
```

---

## Step 4: Start Development Server (30 seconds)

```powershell
npm run dev
```

**You should see:**
```
▲ Next.js 14.x.x
- Local:   http://localhost:3000
✓ Ready in 2.5s
```

---

## Step 5: Test the Application (1 minute)

1. **Visit Homepage**
   - Open http://localhost:3000
   - You should see the landing page

2. **Sign Up**
   - Click "Get Started Free"
   - Enter email and password
   - Submit form

3. **Sign In**
   - Use the credentials you just created
   - You should be redirected to dashboard

4. **View Dashboard**
   - You'll see empty stats (normal for new account)
   - Navigation should work

---

## 🎉 You're Running!

The foundation is working. Now you can start building features!

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'prisma'"

```powershell
npm install --legacy-peer-deps
npx prisma generate
```

### Issue: "Database connection failed"

- Check that PostgreSQL is running
- Verify DATABASE_URL in `.env`
- Try using Neon cloud database instead

### Issue: "NextAuth configuration error"

- Ensure AUTH_SECRET is set in `.env`
- Ensure NEXTAUTH_URL is "http://localhost:3000"

### Issue: "Port 3000 already in use"

```powershell
# Use a different port
$env:PORT=3001; npm run dev
```

---

## 🚀 Next Steps

Once you're running, here's what to build next:

### Immediate (This Week)
1. **Onboarding Flow** - Create profile setup page
2. **Partner System** - Invite and accept partners
3. **Referral Page** - Public page for clients

### This Month
4. **Payments** - Stripe integration
5. **AI Features** - OpenAI integration
6. **Directory** - Searchable map

---

## 📋 Optional Services Setup

### For Full Functionality, Add These:

#### **Resend (Email)**
1. Go to https://resend.com
2. Sign up (free 3,000 emails/month)
3. Get API key
4. Add to `.env`: `RESEND_API_KEY="re_..."`

#### **Stripe (Payments)**
1. Go to https://stripe.com
2. Create account
3. Get test keys from Dashboard
4. Add to `.env`:
   ```
   STRIPE_SECRET_KEY="sk_test_..."
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```

#### **OpenAI (AI Features)**
1. Go to https://platform.openai.com
2. Create API key
3. Add to `.env`: `OPENAI_API_KEY="sk-..."`

#### **Mapbox (Maps)**
1. Go to https://www.mapbox.com
2. Create account
3. Get access token
4. Add to `.env`: `NEXT_PUBLIC_MAPBOX_TOKEN="pk..."`

---

## 🛠️ Useful Commands

```powershell
# Start dev server
npm run dev

# View database in browser
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma db push --force-reset

# Check for TypeScript errors
npm run build

# Format code
npm run lint
```

---

## 📚 What Files to Edit First

To start building features, focus on:

1. **`src/app/onboarding/page.tsx`** (create new file)
   - Build multi-step profile setup

2. **`src/app/dashboard/partners/page.tsx`** (create new file)
   - Display partner list

3. **`src/app/r/[slug]/page.tsx`** (create new file)
   - Public referral page

Refer to `IMPLEMENTATION_ROADMAP.md` for detailed guidance on each feature.

---

## ✅ Verification Checklist

Before moving forward, verify:

- [ ] Development server runs without errors
- [ ] Can access http://localhost:3000
- [ ] Can sign up a new account
- [ ] Can sign in with credentials
- [ ] Dashboard loads after login
- [ ] Can sign out
- [ ] Prisma Studio shows `users` table with your account

---

## 💡 Pro Tips

1. **Keep Prisma Studio open** while developing
   - Run `npx prisma studio` in a separate terminal
   - View database changes in real-time

2. **Use TypeScript hints**
   - Hover over Prisma queries to see types
   - Let IntelliSense guide you

3. **Check the schema**
   - Review `prisma/schema.prisma` to understand relationships
   - All database operations should reference this file

4. **Follow the roadmap**
   - Don't try to build everything at once
   - Complete one feature before starting another

---

**You're all set! Start building! 🎨**

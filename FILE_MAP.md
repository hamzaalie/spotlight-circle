# 📁 Complete Project File Map

```
d:\React Projects\Spotligh Circle\
│
├── 📚 DOCUMENTATION (Read These First!)
│   ├── README.md                        # Project overview & installation
│   ├── QUICK_START.md                   # ⚡ Get running in 5 minutes
│   ├── SETUP_COMPLETE.md                # What's been built (Week 1 status)
│   ├── PROJECT_SUMMARY.md               # Executive summary & achievements
│   ├── IMPLEMENTATION_ROADMAP.md        # Week-by-week feature guide
│   └── DEVELOPER_TIPS.md                # Code snippets & troubleshooting
│
├── ⚙️ CONFIGURATION
│   ├── .env.example                     # Environment variables template
│   ├── .gitignore                       # Git exclusions
│   ├── .eslintrc.json                   # Linting rules
│   ├── next.config.js                   # Next.js settings
│   ├── tailwind.config.ts               # Design system config
│   ├── tsconfig.json                    # TypeScript config
│   ├── postcss.config.js                # CSS processing
│   ├── package.json                     # Dependencies & scripts
│   └── package-lock.json                # Locked dependency versions
│
├── 🗄️ DATABASE
│   └── prisma/
│       └── schema.prisma                # ⭐ Complete database schema
│           ├── User (authentication)
│           ├── Profile (professional details)
│           ├── Partnership (connections)
│           ├── Referral (client tracking)
│           ├── FollowUp (automation)
│           ├── Subscription (Stripe)
│           ├── UserAnalytics (AI insights)
│           ├── EmailTemplate (customizable)
│           └── PlatformSettings (admin)
│
├── 💻 SOURCE CODE
│   └── src/
│       │
│       ├── 🌐 APPLICATION (Next.js App Router)
│       │   └── app/
│       │       │
│       │       ├── 🔐 AUTHENTICATION
│       │       │   ├── api/
│       │       │   │   └── auth/
│       │       │   │       ├── [...nextauth]/
│       │       │   │       │   └── route.ts           # NextAuth handler
│       │       │   │       └── signup/
│       │       │   │           └── route.ts           # User registration
│       │       │   └── auth/
│       │       │       ├── signin/
│       │       │       │   └── page.tsx               # Sign in form
│       │       │       └── signup/
│       │       │           └── page.tsx               # Sign up form
│       │       │
│       │       ├── 📊 DASHBOARD (Professional Portal)
│       │       │   └── dashboard/
│       │       │       ├── layout.tsx                 # Dashboard wrapper
│       │       │       └── page.tsx                   # Main dashboard
│       │       │
│       │       ├── 🎨 GLOBAL
│       │       │   ├── layout.tsx                     # Root layout
│       │       │   ├── page.tsx                       # Landing page
│       │       │   └── globals.css                    # Global styles
│       │       │
│       │       └── 🚧 TO BE BUILT (Weeks 2-5)
│       │           ├── onboarding/                    # Profile setup
│       │           ├── dashboard/
│       │           │   ├── partners/                  # Partner management
│       │           │   ├── referrals/                 # Referral tracking
│       │           │   ├── analytics/                 # Stats & charts
│       │           │   ├── marketing/                 # QR & posters
│       │           │   └── settings/                  # User settings
│       │           ├── r/
│       │           │   └── [slug]/                    # Public referral page
│       │           ├── directory/                     # Searchable directory
│       │           └── admin/                         # Admin panel
│       │
│       ├── 🧩 COMPONENTS
│       │   └── components/
│       │       │
│       │       ├── dashboard/
│       │       │   └── DashboardNav.tsx               # Navigation bar
│       │       │
│       │       └── ui/ (shadcn/ui components)
│       │           ├── button.tsx                     # Button variants
│       │           ├── input.tsx                      # Text input
│       │           ├── label.tsx                      # Form label
│       │           ├── textarea.tsx                   # Multi-line input
│       │           ├── card.tsx                       # Card container
│       │           ├── avatar.tsx                     # User avatar
│       │           └── dropdown-menu.tsx              # Dropdown menus
│       │
│       ├── 🛠️ UTILITIES
│       │   └── lib/
│       │       ├── auth.ts                            # Password hashing
│       │       ├── email.ts                           # Email templates
│       │       ├── prisma.ts                          # Database client
│       │       ├── utils.ts                           # Helper functions
│       │       └── validations.ts                     # Zod schemas
│       │
│       ├── 📝 TYPE DEFINITIONS
│       │   └── types/
│       │       └── next-auth.d.ts                     # Auth types
│       │
│       ├── 🔒 AUTHENTICATION CONFIG
│       │   └── auth.ts                                # NextAuth setup
│       │
│       └── 🛡️ MIDDLEWARE
│           └── middleware.ts                          # Route protection
│
└── 📦 DEPENDENCIES
    └── node_modules/                                  # Installed packages
        ├── next (14.2.0)
        ├── react (18.3.0)
        ├── @prisma/client (5.18.0)
        ├── next-auth (5.0.0-beta.20)
        ├── stripe (16.8.0)
        ├── openai (4.56.0)
        ├── tailwindcss (3.4.0)
        └── ... (640+ packages)
```

---

## 🎯 Key Files to Know

### Must Read Before Coding
1. **`prisma/schema.prisma`** - Understand your data structure
2. **`src/lib/validations.ts`** - Input validation schemas
3. **`src/auth.ts`** - Authentication configuration
4. **`IMPLEMENTATION_ROADMAP.md`** - Feature implementation guide

### Edit Most Often
1. **`src/app/*/page.tsx`** - Page components
2. **`src/app/api/*/route.ts`** - API endpoints
3. **`src/components/**/*.tsx`** - UI components
4. **`.env`** - Environment variables (after copying from .env.example)

### Reference When Needed
1. **`src/lib/utils.ts`** - Helper functions
2. **`src/lib/email.ts`** - Email templates
3. **`tailwind.config.ts`** - Design tokens

---

## 📋 File Creation Checklist (What's Next)

### Week 2 - To Create:
- [ ] `src/app/onboarding/page.tsx`
- [ ] `src/app/api/profile/create/route.ts`
- [ ] `src/app/dashboard/partners/page.tsx`
- [ ] `src/app/api/partners/invite/route.ts`
- [ ] `src/app/dashboard/marketing/page.tsx`
- [ ] `src/app/api/qr/generate/route.ts`

### Week 3 - To Create:
- [ ] `src/app/r/[slug]/page.tsx`
- [ ] `src/app/api/referral/create/route.ts`
- [ ] `src/app/dashboard/referrals/page.tsx`
- [ ] `src/app/api/referral/update-status/route.ts`

### Week 4 - To Create:
- [ ] `src/app/api/ai/generate-bio/route.ts`
- [ ] `src/app/api/ai/forecast/route.ts`
- [ ] `src/app/directory/page.tsx`
- [ ] `src/app/dashboard/marketing/poster/page.tsx`

### Week 5 - To Create:
- [ ] `src/app/api/stripe/checkout/route.ts`
- [ ] `src/app/api/webhooks/stripe/route.ts`
- [ ] `src/app/admin/page.tsx`
- [ ] `src/app/dashboard/analytics/page.tsx`

---

## 🗂️ Naming Conventions

### Files
- **Pages**: `page.tsx` (Next.js convention)
- **Layouts**: `layout.tsx`
- **API Routes**: `route.ts`
- **Components**: `ComponentName.tsx` (PascalCase)
- **Utils**: `utilName.ts` (camelCase)

### Folders
- **Dynamic routes**: `[param]/`
- **Feature folders**: lowercase with hyphens
- **Component folders**: lowercase

### Code
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`
- **Files**: kebab-case or PascalCase

---

## 🔍 Quick Find

### "Where is...?"

**Authentication logic?**  
→ `src/auth.ts` + `src/app/api/auth/`

**Database queries?**  
→ Any file using `import { prisma } from "@/lib/prisma"`

**UI components?**  
→ `src/components/ui/`

**Custom components?**  
→ `src/components/` (create subfolders as needed)

**API endpoints?**  
→ `src/app/api/*/route.ts`

**Form validation?**  
→ `src/lib/validations.ts`

**Utility functions?**  
→ `src/lib/utils.ts`

**Email templates?**  
→ `src/lib/email.ts`

**Type definitions?**  
→ `src/types/` or inline in files

**Styles?**  
→ `src/app/globals.css` + Tailwind classes

**Environment variables?**  
→ `.env` (create from `.env.example`)

---

## 📈 File Growth Projection

### Current Status (Week 1)
- Total files: ~35
- Lines of code: ~2,500

### Projected (Week 5)
- Total files: ~120
- Lines of code: ~12,000

### Breakdown by Feature:
- Authentication: 10% ✅
- Dashboard: 15%
- Partner System: 20%
- Referral System: 20%
- AI Features: 10%
- Directory: 10%
- Admin: 10%
- Payments: 5%

---

## 🎨 Component Library Status

### ✅ Built (Ready to Use)
- Button
- Input
- Label
- Textarea
- Card (+ Header, Content, Footer)
- Avatar (+ Image, Fallback)
- Dropdown Menu

### 🚧 To Build (As Needed)
- Select dropdown
- Checkbox
- Radio buttons
- Toggle switch
- Modal/Dialog
- Toast notifications
- Tabs
- Badge
- Progress bar
- Data table

Refer to [shadcn/ui](https://ui.shadcn.com) for copy-paste components.

---

## 🚀 Performance Notes

### Current Bundle Size
- Development: ~10MB (with source maps)
- Production: ~300KB (estimated after build)

### Optimization Strategies
- ✅ Next.js Image optimization
- ✅ Automatic code splitting
- ✅ Server components by default
- ⏳ Database query optimization (as needed)
- ⏳ Caching strategies (future)

---

**This map will help you navigate the entire codebase. Bookmark this file!** 🗺️

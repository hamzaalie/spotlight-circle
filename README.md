# Spotlight Circles - Professional Referral Network

A complete SaaS platform for building and managing professional referral networks.

## Features

- 🔐 Secure authentication with NextAuth.js
- 👥 Partner management & reciprocal linking
- 📊 AI-powered analytics and forecasting
- 🗺️ Searchable public directory with map integration
- 💳 Stripe payment integration
- 📱 QR code & poster generator
- 📧 Automated email notifications
- 🎯 Smart Partner Gaps™ suggestions
- 📈 Comprehensive admin dashboard

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5
- **Payments**: Stripe
- **AI**: OpenAI API
- **Styling**: Tailwind CSS + shadcn/ui
- **Email**: Nodemailer
- **Maps**: Mapbox GL

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account
- OpenAI API key
- Mapbox API token

### Installation

1. **Install dependencies**
   ```powershell
   npm install
   ```

2. **Set up environment variables**
   ```powershell
   cp .env.example .env
   ```
   
   Then edit `.env` with your actual credentials:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - Stripe keys (test mode for development)
   - OpenAI API key
   - Email server credentials
   - Mapbox token

3. **Initialize the database**
   ```powershell
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**
   ```powershell
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Professional dashboard
│   ├── admin/         # Admin panel
│   └── r/             # Public referral pages
├── components/        # React components
│   └── ui/            # shadcn/ui components
├── lib/               # Utilities and configurations
│   ├── prisma.ts      # Prisma client
│   ├── auth.ts        # Auth helpers
│   ├── validations.ts # Zod schemas
│   └── utils.ts       # General utilities
├── auth.ts            # NextAuth configuration
└── middleware.ts      # Route protection
```

## Database Schema

The platform uses the following main models:
- **User**: Account information and authentication
- **Profile**: Professional profile details
- **Partnership**: Bidirectional partner relationships
- **Referral**: Client referral tracking
- **Subscription**: Stripe subscription management
- **UserAnalytics**: Performance metrics

## Development Workflow

1. **Database changes**: Update `prisma/schema.prisma` then run `npx prisma db push`
2. **New components**: Place in `src/components/` with proper TypeScript types
3. **API routes**: Create in `src/app/api/` using Next.js route handlers
4. **Server actions**: Use for form submissions and mutations

## Environment Variables

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
AUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# OpenAI
OPENAI_API_KEY="sk-..."

# Email
EMAIL_SERVER_HOST="smtp.example.com"
EMAIL_FROM="noreply@example.com"

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN="pk..."
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

1. Build the project: `npm run build`
2. Start production server: `npm start`

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact the development team.

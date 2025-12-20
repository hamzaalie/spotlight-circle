# 💻 Developer Tips & Tricks

## Helpful npm Scripts

```powershell
# Start development server (with hot reload)
npm run dev

# View database in browser UI
npm run db:studio

# Update database schema (after editing schema.prisma)
npm run db:push

# Generate a secure auth secret
npm run generate:secret

# Build for production (test before deploying)
npm run build

# Start production server (after build)
npm start

# Check for code issues
npm run lint
```

---

## VS Code Extensions (Recommended)

1. **Prisma** - Syntax highlighting for schema files
2. **Tailwind CSS IntelliSense** - Auto-complete for classes
3. **ES7+ React/Redux/React-Native snippets** - Code shortcuts
4. **Better Comments** - Colored comment sections
5. **Error Lens** - Inline error display

Install via VS Code: `Ctrl+Shift+X` → Search extension name

---

## Code Snippets

### Create a New API Route

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Your logic here
    const data = await prisma.user.findUnique({
      where: { id: session.user.id }
    })

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    // Validate with Zod here
    
    // Your logic here

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
```

### Create a Protected Page

```typescript
// src/app/dashboard/example/page.tsx
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

export default async function ExamplePage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const data = await prisma.profile.findUnique({
    where: { userId: session.user.id }
  })

  return (
    <div>
      <h1>Example Page</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
```

### Create a Client Component with Form

```typescript
// src/components/example/ExampleForm.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ExampleForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
    }

    try {
      const res = await fetch("/api/example", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error("Request failed")
      }

      // Handle success
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required />
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}
```

---

## Prisma Tips

### Query Examples

```typescript
// Find one
const user = await prisma.user.findUnique({
  where: { id: "123" }
})

// Find many with filter
const users = await prisma.user.findMany({
  where: {
    role: "PROFESSIONAL",
    profile: {
      city: "New York"
    }
  },
  include: {
    profile: true
  }
})

// Create
const newUser = await prisma.user.create({
  data: {
    email: "test@example.com",
    password: hashedPassword,
    profile: {
      create: {
        firstName: "John",
        lastName: "Doe",
        // ... other fields
      }
    }
  }
})

// Update
await prisma.user.update({
  where: { id: "123" },
  data: {
    profile: {
      update: {
        bio: "New bio"
      }
    }
  }
})

// Delete
await prisma.user.delete({
  where: { id: "123" }
})

// Count
const count = await prisma.referral.count({
  where: {
    status: "COMPLETED"
  }
})
```

---

## Debugging Tips

### 1. Console Log in Server Components

```typescript
// Works in server components (pages, layouts)
console.log("Server log:", data)

// View in terminal where dev server is running
```

### 2. Console Log in Client Components

```typescript
// Works in client components ("use client")
console.log("Client log:", data)

// View in browser console (F12)
```

### 3. Prisma Query Logging

Already enabled in development. Check terminal for SQL queries.

### 4. Network Tab

- Open browser DevTools (F12)
- Go to Network tab
- Filter by "Fetch/XHR"
- See all API requests and responses

### 5. React DevTools

- Install browser extension
- Inspect component tree
- View component props and state

---

## Performance Tips

### 1. Image Optimization

```typescript
import Image from "next/image"

<Image
  src="/photo.jpg"
  alt="Description"
  width={200}
  height={200}
  className="rounded-full"
  priority // For above-the-fold images
/>
```

### 2. Loading States

```typescript
import { Suspense } from "react"

<Suspense fallback={<LoadingSpinner />}>
  <SlowComponent />
</Suspense>
```

### 3. Lazy Loading

```typescript
import dynamic from "next/dynamic"

const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  loading: () => <p>Loading...</p>,
})
```

### 4. Database Pagination

```typescript
const referrals = await prisma.referral.findMany({
  take: 20,  // Limit
  skip: 0,   // Offset
  orderBy: { createdAt: "desc" }
})
```

---

## Git Workflow

```powershell
# Initial setup
git init
git add .
git commit -m "Initial commit"

# Create feature branch
git checkout -b feature/onboarding

# Make changes, then:
git add .
git commit -m "Add onboarding flow"

# Push to GitHub
git push origin feature/onboarding

# Merge to main (after testing)
git checkout main
git merge feature/onboarding
git push origin main
```

---

## Environment Management

### Development (.env.local)
```env
DATABASE_URL="postgresql://localhost:5432/dev"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

### Production (Vercel)
Set in Vercel dashboard:
- Settings → Environment Variables
- Add all from .env.example
- Use production values

---

## Common Errors & Solutions

### "Module not found"
```powershell
npm install --legacy-peer-deps
```

### "Prisma Client not found"
```powershell
npx prisma generate
```

### "Port already in use"
```powershell
# Kill process using port 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force

# Or use different port
$env:PORT=3001; npm run dev
```

### "Database connection failed"
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Test connection with Prisma Studio

### "NextAuth session error"
- Clear browser cookies
- Check AUTH_SECRET in .env
- Restart dev server

---

## Testing API Routes (without Frontend)

### Using PowerShell

```powershell
# GET request
Invoke-WebRequest -Uri "http://localhost:3000/api/example" -Method GET

# POST request
$body = @{name="John"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/example" -Method POST -Body $body -ContentType "application/json"
```

### Using Postman
1. Download Postman
2. Create new request
3. Set URL: `http://localhost:3000/api/example`
4. Set method: POST
5. Body → raw → JSON
6. Send request

---

## Keyboard Shortcuts (VS Code)

- `Ctrl+P` - Quick file open
- `Ctrl+Shift+F` - Search in all files
- `Ctrl+D` - Select next match
- `Alt+Click` - Multi-cursor
- `Ctrl+/` - Toggle comment
- `F2` - Rename symbol
- `Ctrl+Space` - Trigger autocomplete
- `Ctrl+Shift+L` - Select all matches

---

## TypeScript Tips

### Type a Prisma Query Result

```typescript
import { Prisma } from "@prisma/client"

type UserWithProfile = Prisma.UserGetPayload<{
  include: { profile: true }
}>

const user: UserWithProfile = await prisma.user.findUnique({
  where: { id: "123" },
  include: { profile: true }
})
```

### Use Zod for Validation

```typescript
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
})

const result = schema.parse(data) // Throws if invalid
// or
const result = schema.safeParse(data) // Returns {success, data, error}
```

---

## Helpful Links (Bookmarks)

- Local app: http://localhost:3000
- Prisma Studio: http://localhost:5555 (run `npm run db:studio`)
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://prisma.io/docs
- Tailwind Cheatsheet: https://nerdcave.com/tailwind-cheat-sheet

---

## Pro Tips

1. **Keep terminal open** with dev server running
2. **Open Prisma Studio** to visualize database
3. **Use TypeScript hints** - hover over anything
4. **Read error messages** - they're usually helpful
5. **Check schema first** before writing queries
6. **Test in browser console** before making components
7. **Commit often** - small, focused commits
8. **Read documentation** - it's well written

---

**Happy coding! 🚀**

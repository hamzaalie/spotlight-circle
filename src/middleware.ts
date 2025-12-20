import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth(async (req) => {
  const isLoggedIn = !!req.auth
  const userId = req.auth?.user?.id
  const { pathname } = req.nextUrl

  // Check if user has a profile (only if logged in)
  let hasProfile = false
  if (isLoggedIn && userId) {
    // In middleware, we can't easily query DB, so we'll rely on profile route protection
    // The onboarding page will check and redirect if profile exists
    hasProfile = false // Will be checked on the page level
  }

  // Public routes
  const publicRoutes = ['/', '/auth/signin', '/auth/signup', '/p/', '/r/']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // Allow payment pages for authenticated users
  if (pathname.startsWith('/payment') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Protect dashboard routes - redirect to signin if not logged in
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  // Protect onboarding route - redirect to signin if not logged in
  if (pathname.startsWith('/onboarding') && !isLoggedIn) {
    const signInUrl = new URL('/auth/signin', req.url)
    // Preserve invite parameter if present
    const inviteParam = req.nextUrl.searchParams.get('invite')
    if (inviteParam) {
      signInUrl.searchParams.set('invite', inviteParam)
    }
    return NextResponse.redirect(signInUrl)
  }

  // Protect admin routes
  if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Redirect authenticated users away from auth pages
  if (isLoggedIn && pathname.startsWith('/auth/')) {
    const onboardingUrl = new URL('/onboarding', req.url)
    // Preserve invite parameter if present in the auth page URL
    const inviteParam = req.nextUrl.searchParams.get('invite')
    if (inviteParam) {
      onboardingUrl.searchParams.set('invite', inviteParam)
    }
    return NextResponse.redirect(onboardingUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}


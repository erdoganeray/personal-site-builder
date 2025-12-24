import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Beta test mode check
    const isBetaMode = process.env.BETA_MODE === 'true'

    if (!isBetaMode) {
        return NextResponse.next()
    }

    const pathname = request.nextUrl.pathname

    // Allow access to beta-login page, login API, and NextAuth API
    if (
        pathname.startsWith('/beta-login') ||
        pathname.startsWith('/api/beta-login') ||
        pathname.startsWith('/api/auth') || // Allow NextAuth
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon.ico') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Check if user has beta access cookie
    const betaAccessCookie = request.cookies.get('beta-access')?.value
    const betaPassword = process.env.BETA_PASSWORD

    if (betaAccessCookie && betaPassword && betaAccessCookie === betaPassword) {
        return NextResponse.next()
    }

    // Redirect to beta login page
    const loginUrl = new URL('/beta-login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api/beta-login (beta login API)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}

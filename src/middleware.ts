import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
 const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

 const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://va.vercel-scripts.com https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
    connect-src 'self' https://va.vercel-scripts.com;
  `

 const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim()

 const requestHeaders = new Headers(request.headers)
 requestHeaders.set('x-nonce', nonce)

 requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

 const response = NextResponse.next({
  request: {
   headers: requestHeaders,
  },
 })

 response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue)

 return response
}

export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

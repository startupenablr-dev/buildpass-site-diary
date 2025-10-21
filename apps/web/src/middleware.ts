import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Hardcoded API key (replace with an environment variable in production)
const API_KEY = process.env.API_KEY;

// Paths to protect
const PROTECTED_PATHS = ['/api/site-diary'];

export function middleware(request: NextRequest) {
  // Check if the request path matches protected paths
  const path = request.nextUrl.pathname;

  if (PROTECTED_PATHS.some((protectedPath) => path.startsWith(protectedPath))) {
    // Get the API key from the request header
    const providedKey = request.headers.get('x-api-key');

    if (providedKey !== API_KEY) {
      // If the API key is invalid, return a 401 Unauthorized response
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 },
      );
    }
  }

  // Continue processing the request if valid
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};

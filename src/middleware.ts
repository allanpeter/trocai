import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, icons/, logo/ (public assets)
     */
    '/((?!_next/static|_next/image|favicon.ico|icons|logo|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

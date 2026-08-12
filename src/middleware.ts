import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const ADMIN_EMAILS: string[] = process.env.ADMIN_EMAILS
  ? process.env.ADMIN_EMAILS.split(',').map((email) => email.trim().toLowerCase())
  : ['walim204@gmail.com'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin') && pathname !== '/admin/login';
  const isSupplierDashboardRoute = pathname.startsWith('/supplier/') && pathname !== '/supplier/login';
  const isCustomerAccountRoute = pathname.startsWith('/account');

  const userEmail = user?.email?.toLowerCase() ?? null;
  const isAdminAuthorized = userEmail !== null && ADMIN_EMAILS.includes(userEmail);

  // Admin protection
  if (isAdminRoute) {
    if (!user) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }

    if (!isAdminAuthorized) {
      const homeUrl = request.nextUrl.clone();
      homeUrl.pathname = '/';
      return NextResponse.redirect(homeUrl);
    }
  }

  // Protected customer account protection
  if (isCustomerAccountRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Protected supplier dashboard protection
  if (isSupplierDashboardRoute && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/supplier/login';
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*', '/supplier/dashboard/:path*', '/supplier/products/:path*', '/supplier/orders/:path*', '/account/:path*'],
};

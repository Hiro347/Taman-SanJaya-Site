import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const updateSession = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Route protection for /gate-sanjaya-admin routes (except /gate-sanjaya-admin/login)
  const isAccessingAdmin = request.nextUrl.pathname.startsWith('/gate-sanjaya-admin');
  const isLoginPage = request.nextUrl.pathname === '/gate-sanjaya-admin/login';

  if (isAccessingAdmin) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isLoginPage && !user) {
      const url = request.nextUrl.clone();
      url.pathname = '/gate-sanjaya-admin/login';
      return NextResponse.redirect(url);
    }

    // If already logged in and visiting /gate-sanjaya-admin/login, redirect to /gate-sanjaya-admin
    if (isLoginPage && user) {
      const url = request.nextUrl.clone();
      url.pathname = '/gate-sanjaya-admin';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
};

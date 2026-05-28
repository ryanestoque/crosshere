import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  clinic: ["/clinic"],
  student: ["/student"],
  parent: ["/parent"],
};

const AUTH_ROUTES = ["/login", "/register", "/forgot-password"];
const PUBLIC_ROUTES = ["/", ...AUTH_ROUTES];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // Refresh session — IMPORTANT: do not remove this
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Allow public routes and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon")
  ) {
    return supabaseResponse;
  }

  // Handle root route (/) redirect
  if (pathname === "/") {
    if (user) {
      if (!user.user_metadata?.role) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      const role = (profile?.role || user.user_metadata?.role || "student") as string;
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If not authenticated and trying to access a protected route
  if (!user) {
    const isProtectedRoute = Object.values(ROLE_ROUTES)
      .flat()
      .some((route) => pathname.startsWith(route));

    if (isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  // User is authenticated — get their role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role || user.user_metadata?.role || "student") as string;
  const hasSelectedRole = !!user.user_metadata?.role;

  // Enforce role selection for authenticated users
  if (!hasSelectedRole && !pathname.startsWith('/onboarding') && pathname !== '/auth/callback') {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // Prevent users who have already selected a role from accessing onboarding
  if (hasSelectedRole && pathname.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  // Redirect away from auth pages when already logged in
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (role) {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }

  // Enforce role-based route boundaries
  if (role) {
    const allowedPrefixes = ROLE_ROUTES[role] || [];
    const isAccessingOtherRole = Object.entries(ROLE_ROUTES)
      .filter(([r]) => r !== role)
      .flatMap(([, routes]) => routes)
      .some((route) => pathname.startsWith(route));

    if (isAccessingOtherRole) {
      return NextResponse.redirect(new URL(`/${role}`, request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

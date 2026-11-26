import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  ROLE_COOKIE,
  clearAuthCookies,
  homeForRole,
  refreshSession,
  writeAuthCookies,
} from "@/lib/auth/tokens";

/**
 * Optimistic route protection (Next 16 renamed `middleware` to `proxy`).
 * - /admin/** requires role ADMIN, /pharmacy/** requires role PHARMACY.
 * - Refreshes an expired access token with the refresh cookie before the page renders.
 * The portal layouts re-check the session server-side with GET /auth/me.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const role = request.cookies.get(ROLE_COOKIE)?.value;
  const home = homeForRole(role);

  if (pathname === "/login") {
    if (refresh && home) return NextResponse.redirect(new URL(home, request.url));
    return NextResponse.next();
  }

  const required = pathname.startsWith("/admin") ? "ADMIN" : "PHARMACY";

  if (!refresh && !access) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  if (role !== required) {
    return NextResponse.redirect(new URL(home ?? "/login", request.url));
  }

  if (!access && refresh) {
    const auth = await refreshSession(refresh);
    if (!auth) {
      const res = NextResponse.redirect(new URL("/login", request.url));
      clearAuthCookies(res.cookies);
      return res;
    }
    // Forward the new access token to this render and persist both tokens in the browser.
    request.cookies.set(ACCESS_COOKIE, auth.accessToken);
    request.cookies.set(REFRESH_COOKIE, auth.refreshToken);
    const headers = new Headers(request.headers);
    headers.set("cookie", request.cookies.toString());
    const res = NextResponse.next({ request: { headers } });
    writeAuthCookies(res.cookies, auth);
    if (auth.user.role !== required) {
      const redirect = NextResponse.redirect(new URL(homeForRole(auth.user.role) ?? "/login", request.url));
      writeAuthCookies(redirect.cookies, auth);
      return redirect;
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/pharmacy/:path*", "/login"],
};

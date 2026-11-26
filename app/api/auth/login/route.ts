import { NextResponse } from "next/server";
import type { AuthResponse } from "@/types/api";
import { serverApiUrl } from "@/lib/config";
import { errorMessageFrom, homeForRole, writeAuthCookies } from "@/lib/auth/tokens";

/**
 * POST /api/auth/login { email, password }
 * Calls POST /auth/login and stores the tokens in httpOnly cookies. Roles without a web portal
 * (CUSTOMER, DOCTOR, RIDER) are signed out again immediately and told to use the mobile app.
 */
export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!email || !password) {
    return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${serverApiUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json({ message: "The API could not be reached. Try again shortly." }, { status: 502 });
  }

  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const fallback = res.status === 401 ? "Invalid email or password." : `Sign-in failed (${res.status}).`;
    return NextResponse.json({ message: errorMessageFrom(data, fallback) }, { status: res.status });
  }

  const auth = data as AuthResponse;
  const home = homeForRole(auth.user?.role);
  if (!home) {
    // Best-effort revoke of the refresh token we will not keep.
    await fetch(`${serverApiUrl()}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.accessToken}` },
      body: JSON.stringify({ refreshToken: auth.refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
    return NextResponse.json({ redirectTo: "/mobile-app", role: auth.user?.role });
  }

  const response = NextResponse.json({ redirectTo: home, role: auth.user.role });
  writeAuthCookies(response.cookies, auth);
  return response;
}

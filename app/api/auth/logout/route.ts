import { NextResponse, type NextRequest } from "next/server";
import { serverApiUrl } from "@/lib/config";
import { ACCESS_COOKIE, REFRESH_COOKIE, clearAuthCookies } from "@/lib/auth/tokens";

/** POST /api/auth/logout – revokes the refresh token (POST /auth/logout) and clears the cookies. */
export async function POST(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    await fetch(`${serverApiUrl()}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(access ? { Authorization: `Bearer ${access}` } : {}),
      },
      body: JSON.stringify({ refreshToken: refresh }),
      cache: "no-store",
    }).catch(() => undefined);
  }
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response.cookies);
  return response;
}

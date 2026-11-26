import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearAuthCookies,
  homeForRole,
  refreshSession,
  writeAuthCookies,
} from "@/lib/auth/tokens";

/**
 * GET /api/auth/token → { accessToken }
 * Hands the signed-in user's access token to client code that cannot use cookies directly
 * (the Socket.IO handshake). Refreshes the token first when the access cookie has expired.
 */
export async function GET(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  if (access) {
    return NextResponse.json({ accessToken: access }, { headers: { "Cache-Control": "no-store" } });
  }
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const auth = refresh ? await refreshSession(refresh) : null;
  if (!auth || !homeForRole(auth.user.role)) {
    const res = NextResponse.json({ message: "Not signed in." }, { status: 401 });
    clearAuthCookies(res.cookies);
    return res;
  }
  const res = NextResponse.json(
    { accessToken: auth.accessToken },
    { headers: { "Cache-Control": "no-store" } },
  );
  writeAuthCookies(res.cookies, auth);
  return res;
}

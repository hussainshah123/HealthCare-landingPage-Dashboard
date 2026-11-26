// Shared, runtime-agnostic auth helpers (usable from proxy.ts, route handlers and server components).
import type { AuthResponse, Role } from "@/types/api";
import { serverApiUrl } from "@/lib/config";

export const ACCESS_COOKIE = "hp_access";
export const REFRESH_COOKIE = "hp_refresh";
export const ROLE_COOKIE = "hp_role";

/** Roles that can use this web portal, and where each one lands after sign-in. */
export const PORTAL_HOME: Partial<Record<Role, string>> = {
  ADMIN: "/admin",
  PHARMACY: "/pharmacy",
};

export function homeForRole(role: string | undefined | null): string | null {
  if (!role) return null;
  return PORTAL_HOME[role as Role] ?? null;
}

const REFRESH_MAX_AGE = 60 * 60 * 24 * 30; // 30 days; API.md does not state the refresh token lifetime.
const DEFAULT_ACCESS_MAX_AGE = 60 * 15;

/** Minimal structural type that matches both `NextResponse.cookies` and `(await cookies())`. */
export interface CookieWriter {
  set(name: string, value: string, options?: Record<string, unknown>): unknown;
  delete(name: string): unknown;
}

function baseCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

function decodeJwtExp(token: string): number | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const json = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return typeof json.exp === "number" ? json.exp : null;
  } catch {
    return null;
  }
}

/** Seconds until the access token expires. Prefers the JWT `exp`, falls back to `expiresIn`. */
export function accessMaxAge(auth: Pick<AuthResponse, "accessToken" | "expiresIn">): number {
  const exp = decodeJwtExp(auth.accessToken);
  if (exp) {
    const secs = Math.floor(exp - Date.now() / 1000);
    if (secs > 0) return Math.max(secs - 15, 1);
  }
  const raw = auth.expiresIn;
  if (typeof raw === "number" && raw > 0) return raw;
  if (typeof raw === "string") {
    const m = raw.trim().match(/^(\d+)\s*([smhd]?)$/);
    if (m) {
      const n = Number(m[1]);
      const mult = { "": 1, s: 1, m: 60, h: 3600, d: 86400 }[m[2] as "" | "s" | "m" | "h" | "d"];
      return n * mult;
    }
  }
  return DEFAULT_ACCESS_MAX_AGE;
}

export function writeAuthCookies(store: CookieWriter, auth: AuthResponse) {
  const opts = baseCookieOptions();
  store.set(ACCESS_COOKIE, auth.accessToken, { ...opts, maxAge: accessMaxAge(auth) });
  store.set(REFRESH_COOKIE, auth.refreshToken, { ...opts, maxAge: REFRESH_MAX_AGE });
  store.set(ROLE_COOKIE, auth.user.role, { ...opts, maxAge: REFRESH_MAX_AGE });
}

export function clearAuthCookies(store: CookieWriter) {
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
  store.delete(ROLE_COOKIE);
}

/** POST /auth/refresh { refreshToken } → AuthResponse. Returns null when the refresh is refused or fails. */
export async function refreshSession(refreshToken: string): Promise<AuthResponse | null> {
  try {
    const res = await fetch(`${serverApiUrl()}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as AuthResponse;
  } catch {
    return null;
  }
}

/** Turns an API error body (`message` may be string or string[]) into a single readable string. */
export function errorMessageFrom(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const m = (body as { message: unknown }).message;
    if (Array.isArray(m)) return m.join(", ");
    if (typeof m === "string" && m) return m;
  }
  return fallback;
}

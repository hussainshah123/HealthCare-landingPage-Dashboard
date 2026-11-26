// Server-only session helpers for Server Components. Reading cookies is request-time data, so
// callers must sit behind a <Suspense> boundary (cacheComponents is enabled in next.config.ts).
import { cookies } from "next/headers";
import type { User } from "@/types/api";
import { serverApiUrl } from "@/lib/config";
import { ACCESS_COOKIE } from "./tokens";

export type SessionResult =
  | { kind: "ok"; user: User }
  | { kind: "unauthenticated" }
  | { kind: "unavailable"; message: string };

/**
 * Resolves the signed-in user with GET /auth/me. Token refresh happens earlier in proxy.ts,
 * so by the time a page renders the access cookie is fresh (or the request was redirected).
 */
export async function getSession(): Promise<SessionResult> {
  const token = (await cookies()).get(ACCESS_COOKIE)?.value;
  if (!token) return { kind: "unauthenticated" };
  try {
    const res = await fetch(`${serverApiUrl()}/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (res.status === 401 || res.status === 403) return { kind: "unauthenticated" };
    if (!res.ok) return { kind: "unavailable", message: `The API answered ${res.status}.` };
    return { kind: "ok", user: (await res.json()) as User };
  } catch {
    return { kind: "unavailable", message: "The API could not be reached." };
  }
}

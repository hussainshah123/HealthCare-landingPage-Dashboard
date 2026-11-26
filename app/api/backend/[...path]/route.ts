import { NextResponse, type NextRequest } from "next/server";
import type { AuthResponse } from "@/types/api";
import { serverApiUrl } from "@/lib/config";
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  clearAuthCookies,
  refreshSession,
  writeAuthCookies,
} from "@/lib/auth/tokens";

/**
 * Backend-for-frontend proxy: /api/backend/<path> → ${API_URL}/<path>.
 * Attaches `Authorization: Bearer <access cookie>`, refreshes once on 401, and streams the
 * response back (JSON or files such as GET /prescriptions/:id/file).
 */
type Ctx = { params: Promise<{ path: string[] }> };

const FORWARD_RESPONSE_HEADERS = ["content-type", "content-disposition", "cache-control"];

async function forward(request: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  const target = `${serverApiUrl()}/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? await request.arrayBuffer() : undefined;
  const contentType = request.headers.get("content-type");

  const send = (token: string | undefined) =>
    fetch(target, {
      method,
      headers: {
        Accept: request.headers.get("accept") ?? "application/json",
        ...(contentType && body && body.byteLength > 0 ? { "Content-Type": contentType } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body && body.byteLength > 0 ? body : undefined,
      cache: "no-store",
      redirect: "manual",
    });

  let refreshed: AuthResponse | null = null;
  let upstream: Response;
  try {
    upstream = await send(request.cookies.get(ACCESS_COOKIE)?.value);
    if (upstream.status === 401) {
      const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
      if (refresh) {
        refreshed = await refreshSession(refresh);
        if (refreshed) upstream = await send(refreshed.accessToken);
      }
    }
  } catch {
    return NextResponse.json(
      { statusCode: 502, message: "The API could not be reached." },
      { status: 502 },
    );
  }

  const headers = new Headers();
  for (const name of FORWARD_RESPONSE_HEADERS) {
    const v = upstream.headers.get(name);
    if (v) headers.set(name, v);
  }
  if (!headers.has("cache-control")) headers.set("cache-control", "no-store");

  const noBody = upstream.status === 204 || upstream.status === 304 || method === "HEAD";
  const response = new NextResponse(noBody ? null : upstream.body, {
    status: upstream.status,
    headers,
  });
  if (refreshed) writeAuthCookies(response.cookies, refreshed);
  else if (upstream.status === 401) clearAuthCookies(response.cookies);
  return response;
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const PATCH = forward;
export const DELETE = forward;

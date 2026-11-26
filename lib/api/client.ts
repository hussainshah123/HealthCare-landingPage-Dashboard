// Browser-side fetch client. Every call goes through the Next route handler at /api/backend,
// which attaches the access token from the httpOnly cookie and refreshes it when needed.
import type { Paginated } from "@/types/api";
import { errorMessageFrom } from "@/lib/auth/tokens";

export const BACKEND_PREFIX = "/api/backend";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type Query = Record<string, string | number | boolean | null | undefined>;

export function buildQuery(query?: Query): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

export function backendUrl(path: string, query?: Query) {
  return `${BACKEND_PREFIX}${path.startsWith("/") ? path : `/${path}`}${buildQuery(query)}`;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
}

export async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", query, body, signal } = opts;
  let res: Response;
  try {
    res = await fetch(backendUrl(path, query), {
      method,
      headers: {
        Accept: "application/json",
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      cache: "no-store",
      signal,
    });
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    throw new ApiError("Network error – check your connection.", 0);
  }

  if (res.status === 401 && typeof window !== "undefined") {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    // Full reload on purpose: drop all client state of the expired session.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(`/login?next=${next}`);
    throw new ApiError("Your session has expired. Please sign in again.", 401);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!res.ok) {
    throw new ApiError(errorMessageFrom(data, `Request failed (${res.status})`), res.status, data);
  }
  return data as T;
}

/** Normalises endpoints that may answer with either a plain array or a paginated envelope. */
export function asList<T>(data: T[] | Paginated<T> | null | undefined): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : (data.items ?? []);
}

export function asPage<T>(data: T[] | Paginated<T> | null | undefined, page = 1, limit = 20): Paginated<T> {
  if (!data) return { items: [], total: 0, page, limit };
  if (Array.isArray(data)) return { items: data, total: data.length, page: 1, limit: data.length || limit };
  return data;
}

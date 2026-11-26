const DEFAULT_API_URL = "http://localhost:3000/api";

function trimSlash(url: string) {
  return url.replace(/\/+$/, "");
}

/** Base URL of the NestJS API, used by server code (route handlers, proxy, server components). */
export function serverApiUrl(): string {
  return trimSlash(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);
}

/** Base URL of the NestJS API as seen from the browser. */
export const publicApiUrl: string = trimSlash(process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL);

/**
 * Socket.IO server origin. API.md: "Connect to http://<host>:3000" – i.e. the API URL without `/api`.
 * Can be overridden with NEXT_PUBLIC_SOCKET_URL.
 */
export const socketUrl: string = trimSlash(
  process.env.NEXT_PUBLIC_SOCKET_URL || publicApiUrl.replace(/\/api$/, ""),
);

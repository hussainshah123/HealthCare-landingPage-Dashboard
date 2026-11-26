"use client";

import { useEffect, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { DeliveryJoinAck, DeliveryStatusEvent, RiderLocationEvent } from "@/types/api";
import { socketUrl } from "@/lib/config";

export interface LiveLocation {
  lat: number;
  lng: number;
  heading: number | null;
  speed: number | null;
  recordedAt: string | null;
}

async function fetchToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/token", { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as { accessToken?: string };
    return data.accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Subscribes to the Socket.IO `/tracking` namespace (API.md › Real-time) and joins
 * `delivery:join { orderId }` for every order id given. Returns the latest rider location
 * and delivery status per order id.
 */
export function useTracking(orderIds: string[]) {
  const socketRef = useRef<Socket | null>(null);
  const joinedRef = useRef<Set<string>>(new Set());
  const [connectionId, setConnectionId] = useState(0);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Record<string, LiveLocation>>({});
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const socket = io(`${socketUrl}/tracking`, {
      // Called on every (re)connection attempt so an expired token is replaced.
      auth: (cb) => {
        void fetchToken().then((token) => cb(token ? { token } : {}));
      },
      transports: ["websocket", "polling"],
      reconnectionDelayMax: 10_000,
    });
    socketRef.current = socket;
    const joined = joinedRef.current;

    socket.on("connect", () => {
      joined.clear();
      setConnected(true);
      setError(null);
      setConnectionId((n) => n + 1);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", (err: Error) => setError(err.message || "Connection failed"));
    socket.on("rider:location", (e: RiderLocationEvent) => {
      setLocations((prev) => ({
        ...prev,
        [e.orderId]: {
          lat: e.lat,
          lng: e.lng,
          heading: e.heading ?? null,
          speed: e.speed ?? null,
          recordedAt: e.recordedAt ?? null,
        },
      }));
    });
    socket.on("delivery:status", (e: DeliveryStatusEvent) => {
      setStatuses((prev) => ({ ...prev, [e.orderId]: e.status }));
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
      joined.clear();
    };
  }, []);

  const idsKey = [...orderIds].sort().join(",");

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || connectionId === 0) return;
    const wanted = new Set(idsKey ? idsKey.split(",") : []);
    const joined = joinedRef.current;

    for (const orderId of wanted) {
      if (joined.has(orderId)) continue;
      joined.add(orderId);
      socket.emit("delivery:join", { orderId }, (ack: DeliveryJoinAck | undefined) => {
        if (!ack?.ok) {
          joined.delete(orderId);
          return;
        }
        const last = ack.lastLocation;
        if (last) {
          setLocations((prev) =>
            prev[orderId]
              ? prev
              : {
                  ...prev,
                  [orderId]: {
                    lat: last.lat,
                    lng: last.lng,
                    heading: last.heading ?? null,
                    speed: null,
                    recordedAt: last.recordedAt ?? null,
                  },
                },
          );
        }
      });
    }
    for (const orderId of [...joined]) {
      if (!wanted.has(orderId)) {
        socket.emit("delivery:leave", { orderId });
        joined.delete(orderId);
      }
    }
  }, [idsKey, connectionId]);

  return { connected, error, locations, statuses };
}

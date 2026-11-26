"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface State<T> {
  key: string | null;
  data: T | undefined;
  error: Error | undefined;
}

/**
 * Tiny client-side data hook: re-runs `fetcher` whenever `deps` change, keeps the previous data
 * while reloading, and exposes `reload()`.
 */
export function useQuery<T>(fetcher: () => Promise<T>, deps: unknown[]) {
  const [nonce, setNonce] = useState(0);
  const [state, setState] = useState<State<T>>({ key: null, data: undefined, error: undefined });
  const fetcherRef = useRef(fetcher);
  const key = `${JSON.stringify(deps)}#${nonce}`;

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    let cancelled = false;
    fetcherRef.current().then(
      (data) => {
        if (!cancelled) setState({ key, data, error: undefined });
      },
      (error: unknown) => {
        if (!cancelled)
          setState((s) => ({
            key,
            data: s.data,
            error: error instanceof Error ? error : new Error(String(error)),
          }));
      },
    );
    return () => {
      cancelled = true;
    };
  }, [key]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const settled = state.key === key;

  return {
    data: state.data,
    error: settled ? state.error : undefined,
    loading: !settled,
    reload,
    setData: (updater: (prev: T | undefined) => T | undefined) =>
      setState((s) => ({ ...s, data: updater(s.data) })),
  };
}

"use client";

import { useCallback, useEffect, useState } from "react";

export type QueryState<T> =
  | { status: "loading" }
  | { status: "error"; error: string }
  | { status: "success"; data: T };

/** Minimal async loader with retry. Swap for TanStack Query when the real API lands. */
export function useQuery<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<QueryState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fn().then(
      (data) => !cancelled && setState({ status: "success", data }),
      (e: unknown) => !cancelled && setState({ status: "error", error: e instanceof Error ? e.message : "Request failed" }),
    );
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, ...deps]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { state, retry };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { leadSourcesApi } from "@/features/leads/api";
import type { LeadSourceOption } from "@/features/leads/types";

/** Loads the account's lead sources and adds new ones. `sources` is null while loading. */
export function useLeadSources(reloadKey: unknown = 0) {
  const [sources, setSources] = useState<LeadSourceOption[] | null>(null);

  useEffect(() => {
    let active = true;
    leadSourcesApi.list().then((list) => active && setSources(list));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const addSource = useCallback(async (label: string) => {
    const source = await leadSourcesApi.create(label);
    setSources((current) =>
      current && !current.some((item) => item.value === source.value) ? [...current, source] : current,
    );
    return source;
  }, []);

  return { sources, addSource };
}

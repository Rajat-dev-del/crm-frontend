"use client";

import { useCallback, useEffect, useState } from "react";
import { leadStatusesApi } from "@/features/leads/api";
import type { LeadStatusOption } from "@/features/leads/types";

/**
 * Loads the account's lead statuses and adds new ones. `statuses` is null while loading.
 * Change `reloadKey` to fetch the list again.
 */
export function useLeadStatuses(reloadKey: unknown = 0) {
  const [statuses, setStatuses] = useState<LeadStatusOption[] | null>(null);

  useEffect(() => {
    let active = true;
    leadStatusesApi.list().then((list) => active && setStatuses(list));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const addStatus = useCallback(async (name: string) => {
    const status = await leadStatusesApi.create(name);
    setStatuses((current) =>
      current && !current.some((item) => item.id === status.id) ? [...current, status] : current,
    );
    return status;
  }, []);

  return { statuses, addStatus };
}

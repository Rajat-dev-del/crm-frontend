"use client";

import { useEffect, useState } from "react";
import { propertiesApi } from "@/features/properties/api";
import type { Property } from "@/features/properties/types";

/** Loads the property list; `properties` is null while loading. */
export function useProperties() {
  const [properties, setProperties] = useState<Property[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    propertiesApi
      .list({ page: 1, limit: Number.MAX_SAFE_INTEGER })
      .then((result) => active && setProperties(result.properties))
      .catch((err: Error) => active && setError(err.message));
    return () => {
      active = false;
    };
  }, []);

  return { properties, error };
}

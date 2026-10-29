"use client";

import { Select } from "@/components/ui/form";
import { useProperties } from "@/features/properties/hooks/useProperties";

type PropertySelectProps = {
  id: string;
  /** Property name; empty when none is chosen. */
  value: string;
  onChange: (name: string) => void;
};

/** Dropdown of the account's properties. Keeps a saved value selectable even if that property was removed. */
export function PropertySelect({ id, value, onChange }: PropertySelectProps) {
  const { properties } = useProperties();
  const names = (properties ?? []).map((property) => property.name);
  if (value && !names.includes(value)) names.unshift(value);

  return (
    <Select id={id} value={value} onChange={(event) => onChange(event.target.value)} disabled={properties === null}>
      <option value="">{properties === null ? "Loading properties…" : "Select property or project"}</option>
      {names.map((name) => (
        <option key={name} value={name}>{name}</option>
      ))}
    </Select>
  );
}

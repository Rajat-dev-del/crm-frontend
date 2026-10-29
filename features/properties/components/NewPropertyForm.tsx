"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/form";
import { propertiesApi } from "@/features/properties/api";
import { PROPERTY_TYPES } from "@/features/properties/constants";
import type { PropertyInput } from "@/features/properties/types";

export function NewPropertyForm() {
  const router = useRouter();
  const [values, setValues] = useState<PropertyInput>({ name: "", type: PROPERTY_TYPES[0], location: "" });
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = values.name.trim();
    if (name.length < 2 || name.length > 120) {
      setNameError("Enter a property name between 2 and 120 characters.");
      return;
    }
    setSaving(true);
    setSubmitError(null);
    try {
      await propertiesApi.create(values);
      router.push("/properties");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "The property could not be saved.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-3">
        <Field label="Property name" htmlFor="property-name" required error={nameError ?? undefined}>
          <Input
            id="property-name"
            value={values.name}
            placeholder="e.g. Rosewood Vista"
            maxLength={120}
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "property-name-error" : undefined}
            onChange={(event) => {
              setValues({ ...values, name: event.target.value });
              setNameError(null);
            }}
          />
        </Field>
        <Field label="Type" htmlFor="property-type">
          <Select id="property-type" value={values.type} onChange={(event) => setValues({ ...values, type: event.target.value })}>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </Field>
        <Field label="Location" htmlFor="property-location">
          <Input
            id="property-location"
            value={values.location}
            placeholder="City or area"
            maxLength={160}
            onChange={(event) => setValues({ ...values, location: event.target.value })}
          />
        </Field>
      </div>

      {submitError && (
        <p role="alert" className="mt-5 rounded-lg bg-danger-50 px-4 py-3 text-label text-danger-600 dark:bg-danger-500/15">
          {submitError}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
        <Button variant="secondary" size="lg" onClick={() => router.push("/properties")} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={saving} className="min-w-36">
          {saving ? "Saving…" : "Save property"}
        </Button>
      </div>
    </form>
  );
}

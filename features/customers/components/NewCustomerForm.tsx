"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/form";
import { CITIES_BY_STATE, INDIAN_STATES } from "@/config/locations";
import { customersApi } from "@/features/customers/api";
import type { CustomerInput } from "@/features/customers/types";
import { normalizePhone } from "@/features/leads/api";
import { PropertyPicker } from "@/features/properties/components/PropertyPicker";

type Errors = Partial<Record<keyof CustomerInput, string>>;

const emptyCustomer: CustomerInput = { name: "", phone: "", email: "", occupation: "", project: "", city: "", state: "" };

function validate(values: CustomerInput): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  if (name.length < 2 || name.length > 120) errors.name = "Enter a name between 2 and 120 characters.";
  if (values.phone.trim().length > 20 || normalizePhone(values.phone).length < 7) errors.phone = "Enter a valid phone number.";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  return errors;
}

export function NewCustomerForm() {
  const router = useRouter();
  const [values, setValues] = useState<CustomerInput>(emptyCustomer);
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const citiesForState = values.state ? (CITIES_BY_STATE[values.state] ?? []) : [];

  function update(key: keyof CustomerInput, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  function bind(key: keyof CustomerInput) {
    return {
      id: `customer-${key}`,
      value: values[key],
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? `customer-${key}-error` : undefined,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => update(key, event.target.value),
    };
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setSaving(true);
    setSubmitError(null);
    try {
      await customersApi.create(values);
      router.push("/customers");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "The customer could not be saved.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Name" htmlFor="customer-name" required error={errors.name}>
          <Input {...bind("name")} placeholder="Full name" maxLength={120} />
        </Field>
        <Field label="Phone number" htmlFor="customer-phone" required error={errors.phone}>
          <Input {...bind("phone")} type="tel" inputMode="tel" placeholder="Phone number" maxLength={20} />
        </Field>
        <Field label="Email" htmlFor="customer-email" error={errors.email}>
          <Input {...bind("email")} type="email" placeholder="Email address" maxLength={320} />
        </Field>
        <Field label="Occupation" htmlFor="customer-occupation">
          <Input {...bind("occupation")} placeholder="Occupation" maxLength={120} />
        </Field>
        <Field label="Property / Project" htmlFor="customer-project">
          <PropertyPicker id="customer-project" value={values.project} onChange={(name) => update("project", name)} />
        </Field>
        <Field label="State" htmlFor="customer-state">
          <Select {...bind("state")} onChange={(event) => { update("state", event.target.value); update("city", ""); }}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Select>
        </Field>
        <Field label="City" htmlFor="customer-city">
          {citiesForState.length > 0 ? (
            <Select {...bind("city")}>
              <option value="">Select city</option>
              {citiesForState.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </Select>
          ) : (
            <Input {...bind("city")} placeholder={values.state ? "Enter city" : "Select a state first"} maxLength={120} />
          )}
        </Field>
      </div>

      {submitError && (
        <p role="alert" className="mt-5 rounded-lg bg-danger-50 px-4 py-3 text-label text-danger-600 dark:bg-danger-500/15">
          {submitError}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
        <Button variant="secondary" size="lg" onClick={() => router.push("/customers")} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={saving} className="min-w-36">
          {saving ? "Saving…" : "Save customer"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { normalizePhone } from "@/features/leads/api";
import { SourcePicker } from "@/features/leads/components/SourcePicker";
import { StatusPicker } from "@/features/leads/components/StatusPicker";
import { DEFAULT_LEAD_STATUSES, MOCK_ASSIGNEES } from "@/features/leads/constants";
import { useLeadSources } from "@/features/leads/hooks/useLeadSources";
import { useLeadStatuses } from "@/features/leads/hooks/useLeadStatuses";
import type { Lead, LeadInput } from "@/features/leads/types";
import { CITIES_BY_STATE, INDIAN_STATES } from "@/config/locations";
import { PropertyPicker } from "@/features/properties/components/PropertyPicker";
import { useAuth } from "@/providers/AuthProvider";

type LeadFormProps = {
  lead?: Lead;
  submitLabel?: string;
  onSubmit: (input: LeadInput) => Promise<void>;
  onCancel: () => void;
};

type Errors = Partial<Record<keyof LeadInput, string>>;

function toInput(lead?: Lead): LeadInput {
  return {
    name: lead?.name ?? "",
    phone: lead?.phone ?? "",
    email: lead?.email ?? "",
    occupation: lead?.occupation ?? "",
    project: lead?.project ?? "",
    status: lead?.status ?? DEFAULT_LEAD_STATUSES[0],
    source: lead?.source ?? "manual",
    budget: lead?.budget ?? "",
    city: lead?.city ?? "",
    state: lead?.state ?? "",
    assignedTo: lead?.assignedTo ?? "",
    address: lead?.address ?? "",
    notes: lead?.notes ?? "",
  };
}

function validate(values: LeadInput): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  if (name.length < 2 || name.length > 120) errors.name = "Enter a name between 2 and 120 characters.";
  if (values.phone.trim().length > 20 || normalizePhone(values.phone).length < 7) errors.phone = "Enter a valid phone number.";
  if (!values.status.trim()) errors.status = "Choose or add a status.";
  if (values.email.trim() &&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  return errors;
}

export function LeadForm({ lead, submitLabel = "Save lead", onSubmit, onCancel }: LeadFormProps) {
  const { user } = useAuth();
  const { statuses, addStatus } = useLeadStatuses();
  const { sources, addSource } = useLeadSources();
  const [values, setValues] = useState<LeadInput>(() => toInput(lead));
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // All assignee candidates: mock team + current user (deduped).
  const allAssignees = [...new Set([...MOCK_ASSIGNEES, ...(user?.fullName ? [user.fullName] : [])])];
  // Keep any saved value selectable even if it's not in the list.
  const assigneeOptions = [...new Set([...allAssignees, ...(values.assignedTo ? [values.assignedTo] : [])])];

  const citiesForState = values.state ? (CITIES_BY_STATE[values.state] ?? []) : [];

  function update<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  /** Common props for a text control bound to `key`. */
  function bind(key: keyof LeadInput) {
    return {
      id: `lead-${key}`,
      value: values[key],
      "aria-invalid": errors[key] ? true : undefined,
      "aria-describedby": errors[key] ? `lead-${key}-error` : undefined,
      onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        update(key, event.target.value as LeadInput[typeof key]),
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
      await onSubmit(values);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "The lead could not be saved.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Name" htmlFor="lead-name" required error={errors.name}>
          <Input {...bind("name")} placeholder="Full name" autoComplete="off" maxLength={120} />
        </Field>
        <Field label="Phone number" htmlFor="lead-phone" required error={errors.phone}>
          <Input {...bind("phone")} type="tel" placeholder="Phone number" inputMode="tel" maxLength={20} />
        </Field>
        <Field label="Email" htmlFor="lead-email" error={errors.email}>
          <Input {...bind("email")} type="email" placeholder="Email address" maxLength={320} />
        </Field>
        <Field label="Occupation" htmlFor="lead-occupation">
          <Input {...bind("occupation")} placeholder="Occupation" maxLength={120} />
        </Field>
        <Field label="Property / Project" htmlFor="lead-project">
          <PropertyPicker id="lead-project" value={values.project} onChange={(name) => update("project", name)} />
        </Field>
        <Field label="Lead status" htmlFor="lead-status" required error={errors.status}>
          <StatusPicker
            id="lead-status"
            value={values.status}
            statuses={statuses}
            onChange={(name) => update("status", name)}
            onAdd={addStatus}
          />
        </Field>
        <Field label="Budget" htmlFor="lead-budget">
          <Input {...bind("budget")} placeholder="e.g. 50 lakh – 1 crore" maxLength={80} />
        </Field>
        <Field label="State" htmlFor="lead-state">
          <Select {...bind("state")} onChange={(event) => { update("state", event.target.value); update("city", ""); }}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </Select>
        </Field>
        <Field label="City" htmlFor="lead-city">
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
        <Field label="Lead source" htmlFor="lead-source">
          <SourcePicker
            id="lead-source"
            value={values.source}
            sources={sources}
            onChange={(val) => update("source", val)}
            onAdd={addSource}
          />
        </Field>
        <Field label="Assigned to" htmlFor="lead-assignedTo">
          <Select {...bind("assignedTo")}>
            <option value="">Unassigned</option>
            {assigneeOptions.map((name) => (
              <option key={name} value={name}>{name === user?.fullName ? `${name} (You)` : name}</option>
            ))}
          </Select>
        </Field>
        <Field label="Address" htmlFor="lead-address">
          <Textarea {...bind("address")} placeholder="Street address" maxLength={500} />
        </Field>
        <Field label="Message / Notes" htmlFor="lead-notes" className="md:col-span-2 xl:col-span-1">
          <Textarea {...bind("notes")} placeholder="Add a message or notes" maxLength={2000} />
        </Field>
      </div>

      {submitError && (
        <p role="alert" className="mt-5 rounded-lg bg-danger-50 px-4 py-3 text-label text-danger-600 dark:bg-danger-500/15">
          {submitError}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3 border-t border-line pt-5">
        <Button variant="secondary" size="lg" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" size="lg" disabled={saving} className="min-w-36">
          {saving ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

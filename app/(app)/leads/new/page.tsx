import type { Metadata } from "next";
import { FormPage } from "@/components/ui/FormPage";
import { NewLeadForm } from "@/features/leads/components/NewLeadForm";

export const metadata: Metadata = { title: "Add lead" };

export default function NewLeadPage() {
  return (
    <FormPage title="Add Lead" backHref="/leads">
      <NewLeadForm />
    </FormPage>
  );
}

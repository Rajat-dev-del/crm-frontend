import type { Metadata } from "next";
import { FormPage } from "@/components/ui/FormPage";
import { NewPropertyForm } from "@/features/properties/components/NewPropertyForm";

export const metadata: Metadata = { title: "Add property" };

export default function NewPropertyPage() {
  return (
    <FormPage title="Add Property" backHref="/properties">
      <NewPropertyForm />
    </FormPage>
  );
}

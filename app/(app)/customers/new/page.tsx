import type { Metadata } from "next";
import { FormPage } from "@/components/ui/FormPage";
import { NewCustomerForm } from "@/features/customers/components/NewCustomerForm";

export const metadata: Metadata = { title: "Add customer" };

export default function NewCustomerPage() {
  return (
    <FormPage title="Add Customer" backHref="/customers">
      <NewCustomerForm />
    </FormPage>
  );
}

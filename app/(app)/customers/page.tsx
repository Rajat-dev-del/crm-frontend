import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { CustomersView } from "@/features/customers/components/CustomersView";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Customer relationships"
        title="Customers"
        description="Manage converted leads and customer records."
        actions={
          <Link href="/customers/new" className={buttonClass({ size: "lg" })}>
            <Plus aria-hidden />
            Add customer
          </Link>
        }
      />
      <CustomersView />
    </>
  );
}

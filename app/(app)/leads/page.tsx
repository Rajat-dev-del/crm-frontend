import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { LeadsView } from "@/features/leads/components/LeadsView";

export const metadata: Metadata = { title: "Leads" };

export default function LeadsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pipeline management"
        title="Leads"
        description="Capture, qualify and follow up with every enquiry."
        actions={
          <Link href="/leads/new" className={buttonClass({ size: "lg" })}>
            <Plus aria-hidden />
            Add lead
          </Link>
        }
      />
      <LeadsView />
    </>
  );
}

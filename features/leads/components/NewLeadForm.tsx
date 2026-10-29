"use client";

import { useRouter } from "next/navigation";
import { leadsApi } from "@/features/leads/api";
import { LeadForm } from "@/features/leads/components/LeadForm";

export function NewLeadForm() {
  const router = useRouter();
  return (
    <LeadForm
      onCancel={() => router.push("/leads")}
      onSubmit={async (input) => {
        await leadsApi.create(input);
        router.push("/leads");
      }}
    />
  );
}

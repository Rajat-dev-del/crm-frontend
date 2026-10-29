import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { PropertiesView } from "@/features/properties/components/PropertiesView";

export const metadata: Metadata = { title: "Properties" };

export default function PropertiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Property inventory"
        title="Properties"
        description="Track project inventory, locations and property types."
        actions={
          <Link href="/properties/new" className={buttonClass({ size: "lg" })}>
            <Plus aria-hidden />
            Add property
          </Link>
        }
      />
      <PropertiesView />
    </>
  );
}

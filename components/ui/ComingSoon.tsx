import { Construction } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

type ComingSoonProps = {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
};

/** Placeholder page body for menu items whose screens are not built yet. */
export function ComingSoon({ title, breadcrumbs = [{ label: title }] }: ComingSoonProps) {
  return (
    <>
      <PageHeader title={title} breadcrumbs={breadcrumbs} />
      <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
        <Construction className="size-10 text-primary-500" aria-hidden />
        <h2 className="text-subtitle">{title} is coming soon</h2>
        <p className="max-w-md text-label font-normal text-muted">This page has not been built yet.</p>
      </Card>
    </>
  );
}

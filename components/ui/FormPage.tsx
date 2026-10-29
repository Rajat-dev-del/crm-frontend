import Link from "next/link";
import { X } from "lucide-react";
import { Card } from "@/components/ui/Card";

type FormPageProps = {
  title: string;
  /** Where the close button goes, usually the list page. */
  backHref: string;
  children: React.ReactNode;
};

/** Full-page card for "Add …" forms: accent-bar title, close button, form below. */
export function FormPage({ title, backHref, children }: FormPageProps) {
  return (
    <Card className="p-5 sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-line pb-5">
        <h1 className="border-l-4 border-primary-500 pl-3 text-display">{title}</h1>
        <Link
          href={backHref}
          aria-label="Close"
          className="flex size-10 items-center justify-center rounded-lg border border-line text-body hover:bg-surface-muted hover:text-heading"
        >
          <X className="size-5" aria-hidden />
        </Link>
      </div>
      {children}
    </Card>
  );
}

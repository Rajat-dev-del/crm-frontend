import Link from "next/link";
import { ChevronRight, House } from "lucide-react";

type Breadcrumb = { label: string; href?: string };

type PageHeaderProps = {
  title: string;
  /** Small colored label above the title, e.g. "Pipeline management". */
  eyebrow?: string;
  description?: string;
  /** Trail after the home icon; the last item is the current page. */
  breadcrumbs?: Breadcrumb[];
  /** Right-aligned buttons, e.g. "Add lead". */
  actions?: React.ReactNode;
};

export function PageHeader({ title, eyebrow, description, breadcrumbs = [], actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="mb-2 text-overline uppercase text-primary-600 dark:text-primary-400">{eyebrow}</p>}
        <h1 className="text-display">{title}</h1>
        {description && <p className="mt-1.5 text-label font-normal text-muted">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-label text-muted">
              <li>
                <Link href="/dashboard" aria-label="Home" className="flex hover:text-primary-600">
                  <House className="size-4" aria-hidden />
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => {
                const isCurrent = index === breadcrumbs.length - 1;
                return (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    <ChevronRight className="size-3.5" aria-hidden />
                    {crumb.href && !isCurrent ? (
                      <Link href={crumb.href} className="hover:text-primary-600">{crumb.label}</Link>
                    ) : (
                      <span aria-current={isCurrent ? "page" : undefined} className={isCurrent ? "text-heading" : undefined}>
                        {crumb.label}
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        )}
        {actions}
      </div>
    </div>
  );
}

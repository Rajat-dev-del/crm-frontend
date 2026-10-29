import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("rounded-card border border-line bg-surface shadow-card", className)} {...props} />;
}

type CardHeaderProps = Omit<React.ComponentProps<"div">, "title"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Right-aligned controls such as a filter select or button. */
  actions?: React.ReactNode;
};

export function CardHeader({ title, description, actions, className, ...props }: CardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 px-5 pt-5", className)} {...props}>
      <div className="min-w-0">
        <h2 className="text-subtitle">{title}</h2>
        {description && <p className="mt-1 text-caption text-muted">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("p-5", className)} {...props} />;
}

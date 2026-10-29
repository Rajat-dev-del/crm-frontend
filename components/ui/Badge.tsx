import { cn } from "@/lib/utils/cn";

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger" | "info";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-body",
  primary: "bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300",
  success: "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500",
  warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-500",
  danger: "bg-danger-50 text-danger-600 dark:bg-danger-500/15 dark:text-danger-500",
  info: "bg-info-50 text-info-600 dark:bg-info-500/15 dark:text-info-500",
};

type BadgeProps = React.ComponentProps<"span"> & { tone?: BadgeTone };

export function Badge({ tone = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-caption font-medium", tones[tone], className)}
      {...props}
    />
  );
}

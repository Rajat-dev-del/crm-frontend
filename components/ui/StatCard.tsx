import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Sparkline } from "@/components/ui/Sparkline";
import { cn } from "@/lib/utils/cn";

export type StatTone = "primary" | "success" | "warning" | "purple" | "pink" | "info";

export type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: StatTone;
  /** Change text such as "+200"; omit to hide the footer. */
  change?: string;
  /** "flat" renders "No change {period}". */
  changeDirection?: "up" | "down" | "flat";
  period?: string;
  trend?: number[];
};

// Full class names so Tailwind can find them at build time.
const tones: Record<StatTone, { icon: string; line: string; card: string }> = {
  primary: { icon: "bg-primary-500", line: "text-primary-500", card: "to-primary-50 dark:to-primary-500/10" },
  success: { icon: "bg-success-500", line: "text-success-500", card: "to-success-50 dark:to-success-500/10" },
  warning: { icon: "bg-warning-500", line: "text-warning-500", card: "to-warning-50 dark:to-warning-500/10" },
  purple: { icon: "bg-purple-500", line: "text-purple-500", card: "to-purple-50 dark:to-purple-500/10" },
  pink: { icon: "bg-pink-500", line: "text-pink-500", card: "to-pink-50 dark:to-pink-500/10" },
  info: { icon: "bg-info-500", line: "text-info-500", card: "to-info-50 dark:to-info-500/10" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "primary",
  change,
  changeDirection = "up",
  period = "this week",
  trend,
}: StatCardProps) {
  const styles = tones[tone];

  return (
    <section className={cn("@container rounded-card border border-line bg-linear-to-r from-surface p-4 shadow-card", styles.card)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className={cn("flex size-10 shrink-0 @[18rem]:size-11 items-center justify-center rounded-full text-white", styles.icon)}>
            <Icon className="size-5" aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-caption font-medium text-body">{label}</h3>
            <p className="truncate text-title font-semibold text-heading">{value}</p>
          </div>
        </div>
        {trend && (
          <div className="w-14 shrink-0 @[18rem]:w-24">
            <Sparkline data={trend} className={styles.line} />
          </div>
        )}
      </div>
      {change && changeDirection === "flat" && <p className="mt-3 text-caption text-body">No change {period}</p>}
      {change && changeDirection !== "flat" && (
        <p className="mt-3 text-caption text-body">
          {changeDirection === "up" ? "Increase" : "Decrease"} by{" "}
          <Badge tone={changeDirection === "up" ? "success" : "danger"}>{change}</Badge> {period}
        </p>
      )}
    </section>
  );
}

import { BadgeCheck, IndianRupee, UserPlus, Users } from "lucide-react";
import { StatCard, type StatCardProps } from "@/components/ui/StatCard";
import type { LeadMetric, LeadStats } from "@/features/leads/types";
import { formatRupeesCompact } from "@/lib/utils/format";

type CardConfig = Pick<StatCardProps, "label" | "icon" | "tone"> & {
  metric: keyof LeadStats;
  period: string;
  format?: (value: number) => string;
};

const cards: CardConfig[] = [
  { metric: "total", label: "Total leads", icon: Users, tone: "primary", period: "this week" },
  { metric: "newToday", label: "New today", icon: UserPlus, tone: "warning", period: "vs yesterday" },
  { metric: "pipelineValue", label: "Pipeline value", icon: IndianRupee, tone: "purple", period: "this week", format: formatRupeesCompact },
  { metric: "converted", label: "Converted leads", icon: BadgeCheck, tone: "success", period: "this week" },
];

const formatCount = (value: number) => value.toLocaleString("en-IN");

function changeProps(metric: LeadMetric, format: (value: number) => string) {
  if (metric.change === 0) return { change: "0", changeDirection: "flat" as const };
  return {
    change: `${metric.change > 0 ? "+" : "-"}${format(Math.abs(metric.change))}`,
    changeDirection: metric.change > 0 ? ("up" as const) : ("down" as const),
  };
}

export function LeadStatCards({ stats }: { stats: LeadStats | null }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ metric, format = formatCount, ...card }) => {
        const data = stats?.[metric];
        return (
          <StatCard
            key={metric}
            {...card}
            value={data ? format(data.value) : "—"}
            trend={data?.trend}
            {...(data ? changeProps(data, format) : {})}
          />
        );
      })}
    </div>
  );
}

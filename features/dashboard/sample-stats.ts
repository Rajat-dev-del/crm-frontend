import { BadgePercent, CircleDollarSign, Target, UserCheck, UserPlus, Users } from "lucide-react";
import type { StatCardProps } from "@/components/ui/StatCard";

/**
 * SAMPLE DATA for layout only. Replace with real fields and values from the API
 * once the dashboard metrics are defined.
 */
export const sampleStats: (StatCardProps & { id: string })[] = [
  { id: "new-users", label: "New Users", value: "15,000", icon: UserPlus, tone: "primary", change: "+200", trend: [8, 10, 9, 12, 10, 11, 9, 13, 11, 16] },
  { id: "active-users", label: "Active Users", value: "8,000", icon: UserCheck, tone: "success", change: "+200", trend: [9, 11, 10, 12, 10, 12, 11, 13, 11, 16] },
  { id: "total-sales", label: "Total Sales", value: "₹5,00,000", icon: BadgePercent, tone: "warning", change: "-₹10k", changeDirection: "down", trend: [9, 12, 10, 13, 11, 12, 10, 14, 11, 16] },
  { id: "conversion", label: "Conversion", value: "25%", icon: Target, tone: "purple", change: "+5%", trend: [10, 12, 9, 13, 11, 12, 10, 14, 11, 17] },
  { id: "leads", label: "Leads", value: "250", icon: Users, tone: "pink", change: "+20", trend: [10, 12, 9, 12, 10, 13, 10, 14, 11, 17] },
  { id: "total-profit", label: "Total Profit", value: "₹3,00,700", icon: CircleDollarSign, tone: "info", change: "+₹15k", trend: [9, 11, 10, 12, 9, 12, 10, 13, 11, 16] },
];

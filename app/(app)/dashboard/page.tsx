import type { Metadata } from "next";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { sampleStats } from "@/features/dashboard/sample-stats";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: "Dashboard" }]} />

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sampleStats.map(({ id, ...stat }) => (
            <StatCard key={id} {...stat} />
          ))}
        </div>

        <Card>
          <CardHeader title="Main section" description="Add the main chart or table here" />
          <CardBody>
            <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-line text-caption text-muted">
              Main widget
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}

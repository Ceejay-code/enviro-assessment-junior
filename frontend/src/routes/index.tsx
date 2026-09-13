import { createFileRoute } from "@tanstack/react-router";

import { DashboardView } from "@/components/dashboard-view";
import { useDashboardModel } from "@/lib/use-dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Investor Dashboard | Enviro365",
      },
      {
        name: "description",
        content:
          "Track portfolio value, withdrawal notices and approval status across savings and retirement products.",
      },
    ],
  }),

  component: Dashboard,
});

function Dashboard() {
  const { activeInvestor, investorNotices, loading, error, metrics } = useDashboardModel();

  return (
    <DashboardView
      investorName={`${activeInvestor.name} ${activeInvestor.surname}`.trim()}
      metrics={metrics}
      notices={investorNotices}
      loading={loading}
      error={error}
    />
  );
}

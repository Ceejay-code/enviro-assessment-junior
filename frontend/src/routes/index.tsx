import { createFileRoute } from "@tanstack/react-router";

import { Wallet, FileText, CheckCircle2, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "@/components/status-badge";

import { usePortal } from "@/lib/portal-store";

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

function zar(value: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);
}

function Dashboard() {
  const { activeInvestor, investorNotices, loading, error, dashboardSummary } = usePortal();

  const total = Number(dashboardSummary?.totalPortfolioValue ?? activeInvestor.products.reduce(
    (sum, product) => sum + Number(product.balance || 0),
    0,
  ));

  const totalNotices = Number(dashboardSummary?.totalWithdrawalNotices ?? investorNotices.length);

  const approved = Number(dashboardSummary?.approvedNotices ?? investorNotices.filter((notice) => notice.status === "APPROVED").length);

  const declined = Number(dashboardSummary?.declinedNotices ?? investorNotices.filter((notice) => notice.status === "DECLINED").length);

  const metrics = [
    {
      label: "Total Portfolio Value",
      value: zar(total),
      icon: Wallet,
      tone: "text-primary",
    },
    {
      label: "Total Withdrawal Notices",
      value: String(totalNotices),
      icon: FileText,
      tone: "text-primary",
    },
    {
      label: "Approved Notices",
      value: String(approved),
      icon: CheckCircle2,
      tone: "text-green-600",
    },
    {
      label: "Declined Notices",
      value: String(declined),
      icon: XCircle,
      tone: "text-red-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading investor data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview for {activeInvestor.name} {activeInvestor.surname}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <Card key={metric.label}>
              <CardContent className="flex items-start justify-between gap-4 pt-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {metric.label}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight">{metric.value}</p>
                </div>

                <Icon className={`size-5 ${metric.tone}`} />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>

                <TableHead>Date</TableHead>

                <TableHead>Product</TableHead>

                <TableHead className="text-right">Opening</TableHead>

                <TableHead className="text-right">Requested</TableHead>

                <TableHead className="text-right">Closing</TableHead>

                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {investorNotices.slice(0, 5).map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="text-muted-foreground">{notice.createdAt}</TableCell>

                  <TableCell>{notice.product?.name ?? "—"}</TableCell>

                  <TableCell className="text-right">
                    {zar(Number(notice.openingBalance || 0))}
                  </TableCell>

                  <TableCell className="text-right">{zar(Number(notice.amount || 0))}</TableCell>

                  <TableCell className="text-right">
                    {zar(Number(notice.closingBalance || 0))}
                  </TableCell>

                  <TableCell className="text-right">
                    <StatusBadge status={notice.status} />
                  </TableCell>
                </TableRow>
              ))}

              {investorNotices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    No withdrawal notices yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

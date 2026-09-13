import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type DashboardMetric } from "@/lib/use-dashboard";
import { zar } from "@/lib/utils";
import { type WithdrawalNotice } from "@/lib/portal-store";

interface DashboardViewProps {
  investorName: string;
  metrics: DashboardMetric[];
  notices: WithdrawalNotice[];
  loading: boolean;
  error: string | null;
}

export function DashboardView({
  investorName,
  metrics,
  notices,
  loading,
  error,
}: DashboardViewProps) {
  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="text-sm text-muted-foreground" role="status">
          Loading investor data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4" role="alert">
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
        <p className="mt-1 text-sm text-muted-foreground">Overview for {investorName}</p>
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
                <Icon className={`size-5 ${metric.tone}`} aria-hidden="true" />
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
              {notices.slice(0, 5).map((notice) => (
                <TableRow key={notice.id}>
                  <TableCell className="text-muted-foreground">{notice.createdAt}</TableCell>
                  <TableCell>{notice.product?.name ?? "-"}</TableCell>
                  <TableCell className="text-right">{zar(notice.openingBalance)}</TableCell>
                  <TableCell className="text-right">{zar(notice.amount)}</TableCell>
                  <TableCell className="text-right">{zar(notice.closingBalance)}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={notice.status} />
                  </TableCell>
                </TableRow>
              ))}
              {notices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
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

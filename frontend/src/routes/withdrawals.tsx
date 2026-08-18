import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/status-badge";
import { WithdrawalForm } from "@/components/withdrawal-form";
import { usePortal } from "@/lib/portal-store";
import { zar } from "@/lib/utils";

export const Route = createFileRoute("/withdrawals")({
  head: () => ({
    meta: [
      { title: "Withdrawal Notices | Enviro365" },
      {
        name: "description",
        content:
          "Submit withdrawal notices with live balance calculations and review the full notice history.",
      },
      { property: "og:title", content: "Withdrawal Notices | Enviro365" },
      {
        property: "og:description",
        content: "Submit and track withdrawal notices against savings and retirement products.",
      },
    ],
  }),
  component: Withdrawals,
});

function Withdrawals() {
  const { investorNotices, activeInvestor, investorProducts = [] } = usePortal();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Withdrawal Notices</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitting as {activeInvestor.name} {activeInvestor.surname}
          {activeInvestor.age ? ` (age ${activeInvestor.age})` : ""}.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Notice</CardTitle>
          <CardDescription>
            Retirement withdrawals require age over 65; no notice may exceed 90% of balance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WithdrawalForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notice History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Opening</TableHead>
                <TableHead className="text-right">Closing</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investorNotices.map((n) => {
                const productName =
                  n.product?.name ||
                  n.productName ||
                  investorProducts.find((p) => p.id === n.productId)?.name ||
                  n.productType ||
                  "Unknown Product";

                return (
                  <TableRow key={n.id}>
                    <TableCell className="text-muted-foreground">{n.createdAt}</TableCell>
                    <TableCell className="font-medium">{productName}</TableCell>
                    <TableCell className="text-right tabular-nums">{zar(n.openingBalance)}</TableCell>
                    <TableCell className="text-right tabular-nums">{zar(n.closingBalance)}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={n.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {investorNotices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    No notices submitted yet.
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
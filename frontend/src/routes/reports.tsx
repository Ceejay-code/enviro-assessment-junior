import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { zar } from "@/lib/utils";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports | Enviro365" },
      {
        name: "description",
        content:
          "Filter withdrawal notices by date range or product and export a notice statement as CSV.",
      },
      { property: "og:title", content: "Reports | Enviro365" },
      {
        property: "og:description",
        content: "Filterable withdrawal notice reporting and statement exports.",
      },
    ],
  }),
  component: Reports,
});

function Reports() {
  const { activeInvestor, investorNotices } = usePortal();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [productId, setProductId] = useState("ALL");

  const rows = useMemo(
    () =>
      investorNotices.filter((n) => {
        if (from && n.createdAt < from) return false;
        if (to && n.createdAt > to) return false;
        if (productId !== "ALL" && n.productId !== productId) return false;
        return true;
      }),
    [investorNotices, from, to, productId],
  );

  const download = () => {
    const header = "Notice,Date,Product ID,Product Type,Opening,Requested,Closing,Status";
    const body = rows
      .map((n) =>
        [
          n.id,
          n.createdAt,
          n.productId,
          n.productType,
          n.openingBalance,
          n.requestedAmount,
          n.closingBalance,
          n.status,
        ].join(","),
      )
      .join("\n");
    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notice-statement-${activeInvestor.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Notice statement downloaded");
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Export withdrawal notice statements.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Narrow notices by date range or product.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
          <div className="space-y-2">
            <Label htmlFor="filter-product">Product</Label>
            <Select value={productId} onValueChange={setProductId}>
              <SelectTrigger id="filter-product">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All products</SelectItem>
                {activeInvestor.products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={download} disabled={rows.length === 0}>
            <Download className="size-4" />
            Download Notice Statement
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Statement preview
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {rows.length} notice{rows.length === 1 ? "" : "s"}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Requested</TableHead>
                <TableHead className="text-right">Closing</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((n) => (
                <TableRow key={n.id}>
                  <TableCell className="text-muted-foreground">{n.createdAt}</TableCell>
                  <TableCell>{n.productType}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {zar(n.requestedAmount)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{zar(n.closingBalance)}</TableCell>
                  <TableCell className="text-right">
                    <StatusBadge status={n.status} />
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No notices match these filters.
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

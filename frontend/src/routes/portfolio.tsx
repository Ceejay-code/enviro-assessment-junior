import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, User, PlusCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WithdrawalForm } from "@/components/withdrawal-form";
import { usePortal } from "@/lib/portal-store";
import { zar } from "@/lib/utils";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "My Portfolio | Enviro365" },
      {
        name: "description",
        content:
          "View investor details, savings and retirement product balances, and start a withdrawal notice.",
      },
      { property: "og:title", content: "My Portfolio | Enviro365" },
      {
        property: "og:description",
        content: "Investor details and product balances in ZAR across savings and retirement.",
      },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const { activeInvestor } = usePortal();
  const [open, setOpen] = useState(false);
  const eligible = Boolean(activeInvestor.age && activeInvestor.age > 65);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Portfolio</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Holdings and eligibility for the active investor.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="size-4" />
              Create Withdrawal Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Withdrawal Notice</DialogTitle>
              <DialogDescription>
                Business rules are validated live before submission.
              </DialogDescription>
            </DialogHeader>
            <WithdrawalForm onSubmitted={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Investor Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Detail icon={User} label="Name" value={activeInvestor.name} />
          <Detail icon={User} label="Surname" value={activeInvestor.surname} />
          <Detail icon={Mail} label="Email" value={activeInvestor.email} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Age
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="tabular-nums">
                {activeInvestor.age} years
              </Badge>
              <Badge
                variant="outline"
                className={
                  eligible
                    ? "border-transparent bg-success/12 text-success"
                    : "border-transparent bg-destructive/12 text-destructive"
                }
              >
                {eligible ? "Retirement eligible" : "Retirement restricted"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Type</TableHead>
                <TableHead className="text-right">Current Balance</TableHead>
                <TableHead className="text-right">Max withdrawal (90%)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeInvestor.products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Badge variant={p.type === "RETIREMENT" ? "default" : "secondary"}>
                      {p.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{zar(p.balance)}</TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {zar(p.balance * 0.9)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1.5 flex items-center gap-2 text-sm font-medium">
        <Icon className="size-4 text-muted-foreground" />
        <span className="truncate">{value}</span>
      </p>
    </div>
  );
}

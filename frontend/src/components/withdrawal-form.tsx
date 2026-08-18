import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

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
import { usePortal } from "@/lib/portal-store";

function zar(value: number): string {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function WithdrawalForm({ onSubmitted }: { onSubmitted?: () => void }) {
  const { activeInvestor, submitNotice, validate } = usePortal();
  const [productId, setProductId] = useState(activeInvestor.products[0]?.id ?? "");
  const [amountText, setAmountText] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId && activeInvestor.products[0]) {
      setProductId(activeInvestor.products[0].id);
    }
  }, [activeInvestor.products, productId]);

  const product = activeInvestor.products.find((p) => p.id === productId);
  const amount = Number(amountText) || 0;
  const error = amountText ? validate(productId, amount) : null;
  const closing = product ? Math.max(product.balance - amount, 0) : 0;

  const handleSubmit = async () => {
    const validationError = validate(productId, amount);
    if (validationError) {
      setSubmitError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSubmitError(null);
      const notice = await submitNotice(productId, amount);
      toast.success(`Notice ${notice.id} created`, {
        description: `Requested amount ${zar(Number(notice.requestedAmount ?? notice.amount ?? 0))}`,
      });
      setAmountText("");
      onSubmitted?.();
    } catch (caughtError: any) {
      const message =
        caughtError?.response?.data?.message ||
        caughtError?.message ||
        "Withdrawal submission failed. Please try again.";
      setSubmitError(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product">Product</Label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger id="product">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {activeInvestor.products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name || p.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount">Withdrawal amount (ZAR)</Label>
          <Input
            id="amount"
            inputMode="decimal"
            placeholder="0.00"
            value={amountText}
            onChange={(e) => setAmountText(e.target.value.replace(/[^\d.]/g, ""))}
          />
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border bg-muted/40 p-4 sm:grid-cols-3">
        <Figure label="Opening balance" value={zar(product?.balance ?? 0)} />
        <Figure label="Requested amount" value={zar(amount)} />
        <Figure label="New closing balance" value={zar(closing)} emphasis />
      </div>

      {(error || submitError) && (
        <p className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {error ?? submitError}
        </p>
      )}

      <Button onClick={handleSubmit} disabled={!product || amount <= 0} className="w-full sm:w-auto">
        Submit withdrawal notice
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}

function Figure({
  label,
  value,
  emphasis,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p
        className={`mt-1 font-semibold tabular-nums ${emphasis ? "text-lg text-primary" : "text-base"}`}
      >
        {value}
      </p>
    </div>
  );
}
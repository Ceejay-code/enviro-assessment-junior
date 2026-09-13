import { useMemo } from "react";
import { CheckCircle2, FileText, Wallet, XCircle, type LucideIcon } from "lucide-react";

import { usePortal } from "@/lib/portal-store";
import { zar } from "@/lib/utils";

const toSafeNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export interface DashboardMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
}

export const useDashboardModel = () => {
  const { activeInvestor, investorNotices, loading, error, dashboardSummary } = usePortal();

  return useMemo(() => {
    const total = toSafeNumber(
      dashboardSummary?.totalPortfolioValue,
      activeInvestor.products.reduce(
        (sum, product) => sum + toSafeNumber(product.balance),
        0,
      ),
    );
    const totalNotices = toSafeNumber(
      dashboardSummary?.totalWithdrawalNotices,
      investorNotices.length,
    );
    const approved = toSafeNumber(
      dashboardSummary?.approvedNotices,
      investorNotices.filter((notice) => notice.status === "APPROVED").length,
    );
    const declined = toSafeNumber(
      dashboardSummary?.declinedNotices,
      investorNotices.filter((notice) => notice.status === "DECLINED").length,
    );

    return {
      activeInvestor,
      investorNotices,
      loading,
      error,
      metrics: [
        { label: "Total Portfolio Value", value: zar(total), icon: Wallet, tone: "text-primary" },
        { label: "Total Withdrawal Notices", value: String(totalNotices), icon: FileText, tone: "text-primary" },
        { label: "Approved Notices", value: String(approved), icon: CheckCircle2, tone: "text-green-600" },
        { label: "Declined Notices", value: String(declined), icon: XCircle, tone: "text-red-600" },
      ] satisfies DashboardMetric[],
    };
  }, [activeInvestor, dashboardSummary, error, investorNotices, loading]);
};

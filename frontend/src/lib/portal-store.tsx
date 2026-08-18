import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { authService } from "@/lib/auth";
import {
  investorService,
  type DashboardSummaryDto,
  type Product,
  type Investor,
} from "@/lib/investorService";

export interface WithdrawalNotice {
  id: string;
  productId?: string;
  productType?: string;
  amount: number;
  requestedAmount?: number;
  openingBalance: number;
  closingBalance: number;
  status: "APPROVED" | "DECLINED" | "PENDING";
  createdAt: string;
  product?: Product;
}

interface ActiveInvestor {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  age?: number;
  products: Product[];
}

interface PortalContextType {
  investors: ActiveInvestor[];
  activeInvestor: ActiveInvestor;
  investorNotices: WithdrawalNotice[];
  dashboardSummary: DashboardSummaryDto | null;

  selectedInvestorId: string;
  setSelectedInvestorId: (id: string) => void;

  refreshTrigger: number;
  triggerRefresh: () => void;

  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  validate: (productId: string, amount: number) => string | null;
  submitNotice: (productId: string, amount: number) => Promise<WithdrawalNotice>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider = ({ children }: { children: ReactNode }) => {
  const user = authService.getUser();
  const [selectedInvestorId, setSelectedInvestorId] = useState<string>(
    user?.investorId ?? user?.userId ?? user?.id ?? "",
  );
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const resolvedInvestorId = selectedInvestorId || user?.investorId || user?.userId || user?.id || "";

  const [profile, setProfile] = useState<Investor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [investorNotices, setInvestorNotices] = useState<WithdrawalNotice[]>([]);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummaryDto | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const validate = (productId: string, amount: number): string | null => {
    const product = products.find((item) => item.id === productId);
    if (!product) {
      return "Please select a product first.";
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return "Withdrawal amount must be greater than zero.";
    }
    if (product.type === "RETIREMENT" && (profile?.age ?? 0) <= 65) {
      return "Retirement withdrawals require age over 65.";
    }
    if (amount > product.balance) {
      return "Withdrawal amount cannot exceed the available balance.";
    }
    if (amount > product.balance * 0.9) {
      return "Withdrawal amount cannot exceed 90% of the product balance.";
    }
    return null;
  };

  const submitNotice = async (productId: string, amount: number): Promise<WithdrawalNotice> => {
    const validationError = validate(productId, amount);
    if (validationError) {
      throw new Error(validationError);
    }

    const createdNotice = await investorService.submitWithdrawal({
      productId,
      amount,
    });
    await refreshData();

    const matchedProduct = products.find((product) => product.id === productId) ?? createdNotice.product;

    return {
      ...createdNotice,
      requestedAmount: createdNotice.requestedAmount ?? createdNotice.amount ?? amount,
      amount: createdNotice.amount ?? createdNotice.requestedAmount ?? amount,
      productId: createdNotice.product?.id ?? createdNotice.productId ?? productId,
      productType: createdNotice.product?.type ?? createdNotice.productType ?? matchedProduct?.type ?? "UNKNOWN",
      status: (createdNotice.status ?? "PENDING").toUpperCase() as WithdrawalNotice["status"],
      product: matchedProduct,
    };
  };

  const refreshData = async () => {
    const currentUser = authService.getUser();
    const investorId = resolvedInvestorId || currentUser?.investorId || currentUser?.userId || currentUser?.id;

    if (!authService.isAuthenticated()) {
      setProducts([]);
      setInvestorNotices([]);
      setProfile(null);
      setDashboardSummary(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const dashboardPromise = investorService.getDashboardSummary(investorId);
      const investorProfilePromise = investorId ? investorService.getInvestorProfile(investorId) : Promise.resolve(null);
      const investorProductsPromise = investorId ? investorService.getProductsByInvestor(investorId) : Promise.resolve([]);
      const withdrawalPromise = investorId ? investorService.getWithdrawalsByInvestor(investorId) : Promise.resolve([]);

      const [investorProfile, investorProducts, withdrawalNotices, dashboard] = await Promise.all([
        investorProfilePromise,
        investorProductsPromise,
        withdrawalPromise,
        dashboardPromise,
      ]);

      const normalizedProducts = Array.isArray(investorProducts) ? investorProducts : [];
      const normalizedWithdrawals = Array.isArray(withdrawalNotices)
        ? withdrawalNotices.map((notice) => {
          const matchedProduct = notice.product ?? normalizedProducts.find((product) => product.id === notice.productId);
          const amount = Number(notice.amount ?? notice.requestedAmount ?? 0);

          return {
            ...notice,
            id: notice.id,
            productId: matchedProduct?.id ?? notice.productId ?? "",
            productType: matchedProduct?.type ?? notice.productType ?? "UNKNOWN",
            amount,
            requestedAmount: notice.requestedAmount ?? amount,
            openingBalance: Number(notice.openingBalance ?? 0),
            closingBalance: Number(notice.closingBalance ?? 0),
            status: (notice.status ?? "PENDING").toUpperCase() as WithdrawalNotice["status"],
            product: matchedProduct,
          };
        })
        : [];

      normalizedWithdrawals.sort((a, b) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      setProfile(investorProfile);
      setProducts(normalizedProducts);
      setInvestorNotices(normalizedWithdrawals);
      setDashboardSummary(dashboard ?? null);
    } catch (fetchError: any) {
      console.error("Failed to load investor data:", fetchError);
      setError(fetchError?.response?.data?.message || fetchError?.message || "Failed to load investor data.");
      setProducts([]);
      setInvestorNotices([]);
      setDashboardSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resolvedInvestorId && !selectedInvestorId) {
      setSelectedInvestorId(resolvedInvestorId);
    }
  }, [resolvedInvestorId, selectedInvestorId]);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      setLoading(false);
      setProducts([]);
      setInvestorNotices([]);
      setProfile(null);
      setDashboardSummary(null);
      return;
    }

    refreshData();
  }, [refreshTrigger, selectedInvestorId, user?.id, user?.investorId, user?.userId]);

  const investors = useMemo<ActiveInvestor[]>(() => {
    if (!profile && user) {
      return [
        {
          id: selectedInvestorId || user.investorId || user.userId || user.id || "",
          name: user.name ?? "",
          surname: user.surname ?? "",
          email: user.email ?? "",
          role: user.role ?? "",
          age: user.age,
          products,
        },
      ];
    }

    if (!profile) {
      return [];
    }

    return [
      {
        id: profile.id || selectedInvestorId,
        name: profile.name ?? "",
        surname: profile.surname ?? "",
        email: profile.email ?? "",
        role: user?.role ?? "",
        age: profile.age,
        products,
      },
    ];
  }, [profile, products, selectedInvestorId, user]);

  const activeInvestor: ActiveInvestor = {
    id: profile?.id || selectedInvestorId || user?.investorId || user?.userId || user?.id || "",
    name: profile?.name ?? user?.name ?? "",
    surname: profile?.surname ?? user?.surname ?? "",
    email: profile?.email ?? user?.email ?? "",
    role: profile?.role ?? user?.role ?? "",
    age: profile?.age ?? user?.age,
    products,
  };

  return (
    <PortalContext.Provider
      value={{
        investors,
        activeInvestor,
        investorNotices,
        dashboardSummary,

        selectedInvestorId,
        setSelectedInvestorId,

        refreshTrigger,
        triggerRefresh,

        loading,
        error,
        refreshData,
        validate,
        submitNotice,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = (): PortalContextType => {
  const context = useContext(PortalContext);

  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }

  return context;
};
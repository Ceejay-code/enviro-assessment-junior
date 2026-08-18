import { api } from "./api";

export interface Product {
  id: string;
  name: string;
  type: "SAVINGS" | "RETIREMENT";
  balance: number;
  openingBalance?: number;
}

export interface Investor {
  id: string;
  userId?: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  age?: number;
  role?: string;
  products?: Product[];
}

export interface WithdrawalNoticeRequest {
  productId: string;
  amount: number;
}

export interface WithdrawalNoticeResponse {
  id: string;
  productId?: string;
  productName?: string;
  productType?: string;
  amount: number;
  requestedAmount?: number;
  openingBalance: number;
  closingBalance: number;
  status: "APPROVED" | "DECLINED" | "PENDING";
  createdAt: string;
  product?: Product;
}

export interface DashboardSummaryDto {
  userId: string;
  totalPortfolioValue: number;
  totalWithdrawalNotices: number;
  approvedNotices: number;
  declinedNotices: number;
}

const unwrap = <T>(payload: any): T => {
  if (!payload) return payload;

  if (Array.isArray(payload)) {
    return payload as T;
  }

  if (
    payload.data !== undefined &&
    payload.data !== null &&
    (typeof payload.data === "object" || Array.isArray(payload.data))
  ) {
    return unwrap<T>(payload.data);
  }

  if (payload.items !== undefined && payload.items !== null) {
    return unwrap<T>(payload.items);
  }

  return payload as T;
};

const normalizeInvestor = (payload: any, fallbackId?: string): Investor => {
  const portfolio = unwrap<any>(payload);

  const products = (portfolio?.products ?? portfolio?.items ?? []) as Product[];

  return {
    id: portfolio?.id ?? portfolio?.userId ?? fallbackId ?? "",
    userId: portfolio?.userId ?? portfolio?.id ?? fallbackId,
    name: portfolio?.name ?? "",
    surname: portfolio?.surname ?? "",
    email: portfolio?.email ?? "",
    age: portfolio?.age ?? undefined,
    role: portfolio?.role,
    products,
  };
};

export const investorService = {
  getInvestorPortfolio: async (investorId: string): Promise<Investor> => {
    const routes = ["/investor/portfolio"];

    let lastError: unknown;

    for (const route of routes) {
      try {
        const response = await api.get<any>(route);
        const payload = unwrap<any>(response.data);

        if (
          payload &&
          (payload.products || payload.items || payload.name || payload.id || payload.userId)
        ) {
          return normalizeInvestor(payload, investorId);
        }
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("Investor portfolio not found.");
  },

  getInvestorProfile: async (investorId: string): Promise<Investor> => {
    return investorService.getInvestorPortfolio(investorId);
  },

  getAllInvestors: async (): Promise<Investor[]> => {
    const response = await api.get<any>("/investors");
    return unwrap<Investor[]>(response.data);
  },

  getProductsByInvestor: async (investorId: string): Promise<Product[]> => {
    const portfolio = await investorService.getInvestorPortfolio(investorId);
    return portfolio.products ?? [];
  },

  submitWithdrawal: async (payload: WithdrawalNoticeRequest): Promise<WithdrawalNoticeResponse> => {
    const response = await api.post<any>("/investor/withdrawals", {
      productId: payload.productId,
      amount: payload.amount,
    });
    return unwrap<WithdrawalNoticeResponse>(response.data);
  },

  getWithdrawalsByInvestor: async (investorId: string): Promise<WithdrawalNoticeResponse[]> => {
    try {
      const portfolio = await investorService.getInvestorPortfolio(investorId);
      const productIds = (portfolio.products ?? []).map((product) => product.id).filter(Boolean);

      if (productIds.length === 0) {
        return [];
      }

      const batches = await Promise.all(
        productIds.map(async (productId) => {
          try {
            const response = await api.get<any>(`/investor/withdrawals/product/${productId}`);
            const data = unwrap<any>(response.data);

            if (Array.isArray(data)) return data as WithdrawalNoticeResponse[];
            if (Array.isArray(data?.items)) return data.items as WithdrawalNoticeResponse[];
            if (Array.isArray(data?.data)) return data.data as WithdrawalNoticeResponse[];
            return [] as WithdrawalNoticeResponse[];
          } catch {
            return [] as WithdrawalNoticeResponse[];
          }
        }),
      );

      return batches.flat();
    } catch {
      return [];
    }
  },

  getDashboardSummary: async (): Promise<DashboardSummaryDto> => {
    const routes = ["/investor/dashboard"];

    let lastError: unknown;

    for (const route of routes) {
      try {
        const response = await api.get<any>(route);
        const payload = unwrap<DashboardSummaryDto>(response.data);

        if (
          payload &&
          typeof payload === "object" &&
          ("totalPortfolioValue" in payload ||
            "totalWithdrawalNotices" in payload ||
            "approvedNotices" in payload ||
            "declinedNotices" in payload)
        ) {
          return payload;
        }
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("Dashboard summary not found.");
  },
};

import api from "@/lib/api";

export interface Product {
  id: string;
  name: string;
  type: "RETIREMENT" | "SAVINGS";
  balance: number;
}

export interface WithdrawalNotice {
  id: string;
  amount: number;
  openingBalance: number;
  closingBalance: number;
  requestedAmount?: number;
  productType?: string;
  status: "APPROVED" | "DECLINED" | "PENDING";
  createdAt: string;
  product?: Product;
}

export interface Investor {
  id: string;
  name: string;
  surname: string;
  age?: number;
  email: string;
  products: Product[];
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

export const getInvestorProducts = async (): Promise<Product[]> => {
  const response = await api.get<ApiResponse<{ products: Product[] }>>("/investor/portfolio");

  return response.data.data.products ?? [];
};

export const getWithdrawalHistory = async (productId: string): Promise<WithdrawalNotice[]> => {
  const response = await api.get<ApiResponse<WithdrawalNotice[]>>(
    `/investor/withdrawals/product/${productId}`,
  );

  return response.data.data;
};

export const createWithdrawal = async (
  productId: string,
  amount: number,
): Promise<WithdrawalNotice> => {
  const response = await api.post<ApiResponse<WithdrawalNotice>>("/investor/withdrawals", {
    productId,
    amount,
  });

  return response.data.data;
};

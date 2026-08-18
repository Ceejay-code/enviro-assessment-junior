import api from "@/lib/api";
import { saveAuth } from "@/lib/auth";
import type { LoginResponse, AuthData } from "@/types/auth";

export interface LoginRequest {
  username: string;
  password: string;
}

export const login = async (request: LoginRequest): Promise<AuthData> => {
  const response = await api.post<LoginResponse>("/auth/login", request);

  const authData = "data" in response.data && response.data.data ? response.data.data : response.data;

  saveAuth(authData);

  return authData;
};

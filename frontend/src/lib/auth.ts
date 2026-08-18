import { api } from "./api";

export interface LoginCredentials {
  username?: string;
  password?: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: string | undefined;
  userId?: string | undefined;
  username?: string | undefined;
  name?: string | undefined;
  surname?: string | undefined;
  email?: string | undefined;
  role?: string | undefined;
}

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return null;
};

const readString = (value: unknown): string | undefined => {
  return typeof value === "string" && value.trim() ? value : undefined;
};

const getStorageItem = (key: string): string | null => {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStorageItem = (key: string, value: string): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error("Failed to write to localStorage:", e);
    }
  }
};

const removeStorageItem = (key: string): void => {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error("Failed to remove from localStorage:", e);
    }
  }
};

const normalizeAuthPayload = (data: unknown): AuthResponse | null => {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const accessToken = readString(record["accessToken"]);

  if (!accessToken) return null;

  return {
    accessToken,
    tokenType: readString(record["tokenType"]),
    userId: readString(record["userId"]),
    username: readString(record["username"]),
    name: readString(record["name"]),
    surname: readString(record["surname"]),
    email: readString(record["email"]),
    role: readString(record["role"]),
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<{ data: AuthResponse; message?: string }>(
      "/auth/login",
      credentials,
    );
    const payload = response?.data?.data ?? response?.data;
    const normalized = normalizeAuthPayload(payload);

    if (!normalized) {
      throw new Error("Login response did not include accessToken");
    }

    setStorageItem("accessToken", normalized.accessToken);
    setStorageItem(
      "user_info",
      JSON.stringify({
        accessToken: normalized.accessToken,
        tokenType: normalized.tokenType,
        userId: normalized.userId,
        username: normalized.username,
        name: normalized.name,
        surname: normalized.surname,
        email: normalized.email,
        role: normalized.role,
      }),
    );

    return normalized;
  },

  logout(): void {
    removeStorageItem("accessToken");
    removeStorageItem("user_info");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  getToken(): string | null {
    const token = getStorageItem("accessToken");
    if (!token || token === "undefined" || token === "null") return null;
    return token;
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  },

  getCurrentUser(): AuthResponse | null {
    const user = getStorageItem("user_info");
    if (!user) return null;

    try {
      return normalizeAuthPayload(JSON.parse(user));
    } catch {
      return null;
    }
  },

  getUser(): AuthResponse | null {
    return this.getCurrentUser();
  },
};

export const saveAuth = (data: unknown): void => {
  const normalized = normalizeAuthPayload(data);
  if (!normalized) return;

  setStorageItem("accessToken", normalized.accessToken);
  setStorageItem(
    "user_info",
    JSON.stringify({
      accessToken: normalized.accessToken,
      tokenType: normalized.tokenType,
      userId: normalized.userId,
      username: normalized.username,
      name: normalized.name,
      surname: normalized.surname,
      email: normalized.email,
      role: normalized.role,
    }),
  );
};

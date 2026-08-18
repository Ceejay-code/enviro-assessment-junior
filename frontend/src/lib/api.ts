import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;

  try {
    const directToken = localStorage.getItem("accessToken")?.trim();
    if (directToken && directToken !== "undefined" && directToken !== "null") {
      return directToken;
    }
  } catch {
    // ignore storage access errors
  }

  try {
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) return null;

    const parsed = JSON.parse(userInfo);
    const token = parsed?.accessToken ?? parsed?.data?.accessToken;

    if (token && token !== "undefined" && token !== "null") {
      return String(token).trim();
    }
  } catch {
    // ignore malformed user_info payloads
  }

  return null;
};

const clearAuthStorage = (): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user_info");
  } catch {
    // ignore cleanup errors
  }
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Attach JWT token safely on client side
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers = config.headers ?? {};

      if (typeof (config.headers as any).set === "function") {
        (config.headers as any).set("Authorization", `Bearer ${token}`);
      } else {
        (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle 401 Unauthenticated redirects
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        try {
          clearAuthStorage();
          window.location.href = "/login";
        } catch (err) {
          console.error("Error clearing storage on 401", err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
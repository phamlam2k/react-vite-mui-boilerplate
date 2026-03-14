import axios, { type InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const COOKIE_ACCESS = "access_token";
const COOKIE_REFRESH = "refresh_token";
const REFRESH_ENDPOINT = "/auth/refresh-token";
const DEFAULT_REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

function getCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find(row => row.startsWith(`${name}=`));
  return match
    ? decodeURIComponent(match.split("=").slice(1).join("=").trim())
    : null;
}

function setCookie(
  name: string,
  value: string,
  maxAgeSeconds: number = DEFAULT_REFRESH_MAX_AGE
) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; SameSite=Strict`;
}

export function getAccessToken(): string | null {
  return getCookie(COOKIE_ACCESS);
}

export function getRefreshToken(): string | null {
  return getCookie(COOKIE_REFRESH);
}

/** Call after login or after refresh-token response to persist tokens. */
export function setAuthTokens(
  accessToken: string,
  refreshToken: string,
  accessTokenExpiresInSeconds?: number
) {
  setCookie(COOKIE_ACCESS, accessToken, accessTokenExpiresInSeconds ?? 60 * 15); // default 15 min
  setCookie(COOKIE_REFRESH, refreshToken);
}

/** Clear access and refresh token cookies (e.g. on logout or when refresh fails). */
export function clearAuthTokens() {
  document.cookie = `${COOKIE_ACCESS}=; path=/; max-age=0`;
  document.cookie = `${COOKIE_REFRESH}=; path=/; max-age=0`;
}

// --- Request interceptor: attach access token (skip for refresh-token request)
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const skipAuth = (
    config as InternalAxiosRequestConfig & { _skipAuth?: boolean }
  )._skipAuth;
  if (skipAuth) return config;

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: on 401, try refresh then retry once
let refreshPromise: Promise<{
  accessToken: string;
  refreshToken: string;
} | null> | null = null;

async function doRefresh(): Promise<{
  accessToken: string;
  refreshToken: string;
} | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const { data } = await axiosInstance.post<{
      tokens: { accessToken: string; refreshToken: string; expiresIn?: number };
    }>(REFRESH_ENDPOINT, { refreshToken }, {
      _skipAuth: true,
    } as unknown as InternalAxiosRequestConfig);
    const {
      accessToken,
      refreshToken: newRefresh,
      expiresIn,
    } = data.tokens ?? {};
    if (!accessToken || !newRefresh) return null;
    setAuthTokens(accessToken, newRefresh, expiresIn);
    return { accessToken, refreshToken: newRefresh };
  } catch {
    clearAuthTokens();
    return null;
  } finally {
    refreshPromise = null;
  }
}

function isRefreshRequest(config: InternalAxiosRequestConfig): boolean {
  return (
    (config.url?.includes(REFRESH_ENDPOINT) ?? false) ||
    !!(config as InternalAxiosRequestConfig & { _skipAuth?: boolean })._skipAuth
  );
}

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };
    if (!config || error.response?.status !== 401) return Promise.reject(error);
    if (isRefreshRequest(config) || config._retried)
      return Promise.reject(error);

    refreshPromise = refreshPromise ?? doRefresh();
    const tokens = await refreshPromise;
    if (!tokens) return Promise.reject(error);

    config.headers.Authorization = `Bearer ${tokens.accessToken}`;
    config._retried = true;
    return axiosInstance.request(config);
  }
);

export default axiosInstance;

import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import type { RefreshResponse } from "../types/auth.types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const REFRESH_ENDPOINT = "/api/auth/refresh";
const LOGIN_ENDPOINT = "/api/auth/login";

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

function isTokenExpired(token: string): boolean {
    try {
        const payloadBase64 = token.split(".")[1];
        if (!payloadBase64) {
            return true;
        }

        const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
        const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
        const decoded = JSON.parse(atob(padded)) as { exp?: number };
        if (typeof decoded.exp !== "number") {
            return true;
        }

        const nowSeconds = Math.floor(Date.now() / 1000);
        return decoded.exp <= nowSeconds;
    } catch {
        return true;
    }
}

api.interceptors.request.use(async (config) => {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
        return config;
    }

    const requestUrl = config.url ?? "";
    const isAuthRequest = requestUrl.includes(LOGIN_ENDPOINT) || requestUrl.includes(REFRESH_ENDPOINT);
    if (!isAuthRequest && isTokenExpired(token)) {
        const refreshedToken = await refreshAccessToken();
        if (!refreshedToken) {
            handleAuthFailure(requestUrl);
            return config;
        }

        localStorage.setItem(ACCESS_TOKEN_KEY, refreshedToken);
        token = refreshedToken;
    }

    const updatedHeaders = config.headers ?? {};
    updatedHeaders.Authorization = `Bearer ${token}`;
    config.headers = updatedHeaders;
    return config;
});

function extractAccessToken(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    const data = payload as Record<string, unknown>;
    const candidates = [data.accessToken, data.token, data.jwt, data.authToken];
    const token = candidates.find((value) => typeof value === "string" && value.trim().length > 0);
    return typeof token === "string" ? token : null;
}

function extractRefreshToken(payload: unknown): string | null {
    if (!payload || typeof payload !== "object") {
        return null;
    }

    const data = payload as Record<string, unknown>;
    const token = data.refreshToken;
    return typeof token === "string" && token.trim().length > 0 ? token : null;
}

async function refreshAccessToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
        return null;
    }

    const refreshUrl = `${import.meta.env.VITE_API_BASE_URL}${REFRESH_ENDPOINT}`;
    const response = await axios.post<RefreshResponse>(refreshUrl, { refreshToken }, { withCredentials: true });
    const newAccessToken = extractAccessToken(response.data);
    if (!newAccessToken) {
        return null;
    }

    const newRefreshToken = extractRefreshToken(response.data);
    if (newRefreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    }

    return newAccessToken;
}

function handleAuthFailure(url?: string) {
    const requestUrl = url ?? "";
    const isAdminApiRequest = requestUrl.includes("/api/admin/");
    if (!isAdminApiRequest) {
        return;
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.location.href = "/admin/login";
}

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const statusCode = error.response?.status;

        if (!originalRequest || statusCode !== 401) {
            return Promise.reject(error);
        }

        const requestUrl = originalRequest.url ?? "";
        if (requestUrl.includes(LOGIN_ENDPOINT)) {
            return Promise.reject(error);
        }

        if (originalRequest._retry || requestUrl.includes(REFRESH_ENDPOINT)) {
            handleAuthFailure(requestUrl);
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const newAccessToken = await refreshAccessToken();
            if (!newAccessToken) {
                handleAuthFailure(requestUrl);
                return Promise.reject(error);
            }

            localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

            const updatedHeaders = originalRequest.headers ?? {};
            updatedHeaders.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers = updatedHeaders;

            return api(originalRequest);
        } catch (refreshError) {
            handleAuthFailure(requestUrl);
            return Promise.reject(refreshError);
        }
    },
);

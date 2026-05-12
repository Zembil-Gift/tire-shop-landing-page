import { api } from "./api";
import type { LoginPayload, LoginResponse } from "../types/auth.types";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

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

export async function loginAdmin(payload: LoginPayload): Promise<void> {
    const response = await api.post<LoginResponse>("/api/auth/login", payload);
    const accessToken = extractAccessToken(response.data);
    if (!accessToken) {
        throw new Error("Login response did not include an access token.");
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    const refreshToken = extractRefreshToken(response.data);
    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    } else {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
}

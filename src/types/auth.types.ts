export type LoginPayload = {
    email: string;
    password: string;
};

export type AuthTokenResponse = {
    accessToken?: string;
    token?: string;
    jwt?: string;
    authToken?: string;
    refreshToken?: string;
    email?: string;
};

export type LoginResponse = AuthTokenResponse;

export type RefreshResponse = AuthTokenResponse;

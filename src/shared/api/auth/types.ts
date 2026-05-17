// src/shared/api/auth/types.ts

import type { ApiResponse } from "@/shared/api/types";

export interface ApiErrorResponse {
    status: "error";
    errors: Record<string, string[]>;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export type LoginResponse = ApiResponse<AuthTokens>;
export type RegisterResponse = ApiResponse<AuthTokens>;

export interface RefreshResponse {
    access: string;
    refresh: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    avatar?: File;
}

export interface LoginRequest {
    email: string;
    password: string;
}
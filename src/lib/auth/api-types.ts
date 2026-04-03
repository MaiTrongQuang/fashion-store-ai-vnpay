/** Payload an toàn trả về client (không gửi access/refresh token) */
export type AuthUserPayload = {
    id: string;
    email: string | undefined;
    user_metadata: Record<string, unknown>;
};

export type AuthSessionPayload = {
    expires_at: number | null;
    expires_in: number | null;
};

export type LoginSuccessResponse = {
    user: AuthUserPayload;
    session: AuthSessionPayload;
};

export type RegisterSuccessResponse = {
    user: AuthUserPayload | null;
    session: AuthSessionPayload | null;
    needsEmailConfirmation: boolean;
};

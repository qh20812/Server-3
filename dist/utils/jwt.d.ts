export type AccessTokenPayload = {
    sub: string;
    role: "customer" | "admin";
};
export type RefreshTokenPayload = {
    sub: string;
    jti: string;
};
export declare function signAccessToken(payload: AccessTokenPayload): string;
export declare function signRefreshToken(payload: RefreshTokenPayload): string;
export declare function verifyAccessToken(token: string): AccessTokenPayload;
export declare function verifyRefreshToken(token: string): RefreshTokenPayload;
export declare function generateTokenPair(sub: string, role: AccessTokenPayload["role"]): {
    accessToken: string;
    refreshToken: string;
    jti: `${string}-${string}-${string}-${string}-${string}`;
};
export declare function decodeAccessToken(token: string): AccessTokenPayload | null;
//# sourceMappingURL=jwt.d.ts.map
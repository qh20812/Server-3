export type RefreshTokenDoc = {
    token: string;
    userId: string;
    expiresAt: Date;
    issuedAt: Date;
    revokedAt?: Date;
    replaceByTokenId?: string;
    userAgent?: string;
    ip?: string;
};
//# sourceMappingURL=auth.model.d.ts.map
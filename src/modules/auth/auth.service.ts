import { env } from "../../configs/env.js";
import { ApiError } from "../../utils/api-error.js";
import { verifyPassword } from "../../utils/crypto.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";
import type { UserDatabase } from "../user/user.database.js";
import type { AuthDatabase } from "./auth.database.js";
import type { RefreshTokenDoc } from "./auth.model.js";
import { randomUUID } from "crypto";

function randomTokenId(): string {
  return randomUUID();
}

export class AuthService {
  constructor(
    private readonly userDb: UserDatabase,
    private readonly authDb: AuthDatabase
  ) {}
  async login(input: {
    email: string;
    password: string;
    userAgent?: string;
    ip?: string;
  }) {
    const email = input.email.trim().toLowerCase();
    const user = await this.userDb.findByEmail(email);
    if (!user) {
      throw ApiError.unauthorized("Email không tồn tại.");
    }
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) {
      throw ApiError.unauthorized("Mật khẩu không đúng.");
    }

    const accessToken = signAccessToken({
      sub: user._id.toString(),
      role: user.role,
    });
    const tokenId = randomTokenId();
    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + env.refreshTokenTtlSeconds * 1000
    );
    const doc: RefreshTokenDoc = {
      userId: user._id.toString(),
      token: tokenId,
      issuedAt: now,
      expiresAt,
      ...(input.userAgent !== undefined ? { userAgent: input.userAgent } : {}),
      ...(input.ip !== undefined ? { ip: input.ip } : {}),
    };
    await this.authDb.create(doc);
    const refreshToken = signRefreshToken({
      sub: user._id.toString(),
      jti: tokenId,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async refresh(
    token: string,
    opts?: { userAgent?: string | string[] | undefined; ip?: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = (await import("../../utils/jwt.js")).verifyRefreshToken(token);
      const active = await this.authDb.findActiveByToken(payload.jti);
      if (!active) throw ApiError.unauthorized("Invalid or expired refresh token");
      const user = await this.userDb.findById(payload.sub);
      if (!user) throw ApiError.unauthorized("User not found");

      const { accessToken, refreshToken: newRefreshToken, jti } = (await import("../../utils/jwt.js")).generateTokenPair(
        user._id.toString(),
        user.role
      );

      // revoke old token and persist new one
      await this.authDb.revoke(payload.jti, jti);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + env.refreshTokenTtlSeconds * 1000);
      const doc: RefreshTokenDoc = {
        userId: user._id.toString(),
        token: jti,
        issuedAt: now,
        expiresAt,
        ...(opts?.userAgent !== undefined ? { userAgent: String(opts.userAgent) } : {}),
        ...(opts?.ip !== undefined ? { ip: opts.ip } : {}),
      };
      await this.authDb.create(doc);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (e) {
      throw ApiError.unauthorized("Invalid refresh token");
    }
  }

  async logout(token: string): Promise<void> {
    try {
      const payload = (await import("../../utils/jwt.js")).verifyRefreshToken(token);
      await this.authDb.revoke(payload.jti);
    } catch (e) {
      // swallow error to make logout idempotent
    }
  }
}


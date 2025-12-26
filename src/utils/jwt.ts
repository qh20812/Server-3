import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../configs/env.js";

export type AccessTokenPayload = {
  sub: string;
  role: "customer" | "admin";
};
export type RefreshTokenPayload = {
  sub: string;
  jti: string;
};

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.jwtAccessSecret, {
    expiresIn: env.accessTokenTtlSeconds,
  });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenTtlSeconds,
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.jwtAccessSecret) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as RefreshTokenPayload;
}

export function generateTokenPair(sub: string, role: AccessTokenPayload["role"]) {
  const jti = randomUUID();
  const accessToken = signAccessToken({ sub, role });
  const refreshToken = signRefreshToken({ sub, jti });
  return {
    accessToken,
    refreshToken,
    jti,
  };
}

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  const decoded = jwt.decode(token);
  return (decoded as AccessTokenPayload) ?? null;
}

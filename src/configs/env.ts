import dotenv from "dotenv";

dotenv.config();

function required(key: string): string {
  const val = process.env[key];
  if (val === undefined || val === "") {
    throw new Error(`Environment variable ${key} is required`);
  }
  return val;
}

function numberEnv(key: string, defaultValue?: number): number {
  const val = process.env[key];
  if (val === undefined || val === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Environment variable ${key} is required and must be a number`);
  }

  const n = Number(val);
  if (Number.isNaN(n)) {
    throw new Error(`Environment variable ${key} must be a number, got "${val}"`);
  }

  return n;
}

const env = {
  nodeEnv: process.env.NODE_ENV,
  port: numberEnv("PORT", 9999),

  mongoUri: required("MONGODB_URI"),
  mongoDb: required("MONGODB_DB"),

  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),

  accessTokenTtlSeconds: numberEnv("ACCESS_TOKEN_TTL_SECONDS", 3600),
  refreshTokenTtlSeconds: numberEnv("REFRESH_TOKEN_TTL_SECONDS", 72000),
  refreshCookieName: process.env.REFRESH_COOKIE_NAME,
};

export { env };
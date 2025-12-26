import { env } from "../../configs/env.js";
import type { AuthService } from "./auth.service.js";
import type { Request, Response, NextFunction } from "express";
import { ApiError } from "../../utils/api-error.js";

function cookieName(): string {
  return env.refreshCookieName ?? "refreshToken";
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(cookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.nodeEnv === "production",
    maxAge: env.refreshTokenTtlSeconds * 1000,
    path: "/api/auth",
  });
}
function clearRefreshCookie(res: Response) {
  res.clearCookie(cookieName(), { path: "/api/auth" });
}

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // POST /api/auth/login
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body || {};
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const input = {
        email,
        password,
        ...(userAgent !== undefined ? { userAgent } : {}),
        ...(ip !== undefined ? { ip } : {}),
      };
      const { accessToken, refreshToken } = await this.authService.login(input);
      setRefreshCookie(res, refreshToken);
      return res.json({ data: { accessToken, refreshToken } });
    } catch (err) {
      return next(err);
    }
  };

  // POST /api/auth/refresh
  refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenFromCookie = req.cookies?.[cookieName()];
      const tokenFromBody = req.body?.refreshToken;
      const refreshToken = tokenFromCookie ?? tokenFromBody;
      if (!refreshToken) throw ApiError.unauthorized("Refresh token required");
      const userAgent = req.headers["user-agent"];
      const ip = req.ip;
      const opts: { userAgent?: string | string[]; ip?: string } = {};
      if (userAgent !== undefined) opts.userAgent = userAgent;
      if (ip !== undefined) opts.ip = ip;
      const { accessToken, refreshToken: newRefreshToken } = await this.authService.refresh(
        refreshToken,
        opts
      );
      setRefreshCookie(res, newRefreshToken);
      return res.json({ data: { accessToken, refreshToken: newRefreshToken } });
    } catch (err) {
      return next(err);
    }
  };

  // POST /api/auth/logout
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenFromCookie = req.cookies?.[cookieName()];
      const tokenFromBody = req.body?.refreshToken;
      const refreshToken = tokenFromCookie ?? tokenFromBody;
      if (!refreshToken) {
        // still clear cookie and return 204
        clearRefreshCookie(res);
        return res.status(204).send();
      }
      await this.authService.logout(refreshToken);
      clearRefreshCookie(res);
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  };
}

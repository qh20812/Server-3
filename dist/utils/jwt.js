import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { env } from "../configs/env.js";
export function signAccessToken(payload) {
    return jwt.sign(payload, env.jwtAccessSecret, {
        expiresIn: env.accessTokenTtlSeconds,
    });
}
export function signRefreshToken(payload) {
    return jwt.sign(payload, env.jwtRefreshSecret, {
        expiresIn: env.refreshTokenTtlSeconds,
    });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, env.jwtAccessSecret);
}
export function verifyRefreshToken(token) {
    return jwt.verify(token, env.jwtRefreshSecret);
}
export function generateTokenPair(sub, role) {
    const jti = randomUUID();
    const accessToken = signAccessToken({ sub, role });
    const refreshToken = signRefreshToken({ sub, jti });
    return {
        accessToken,
        refreshToken,
        jti,
    };
}
export function decodeAccessToken(token) {
    const decoded = jwt.decode(token);
    return decoded ?? null;
}
//# sourceMappingURL=jwt.js.map
import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";
export function requireAuth(req, _res, next) {
    const header = req.headers.authorization;
    if (!header)
        return next(ApiError.unauthorized("Authorization header missing"));
    if (!header.startsWith("Bearer "))
        return next(ApiError.unauthorized("Malformed authorization header"));
    const token = header.slice("Bearer ".length).trim();
    try {
        const payload = verifyAccessToken(token);
        req.auth = { userId: payload.sub, role: payload.role };
        return next();
    }
    catch (err) {
        return next(ApiError.unauthorized("Invalid or expired token"));
    }
}
export function requireRole(roles) {
    const allowed = Array.isArray(roles) ? roles : [roles];
    return (req, _res, next) => {
        if (!req.auth)
            return next(ApiError.unauthorized("Unauthorized"));
        if (!allowed.includes(req.auth.role))
            return next(ApiError.forbidden("Forbidden"));
        return next();
    };
}
export const requireAdmin = requireRole("admin");
//# sourceMappingURL=auth.middleware.js.map
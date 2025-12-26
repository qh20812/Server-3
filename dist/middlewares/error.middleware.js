import { ApiError } from "../utils/api-error.js";
export function errorMiddleware(err, _req, res, _next) {
    // Operational error from our app
    if (err instanceof ApiError) {
        const e = err;
        const payload = { message: e.message };
        if (e.details)
            payload.details = e.details;
        return res.status(e.statusCode).json(payload);
    }
    // Mongoose / Mongo validation error
    // (mongoose validation errors have name "ValidationError")
    if (typeof err === "object" && err !== null && err.name === "ValidationError") {
        const e = err;
        const message = e.message || "Validation error";
        const details = e.errors || undefined;
        return res.status(400).json({ message, details });
    }
    // Mongo duplicate key error
    if (typeof err === "object" && err !== null && err.code === 11000) {
        // e.g. { code: 11000, keyValue: { email: '...' } }
        const e = err;
        return res.status(409).json({ message: "Duplicate key", details: e.keyValue || undefined });
    }
    // JWT errors from jsonwebtoken
    if (typeof err === "object" && err !== null && err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
    }
    if (typeof err === "object" && err !== null && err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
    }
    // Unknown error — log and respond
    // Show stack in development only
    // eslint-disable-next-line no-console
    console.error(err);
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
        // Try to include useful info when in development
        if (err instanceof Error) {
            return res.status(500).json({ message: err.message, stack: err.stack });
        }
        return res.status(500).json({ message: "Internal Server Error", error: err });
    }
    return res.status(500).json({ message: "Internal Server Error" });
}
//# sourceMappingURL=error.middleware.js.map
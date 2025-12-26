export class ApiError extends Error {
    statusCode;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        Object.setPrototypeOf(this, ApiError.prototype);
    }
    static badRequest(message = "Bad Request", details) {
        return new ApiError(400, message, details);
    }
    static unauthorized(message = "Unauthorized") {
        return new ApiError(401, message);
    }
    static notFound(message = "Not Found") {
        return new ApiError(404, message);
    }
    static conflict(message = "Conflict") {
        return new ApiError(409, message);
    }
    static internal(message = "Internal Server Error") {
        return new ApiError(500, message);
    }
    static forbidden(message = "Forbidden") {
        return new ApiError(403, message);
    }
}
//# sourceMappingURL=api-error.js.map
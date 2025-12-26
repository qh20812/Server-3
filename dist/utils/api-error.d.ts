export declare class ApiError extends Error {
    statusCode: number;
    details?: unknown;
    constructor(statusCode: number, message: string, details?: unknown);
    static badRequest(message?: string, details?: unknown): ApiError;
    static unauthorized(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static conflict(message?: string): ApiError;
    static internal(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
}
//# sourceMappingURL=api-error.d.ts.map
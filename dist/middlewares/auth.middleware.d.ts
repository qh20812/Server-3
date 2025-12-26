import type { Request, Response, NextFunction } from "express";
export type AuthUser = {
    userId: string;
    role: "customer" | "admin";
};
declare global {
    namespace Express {
        interface Request {
            auth?: AuthUser;
        }
    }
}
export declare function requireAuth(req: Request, _res: Response, next: NextFunction): void;
export declare function requireRole(roles: "customer" | "admin" | Array<"customer" | "admin" | string>): (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map
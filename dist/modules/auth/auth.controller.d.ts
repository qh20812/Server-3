import type { AuthService } from "./auth.service.js";
import type { Request, Response, NextFunction } from "express";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    refresh: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    logout: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=auth.controller.d.ts.map
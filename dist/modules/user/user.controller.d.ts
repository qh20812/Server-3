import type { Request, Response, NextFunction } from "express";
import type { UserService } from "./user.service.js";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    list: (_req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    create: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    register: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    getByEmail: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    updateById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
    deleteById: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
}
//# sourceMappingURL=user.controller.d.ts.map
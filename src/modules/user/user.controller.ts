import type { Request, Response, NextFunction } from "express";
import type { UserService } from "./user.service.js";
import { ApiError } from "../../utils/api-error.js";

export class UserController {
  constructor(private readonly userService: UserService) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.list();
      return res.json({ data: users });
    } catch (err) {
      return next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role } = req.body ?? {};
      if (!email || !password) throw ApiError.badRequest("email and password are required");
      const user = await this.userService.create({ email, password, role });
      return res.status(201).json({ data: user });
    } catch (err) {
      return next(err);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) throw ApiError.badRequest("id is required");
      const user = await this.userService.findById(id);
      if (!user) throw ApiError.notFound("User not found");
      return res.json({ data: user });
    } catch (err) {
      return next(err);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role } = req.body ?? {};
      if (!email || !password) throw ApiError.badRequest("email and password are required");
      await this.userService.register({ email, password, role });
      return res.status(201).json({ message: "User registered" });
    } catch (err) {
      return next(err);
    }
  };

  getByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.params;
      if (!email) throw ApiError.badRequest("email is required");
      const user = await this.userService.findByEmail(email);
      if (!user) throw ApiError.notFound("User not found");
      return res.json({ data: user });
    } catch (err) {
      return next(err);
    }
  };
}

import * as bcrypt from "bcrypt";
import { ApiError } from "../../utils/api-error.js";
import type { UserDatabase } from "./user.database.js";
import type { CreateUserInput, UserPublic, UserRole } from "./user.model.js";
import { toPublic } from "./user.model.js";

export class UserService {
  constructor(private readonly userDb: UserDatabase) {}

  async list(): Promise<UserPublic[]> {
    const users = await this.userDb.list();
    return users.map(toPublic);
  }

  async findById(id: string): Promise<UserPublic | null> {
    const user = await this.userDb.findById(id);
    return user ? toPublic(user) : null;
  }

  async findByEmail(email: string): Promise<UserPublic | null> {
    const user = await this.userDb.findByEmail(email);
    return user ? toPublic(user) : null;
  }

  async create(input: CreateUserInput): Promise<UserPublic> {
    const existing = await this.userDb.findByEmail(input.email);
    if (existing) throw ApiError.conflict("Email already in use");

    if (!input.password || input.password.length < 6) {
      throw ApiError.badRequest("Password must be at least 6 characters");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const role = input.role ?? "customer";

    const inserted = await this.userDb.create({
      email: input.email,
      passwordHash,
      role,
    } as any);

    return toPublic(inserted as any);
  }
  async register(input: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<void> {
    const email = input.email.trim().toLowerCase();
    if (!email.includes("@")) {
      throw ApiError.badRequest("Invalid email address");
    }
    const password = input.password;
    if (password.length < 6) {
      throw ApiError.badRequest("Password must be at least 6 characters");
    }
    // btvn: bắt lỗi ký tự đặt biệt & chữ viết hoa
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialCharPattern.test(password)) {
      throw ApiError.badRequest("Password must not contain special characters");
    }
    if (/[A-Z]/.test(password)) {
      throw ApiError.badRequest("Password must not contain uppercase letters");
    }
    // kiểm tra định dạng email hợp lệ
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw ApiError.badRequest("Invalid email format");
    }
    
  }
}

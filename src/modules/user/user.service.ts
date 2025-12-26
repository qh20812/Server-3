import * as bcrypt from "bcrypt";
import { ApiError } from "../../utils/api-error.js";
import type { UserDatabase } from "./user.database.js";
import type { CreateUserInput, UserPublic, UserRole, UserDoc } from "./user.model.js";
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
    const email = input.email.trim().toLowerCase();

    // basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) throw ApiError.badRequest("Invalid email format");

    const existing = await this.userDb.findByEmail(email);
    if (existing) throw ApiError.conflict("Email already in use");

    const password = input.password;
    if (!password) throw ApiError.badRequest("Password is required");
    this.validatePassword(password);

    const passwordHash = await bcrypt.hash(password, 10);
    const role = input.role ?? "customer";

    const inserted = await this.userDb.create({
      email,
      passwordHash,
      role,
    } as any);

    return toPublic(inserted as any);
  }

  async updateById(id: string, input: { email?: string; password?: string; role?: UserRole }): Promise<UserPublic> {
    const existing = await this.userDb.findById(id);
    if (!existing) throw ApiError.notFound("User not found");

    const updates: Partial<UserDoc> = {} as any;

    if (input.email) {
      const email = input.email.trim().toLowerCase();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) throw ApiError.badRequest("Invalid email format");
      const byEmail = await this.userDb.findByEmail(email);
      if (byEmail && String(byEmail._id) !== String((existing as any)._id)) {
        throw ApiError.conflict("Email already in use");
      }
      updates.email = email;
    }
    if (input.password) {
      const password = input.password;
      this.validatePassword(password);
      updates.passwordHash = await bcrypt.hash(password, 10);
    }

    if (input.role) updates.role = input.role;

    const updated = await this.userDb.updateById(id, updates as any);
    if (!updated) throw ApiError.notFound("User not found");
    return toPublic(updated as any);
  }

  private validatePassword(password: string) {
    if (!password || password.length < 6) throw ApiError.badRequest("Password must be at least 6 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character");
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharPattern.test(password)) throw ApiError.badRequest("Password must include at least one special character");
    if (!/[A-Z]/.test(password)) throw ApiError.badRequest("Password must include at least one uppercase letter");
    if (!/[a-z]/.test(password)) throw ApiError.badRequest("Password must include at least one lowercase letter");
    if (!/\d/.test(password)) throw ApiError.badRequest("Password must include at least one number");
  }

  async deleteById(id: string): Promise<void> {
    const ok = await this.userDb.deleteById(id);
    if (!ok) throw ApiError.notFound("User not found");
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
    if (!password) throw ApiError.badRequest("Password is required");
    this.validatePassword(password);
    // kiểm tra định dạng email hợp lệ
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      throw ApiError.badRequest("Invalid email format");
    }
    // find by email
    const existing = await this.userDb.findByEmail(email);
    if (existing) {
      throw ApiError.conflict("Email already in use");
    }
    // hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const role = input.role ?? "customer";
    await this.userDb.create({
      email,
      passwordHash,
      role,
    } as any);
  }
}

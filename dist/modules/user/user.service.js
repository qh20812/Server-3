import * as bcrypt from "bcrypt";
import { ApiError } from "../../utils/api-error.js";
import { toPublic } from "./user.model.js";
export class UserService {
    userDb;
    constructor(userDb) {
        this.userDb = userDb;
    }
    async list() {
        const users = await this.userDb.list();
        return users.map(toPublic);
    }
    async findById(id) {
        const user = await this.userDb.findById(id);
        return user ? toPublic(user) : null;
    }
    async findByEmail(email) {
        const user = await this.userDb.findByEmail(email);
        return user ? toPublic(user) : null;
    }
    async create(input) {
        const existing = await this.userDb.findByEmail(input.email);
        if (existing)
            throw ApiError.conflict("Email already in use");
        if (!input.password || input.password.length < 6) {
            throw ApiError.badRequest("Password must be at least 6 characters");
        }
        const passwordHash = await bcrypt.hash(input.password, 10);
        const role = input.role ?? "customer";
        const inserted = await this.userDb.create({
            email: input.email,
            passwordHash,
            role,
        });
        return toPublic(inserted);
    }
    async register(input) {
        const email = input.email.trim().toLowerCase();
        if (!email.includes("@")) {
            throw ApiError.badRequest("Invalid email address");
        }
        const password = input.password;
        if (password.length < 6) {
            throw ApiError.badRequest("Password must be at least 6 characters");
        }
        // btvn: bắt lỗi ký tự đặt biệt & chữ viết hoa
    }
}
//# sourceMappingURL=user.service.js.map
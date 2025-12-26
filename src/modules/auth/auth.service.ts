import type { UserDatabase } from "../user/user.database.js";
import type { AuthDatabase } from "./auth.database.js";

function randomTokenId(): string {
  return crypto.randomUUID();
}

export class AuthService {
  constructor(
    private readonly userDb: UserDatabase,
    private readonly authDb: AuthDatabase
  ) {}
  async login(input: {
    email: string;
    password: string;
    userAgent?: string;
    ip?: string;
  }) {}
  async refresh() {}
  async logout() {}
}

import type { UserDatabase } from "./user.database.js";
import type { CreateUserInput, UserPublic, UserRole } from "./user.model.js";
export declare class UserService {
    private readonly userDb;
    constructor(userDb: UserDatabase);
    list(): Promise<UserPublic[]>;
    findById(id: string): Promise<UserPublic | null>;
    findByEmail(email: string): Promise<UserPublic | null>;
    create(input: CreateUserInput): Promise<UserPublic>;
    register(input: {
        email: string;
        password: string;
        role?: UserRole;
    }): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map
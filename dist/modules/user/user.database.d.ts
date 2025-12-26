import type { ObjectId } from "mongodb";
import type { UserDoc } from "./user.model.js";
export declare class UserDatabase {
    private col;
    list(): Promise<Array<UserDoc & {
        _id: ObjectId;
    }>>;
    findByEmail(email: string): Promise<(UserDoc & {
        _id: ObjectId;
    }) | null>;
    findById(id: string): Promise<(UserDoc & {
        _id: ObjectId;
    }) | null>;
    create(input: Omit<UserDoc, "createdAt" | "updatedAt">): Promise<UserDoc & {
        _id: ObjectId;
    }>;
}
//# sourceMappingURL=user.database.d.ts.map
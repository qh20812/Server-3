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
    insertMany(inputs: Array<Omit<UserDoc, "createdAt" | "updatedAt">>): Promise<Array<UserDoc & {
        _id: ObjectId;
    }>>;
    updateById(id: string, updates: Partial<UserDoc>): Promise<(UserDoc & {
        _id: ObjectId;
    }) | null>;
    deleteById(id: string): Promise<boolean>;
}
//# sourceMappingURL=user.database.d.ts.map
import type { ObjectId } from "mongodb";
export type UserRole = "customer" | "admin";
export type UserDoc = {
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
};
export type CreateUserInput = {
    email: string;
    password: string;
    role?: UserRole;
};
export type UserPublic = Omit<UserDoc, "passwordHash"> & {
    _id: ObjectId;
};
export declare function toPublic(user: UserDoc & {
    _id: ObjectId;
}): UserPublic;
//# sourceMappingURL=user.model.d.ts.map
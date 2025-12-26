import { ObjectId as MongoObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
export class UserDatabase {
    col() {
        return getDb().collection("users");
    }
    async list() {
        try {
            return this.col().find().limit(50).toArray();
        }
        catch (e) {
            return [];
        }
    }
    async findByEmail(email) {
        try {
            return this.col().findOne({ email });
        }
        catch (e) {
            return null;
        }
    }
    async findById(id) {
        try {
            const _id = new MongoObjectId(id);
            return this.col().findOne({ _id });
        }
        catch (e) {
            return null;
        }
    }
    async create(input) {
        const now = new Date();
        const toInsert = { ...input, createdAt: now, updatedAt: now };
        const r = await this.col().insertOne(toInsert);
        return { _id: r.insertedId, ...toInsert };
    }
}
//# sourceMappingURL=user.database.js.map
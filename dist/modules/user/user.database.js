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
    async insertMany(inputs) {
        if (!inputs || inputs.length === 0)
            return [];
        const now = new Date();
        const toInsert = inputs.map((i) => ({ ...i, createdAt: now, updatedAt: now }));
        const r = await this.col().insertMany(toInsert);
        const result = [];
        for (const [k, _id] of Object.entries(r.insertedIds)) {
            const idx = Number(k);
            result.push({ _id: _id, ...toInsert[idx] });
        }
        return result;
    }
    async updateById(id, updates) {
        try {
            const _id = new MongoObjectId(id);
            const toSet = { ...updates, updatedAt: new Date() };
            await this.col().updateOne({ _id }, { $set: toSet });
            return this.findById(id);
        }
        catch (e) {
            return null;
        }
    }
    async deleteById(id) {
        try {
            const _id = new MongoObjectId(id);
            const r = await this.col().deleteOne({ _id });
            return r.deletedCount === 1;
        }
        catch (e) {
            return false;
        }
    }
}
//# sourceMappingURL=user.database.js.map
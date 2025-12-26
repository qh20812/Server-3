import type { ObjectId } from "mongodb";
import { ObjectId as MongoObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { UserDoc } from "./user.model.js";

export class UserDatabase {
  private col() {
    return getDb().collection<UserDoc>("users");
  }

  async list(): Promise<Array<UserDoc & { _id: ObjectId }>> {
    try{
        return this.col().find().limit(50).toArray();
    } catch(e){
        return [];
    }
  }

  async findByEmail(email: string): Promise<(UserDoc & { _id: ObjectId }) | null> {
    try{
        return this.col().findOne({ email });
    } catch(e){
        return null;
    }
  }

  async findById(id: string): Promise<(UserDoc & { _id: ObjectId }) | null> {
    try {
      const _id = new MongoObjectId(id);
      return this.col().findOne({ _id });
    } catch (e) {
      return null;
    }
  }

  async create(input: Omit<UserDoc, "createdAt" | "updatedAt">): Promise<UserDoc & { _id: ObjectId }> {
    const now = new Date();
    const toInsert = { ...input, createdAt: now, updatedAt: now } as unknown as UserDoc;
    const r = await this.col().insertOne(toInsert);
    return { _id: r.insertedId, ...toInsert } as UserDoc & { _id: ObjectId };
  }
  
}

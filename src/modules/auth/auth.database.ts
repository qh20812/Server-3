import type { ObjectId } from "mongodb";
import { getDb } from "../../database/mongo.js";
import type { RefreshTokenDoc } from "./auth.model.js";

export type RefreshTokenEntity = RefreshTokenDoc & { _id: ObjectId };
export class AuthDatabase {
  private col() {
    return getDb().collection<RefreshTokenDoc>("refresh_tokens");
  }
  async create(doc: RefreshTokenDoc): Promise<RefreshTokenEntity> {
    const res = await this.col().insertOne(doc);
    return { ...doc, _id: res.insertedId };
  }
  async findActiveByToken(tokenId: string): Promise<RefreshTokenEntity | null> {
    return this.col().findOne({
      token: tokenId,
      revokedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
    });
  }
  async revoke(tokenId: string, replaceByTokenId?: string): Promise<void> {
    await this.col().updateOne(
      { token: tokenId },
      {
        $set: {
          revokedAt: new Date(),
          ...(replaceByTokenId ? { replaceByTokenId } : {}),
        },
      }
    );
  }
}

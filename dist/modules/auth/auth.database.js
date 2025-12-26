import { getDb } from "../../database/mongo.js";
export class AuthDatabase {
    col() {
        return getDb().collection("refresh_tokens");
    }
    async create(doc) {
        const res = await this.col().insertOne(doc);
        return { ...doc, _id: res.insertedId };
    }
    async findActiveByToken(tokenId) {
        return this.col().findOne({
            tokenId,
            revoked: { $exists: false },
            expiresAt: { $gt: new Date() },
        });
    }
    async revoke(tokenId, replaceByTokenId) {
        await this.col().updateOne({ tokenId }, {
            $set: {
                revokedAt: new Date(),
                ...(replaceByTokenId ? { replaceByTokenId } : {}),
            },
        });
    }
}
//# sourceMappingURL=auth.database.js.map
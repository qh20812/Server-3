import { getDb } from "./mongo.js";
export async function ensureIndexes() {
    const db = getDb();
    // Users: unique email for quick lookups and a createdAt index for ordering
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("users").createIndex({ createdAt: -1 });
    console.log("[DB] Indexes ensured");
}
//# sourceMappingURL=indexes.js.map
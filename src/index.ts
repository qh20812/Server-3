import { createApp } from "./app.js";
import { env } from "./configs/env.js";
import { ensureIndexes } from "./database/indexes.js";
import { connectMongo, disconnectMongo } from "./database/mongo.js";

async function bootstrap() {
    await connectMongo();
    await ensureIndexes();
    const app = createApp();
    const server = app.listen(env.port, () => {
        console.log(`[Server] Listening on port ${env.port}`);
    });

    const shutdown = async (signal?: string) => {
        console.log(`[Server] ${signal || 'shutdown'} initiated`);
        try { server.close(); } catch (e) {}
        try { await disconnectMongo(); } catch (e) {}
        process.exit(0);
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap().catch((err)=>{
    console.error("[Server] Failed to start", err);
    process.exit(1);
});

process.on("unhandledRejection", (reason) => {
    console.error("[Server] Unhandled Rejection", reason);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("[Server] Uncaught Exception", err);
    process.exit(1);
});
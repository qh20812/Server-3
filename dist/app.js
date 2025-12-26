import cookieParser from "cookie-parser";
import express from "express";
import { userRouter } from "./modules/user/user.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
export function createApp() {
    const app = express();
    app.use(express.json({ limit: '10kb' }));
    app.use(cookieParser());
    // check server run or not
    app.get("/health", (_req, res) => {
        res.status(200).send("OK");
    });
    // modules
    app.use("/api/users", userRouter);
    app.use(errorMiddleware);
    return app;
}
//# sourceMappingURL=app.js.map
import { Router } from "express";
import { AuthDatabase } from "./auth.database.js";
import { AuthService } from "./auth.service.js";
import { AuthController } from "./auth.controller.js";
import { UserDatabase } from "../user/user.database.js";

const router = Router();
const authDb = new AuthDatabase();
const userDb = new UserDatabase();
const service = new AuthService(userDb, authDb);
const controller = new AuthController(service);

router.post("/login", controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", controller.logout);

export const authRouter = router;
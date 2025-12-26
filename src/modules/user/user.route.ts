import { Router } from "express";
import { UserDatabase } from "./user.database.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";

const router = Router();

const db = new UserDatabase();
const service = new UserService(db);
const controller = new UserController(service);

router.get("/", controller.list);
router.post("/", controller.create);
router.post("/register", controller.register);
router.get("/email/:email", controller.getByEmail);
router.get("/:id", controller.getById);

export const userRouter = router;
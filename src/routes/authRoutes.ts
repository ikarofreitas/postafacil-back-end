import { Router } from "express";
import { login } from "../controllers/authController";
import { validatePassword } from "../middlewares/validatePassword";

const router = Router();

router.post("/login", login, validatePassword);

export default router;
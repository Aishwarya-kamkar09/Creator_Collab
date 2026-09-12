import express from "express";
const router = express.Router();
import { registerUser,loginUser, getCurrentUser, logoutUser} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", protect, getCurrentUser);


export default router;

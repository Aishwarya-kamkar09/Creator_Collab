import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getDashboard
} from "../controllers/dashboard.controller.js";
const router = express.Router();



router.get(
    "/",
    protect,
    getDashboard
);


export default router;
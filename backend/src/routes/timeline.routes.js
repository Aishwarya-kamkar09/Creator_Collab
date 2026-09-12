import express from "express";
const router = express.Router();
import { protect } from "../middlewares/auth.middleware.js";
import {
    getTimeline,
} from "../controllers/timeline.controller.js";




router.get(
    "/:collaborationId",
    protect,
    getTimeline
);


export default router;
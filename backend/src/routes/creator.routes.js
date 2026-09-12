import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

import {
    createCreatorProfile,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile,
    getAllCreators,
    getCreatorByUsername,
} from "../controllers/creator.controller.js";

const router = express.Router();

router.post("/", protect, authorize("creator"), createCreatorProfile);

router.get("/me", protect, authorize("creator"), getMyProfile);

router.put("/me", protect, authorize("creator"), updateMyProfile);

router.delete("/me", protect, authorize("creator"), deleteMyProfile);

router.get("/", getAllCreators);

router.get("/:username", getCreatorByUsername);

export default router;
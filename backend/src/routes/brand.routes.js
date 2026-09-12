import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

import {
    createBrandProfile,
    getMyBrandProfile,
    updateBrandProfile,
    deleteBrandProfile,
    getAllBrands,
    getBrandById,
} from "../controllers/brand.controller.js";

const router = express.Router();

router.post("/", protect, authorize("brand"), createBrandProfile);

router.get("/me", protect, authorize("brand"), getMyBrandProfile);

router.put("/me", protect, authorize("brand"), updateBrandProfile);

router.delete("/me", protect, authorize("brand"), deleteBrandProfile);

router.get("/", getAllBrands);

router.get("/:id", getBrandById);

export default router;
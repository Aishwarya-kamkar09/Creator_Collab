import express from "express";

import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";

import {
    createCampaign,
    getMyCampaigns,
    getAllCampaigns,
} from "../controllers/campaign.controller.js";

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("brand"),
    createCampaign
);

router.get(
    "/me",
    protect,
    authorize("brand"),
    getMyCampaigns
);

router.get(
    "/",
    getAllCampaigns
);

export default router;
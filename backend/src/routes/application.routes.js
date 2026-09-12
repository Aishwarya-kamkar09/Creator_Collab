import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import {
    applyToCampaign,
    getMyApplications,
    updateApplication,
    withdrawApplication,
    getCampaignApplications,
    acceptApplication,
    rejectApplication,
} from "../controllers/application.controller.js";


const router = express.Router();

router.post(
    "/campaign/:campaignId",
    protect,
    authorize("creator"),
    applyToCampaign
);

router.get(
    "/me",
    protect,
    authorize("creator"),
    getMyApplications
);

router.put(
    "/:id",
    protect,
    authorize("creator"),
    updateApplication
);

router.patch(
    "/:id/withdraw",
    protect,
    authorize("creator"),
    withdrawApplication
);

router.get(
    "/campaign/:campaignId",
    protect,
    authorize("brand"),
    getCampaignApplications
);

router.patch(
    "/:id/accept",
    protect,
    authorize("brand"),
    acceptApplication
);

router.patch(
    "/:id/reject",
    protect,
    authorize("brand"),
    rejectApplication
);


export default router;
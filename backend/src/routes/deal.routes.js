import express from "express";
const router = express.Router();
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import {
    createDeal,
    updateDeal,
    confirmDeal,
    getMyDeals,
    acceptDeal,
    declineDeal,
} from "../controllers/deal.controller.js";


router.post(
    "/application/:applicationId",
    protect,
    authorize("brand"),
    createDeal
);

router.put(
    "/:dealId",
    protect,
    authorize("brand"),
    updateDeal
);


router.patch(
    "/:dealId/confirm",
    protect,
    authorize("brand"),
    confirmDeal
);

router.get(
    "/me",
    protect,
    getMyDeals
);

router.patch(
    "/:dealId/accept",
    protect,
    authorize("creator"),
    acceptDeal

);

router.patch(
    "/:dealId/decline",
    protect,
    authorize("creator"),
    declineDeal
);


export default router;
import express from "express";

const router = express.Router();

import {
    createReview,
    getReviewById,
    getUserReviews,
    updateReview,
    deleteReview,
} from "../controllers/review.controller.js";

import { protect } from "../middlewares/auth.middleware.js";


router.post(
    "/:collaborationId",
    protect,
    createReview
);


router.get(
    "/user/:userId",
    getUserReviews
);


router.get(
    "/:reviewId",
    getReviewById
);


router.patch(
    "/:reviewId",
    protect,
    updateReview
);


router.delete(
    "/:reviewId",
    protect,
    deleteReview
);


export default router;
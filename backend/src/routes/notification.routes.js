import express from "express";
const router=express.Router();
import {protect} from "../middlewares/auth.middleware.js";
import{
getMyNotifications,
markNotificationRead
} from "../controllers/notification.controller.js";


router.get(
    "/",
    protect,
    getMyNotifications
);

router.get(
    "/unread-count",
    protect,
    getUnreadCount
);

router.patch(
    "/read-all",
    protect,
    markAllNotificationsRead
);

router.patch(
    "/:id/read",
    protect,
    markNotificationRead
);

router.delete(
    "/:id",
    protect,
    deleteNotification
);

export default router;
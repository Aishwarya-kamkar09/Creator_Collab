import express from "express";

const router = express.Router();

import { protect } from "../middlewares/auth.middleware.js";

import {

    createChat,

    getChat,

    sendMessage,

    getMessages,

    markMessagesRead

} from "../controllers/chat.controller.js";

router.post(
    "/:collaborationId",
    protect,
    createChat
);

router.get(
    "/:collaborationId",
    protect,
    getChat
);

router.post(
    "/:chatId/message",
    protect,
    sendMessage
);

router.get(
    "/:chatId/messages",
    protect,
    getMessages
);

router.patch(
    "/:chatId/read",
    protect,
    markMessagesRead
);

export default router;
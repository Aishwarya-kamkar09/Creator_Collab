import Chat from "../models/Chat.js";
import checkCollaborationAccess from "./checkCollaborationAccess.js";

const checkChatAccess = async (user, chatId) => {

    const chat = await Chat.findById(chatId);

    if (!chat) {
        throw new Error("Chat not found");
    }

    await checkCollaborationAccess(
        user,
        chat.collaboration
    );

    return chat;
};

export default checkChatAccess;
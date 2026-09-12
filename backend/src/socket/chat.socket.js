import Chat from "../models/Chat.js";
import Message from "../models/Message.js";



export default function registerChatSocket(io) {

    io.on("connection", (socket) => {
        console.log("User Connected");

        socket.on("join-chat", async (chatId) => {
            socket.join(chatId);
        });


        socket.on("leave-chat", (chatId) => {
            socket.leave(chatId);
        });


        socket.on("send-message", async (data) => {
            const {
                chatId,
                sender,
                message,
                attachments
            } = data;

            const newMessage = await Message.create({
                chat: chatId,
                sender,
                message,
                attachments
            });

            await Chat.findByIdAndUpdate(chatId, {
                lastMessage: newMessage._id
            });

            io.to(chatId).emit(
                "receive-message",
                newMessage
            );
        });
    });
}
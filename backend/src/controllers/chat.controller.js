// import Chat from "../models/Chat.js";
// import Message from "../models/Message.js";

// import asyncHandler from "../utils/asyncHandler.js";
// import ApiError from "../utils/ApiError.js";
// import ApiResponse from "../utils/ApiResponse.js";

// import checkCollaborationAccess from "../utils/checkCollaborationAccess.js";
// import addTimelineEvent from "../utils/addTimelineEvent.js";


// export const getChat = asyncHandler(async (req, res) => {

//     await checkCollaborationAccess(
//         req.user,
//         req.params.collaborationId
//     );

//     const chat = await Chat.findOne({
//         collaboration: req.params.collaborationId
//     })
//     .populate("participants", "name email avatar")
//     .populate("lastMessage");

//     if (!chat) {
//         throw new ApiError(
//             404,
//             "Chat not found."
//         );
//     }

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             chat,
//             "Chat fetched successfully."
//         )

//     );

// });


// export const getMessages = asyncHandler(async (req, res) => {

//     const chat = await Chat.findById(req.params.chatId);

//     if (!chat) {

//         throw new ApiError(
//             404,
//             "Chat not found."
//         );

//     }

//     await checkCollaborationAccess(
//         req.user,
//         chat.collaboration
//     );

//     const messages = await Message.find({

//         chat: chat._id

//     })
//     .populate(
//         "sender",
//         "name avatar"
//     )
//     .sort({
//         createdAt: 1
//     });

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             messages,
//             "Messages fetched successfully."
//         )
//     );
// });



// export const sendMessage = asyncHandler(async (req, res) => {

//     const chat = await Chat.findById(
//         req.params.chatId
//     );

//     if (!chat) {

//         throw new ApiError(
//             404,
//             "Chat not found."
//         );

//     }

//     await checkCollaborationAccess(
//         req.user,
//         chat.collaboration
//     );

//     const {

//         message,

//         attachments

//     } = req.body;

//     if (
//         !message &&
//         (!attachments || attachments.length === 0)
//     ) {

//         throw new ApiError(
//             400,
//             "Message cannot be empty."
//         );

//     }

//     const newMessage = await Message.create({

//         chat: chat._id,

//         sender: req.user._id,

//         message,

//         attachments

//     });

//     chat.lastMessage = newMessage._id;

//     await chat.save();

//     await addTimelineEvent({

//         collaboration: chat.collaboration,

//         createdBy: req.user._id,

//         title: "New Message",

//         description: "A new chat message was sent.",

//         eventType:
//             req.user.role === "brand"
//                 ? "Brand"
//                 : "Creator",

//         metadata: {
//             messageId: newMessage._id
//         }

//     });

//     return res.status(201).json(

//         new ApiResponse(
//             201,
//             newMessage,
//             "Message sent successfully."
//         )

//     );

// });


// export const markAsRead = asyncHandler(async (req, res) => {

//     const message = await Message.findById(
//         req.params.messageId
//     );

//     if (!message) {

//         throw new ApiError(
//             404,
//             "Message not found."
//         );

//     }

//     const chat = await Chat.findById(
//         message.chat
//     );

//     await checkCollaborationAccess(
//         req.user,
//         chat.collaboration
//     );

//     message.isRead = true;

//     message.readAt = new Date();

//     await message.save();

//     return res.status(200).json(

//         new ApiResponse(
//             200,
//             message,
//             "Message marked as read."
//         )

//     );

// });























import Chat from "../models/Chat.js";
import Collaboration from "../models/Collaboration.js";
import BrandProfile from "../models/BrandProfile.js";
import CreatorProfile from "../models/CreatorProfile.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import checkCollaborationAccess from "../utils/checkCollaborationAccess.js";
import Message from "../models/Message.js";
import checkChatAccess from "../utils/checkChatAccess.js";



export const createChat = asyncHandler(async (req, res) => {

    const collaboration = await Collaboration.findById(
        req.params.collaborationId
    );

    if (!collaboration) {
        throw new ApiError(
            404,
            "Collaboration not found."
        );
    }

    const existingChat = await Chat.findOne({
        collaboration: collaboration._id,
    });

    if (existingChat) {
        throw new ApiError(
            409,
            "Chat already exists."
        );
    }

    const brand = await BrandProfile.findById(
        collaboration.brand
    );

    const creator = await CreatorProfile.findById(
        collaboration.creator
    );

    const chat = await Chat.create({
        collaboration: collaboration._id,
        participants: [
            brand.user,
            creator.user
        ]
    });

    collaboration.chat = chat._id;
    await collaboration.save();
    return res.status(201).json(
        new ApiResponse(
            201,
            chat,
            "Chat created successfully."
        )
    );
});



export const getChat = asyncHandler(async (req, res) => {

    await checkCollaborationAccess(
        req.user,
        req.params.collaborationId
    );

    const chat = await Chat.findOne({
        collaboration:
        req.params.collaborationId
    }).populate({
        path: "participants",
        select: "name email avatar"
    });

    if (!chat) {
        throw new ApiError(
            404,
            "Chat not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            chat,
            "Chat fetched successfully."
        )
    );
});



export const sendMessage = asyncHandler(async (req, res) => {

    const chat = await checkChatAccess(
        req.user,
        req.params.chatId
    );

    const { text, attachments = [] } = req.body;

    if (
        !text.trim() &&
        attachments.length === 0
    ) {
        throw new ApiError(
            400,
            "Message cannot be empty."
        );
    }

    if ((!text || text.trim() === "") && attachments.length === 0) {
        throw new ApiError(
            400,
            "Message cannot be empty."
        );
    }

    const message = await Message.create({
        chat: chat._id,
        sender: req.user._id,
        text,
        attachments
    });

    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();

    await chat.save();

    // Socket Event
    // io.to(chat._id).emit(...)

    // Notification
    // createNotification(...)

    return res.status(201).json(
        new ApiResponse(
            201,
            message,
            "Message sent successfully."
        )
    );
});


export const getMessages = asyncHandler(async (req, res) => {

    await checkChatAccess(
        req.user,
        req.params.chatId
    );

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const totalMessages = await Message.countDocuments({
        chat: req.params.chatId,
        deleted: false
    });

    const messages = await Message.find({
        chat: req.params.chatId,
        deleted: false
    })

    .populate(
        "sender",
        "name avatar"
    )
    .sort({
        createdAt: -1
    })
    .skip(skip)
    .limit(limit);
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                messages,
                page,
                totalPages: Math.ceil(totalMessages / limit),
                totalMessages
            },
            "Messages fetched successfully."
        )
    );
});





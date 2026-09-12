import Notification from "../models/Notification.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";


export const getMyNotifications = asyncHandler(async (req,res)=>{
    const notifications=await Notification.find({
        receiver:req.user._id
    })
    .populate(
        "sender",
        "name avatar"
    )
    .sort({
        createdAt:-1
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            notifications,
            "Notifications fetched successfully."
        )
    );
});


export const markNotificationRead = asyncHandler(async(req,res)=>{
    const notification=await Notification.findById(
        req.params.id
    );
    if(!notification){
        throw new ApiError(
            404,
            "Notification not found."
        );
    }
    if(
        notification.receiver.toString()
        !==
        req.user._id.toString()
    ){
        throw new ApiError(
            403,
            "Unauthorized."
        );
    }
    notification.isRead=true;
    notification.readAt=new Date();
    await notification.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            notification,
            "Notification marked as read."
        )
    );
});


export const deleteNotification = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        throw new ApiError(
            404,
            "Notification not found."
        );
    }
    if (
        notification.receiver.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Unauthorized."
        );
    }

    await notification.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Notification deleted successfully."
        )
    );
});



export const getUnreadCount = asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({
        receiver: req.user._id,
        isRead: false
    });
    return res.status(200).json(
        new ApiResponse(
            200,
            { unreadCount: count },
            "Unread count fetched."
        )
    );
});



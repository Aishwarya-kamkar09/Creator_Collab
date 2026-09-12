import Timeline from "../models/Timeline.js";
import Collaboration from "../models/Collaboration.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import checkCollaborationAccess from "../utils/checkCollaborationAccess.js";




export const getTimeline = asyncHandler(async (req, res) => {

    await checkCollaborationAccess(
        req.user,
        req.params.collaborationId
    );

    const timeline = await Timeline.find({

        collaboration: req.params.collaborationId,

    })

    .populate("createdBy", "name email")

    .sort({
        createdAt: 1
    });

    return res.status(200).json(

        new ApiResponse(

            200,

            timeline,

            "Timeline fetched successfully."

        )

    );

});
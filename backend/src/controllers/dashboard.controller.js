import Collaboration from "../models/Collaboration.js";
import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";
import BrandProfile from "../models/BrandProfile.js";
import CreatorProfile from "../models/CreatorProfile.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";


export const getDashboard = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    /*
    ==========================================
    BRAND DASHBOARD
    ==========================================
    */

    if (req.user.role === "brand") {

        const brand = await BrandProfile.findOne({
            user: userId
        });

        if (!brand) {
            throw new ApiError(
                404,
                "Brand profile not found."
            );
        }


        const [
            totalCampaigns,
            activeCampaigns,
            completedCampaigns,
            totalApplications,
            pendingApplications,
            activeCollaborations,
            completedCollaborations,
            cancelledCollaborations
        ] = await Promise.all([

            Campaign.countDocuments({
                brand: brand._id
            }),

            Campaign.countDocuments({
                brand: brand._id,
                status: "Active"
            }),

            Campaign.countDocuments({
                brand: brand._id,
                status: "Completed"
            }),

            Application.countDocuments({
                campaign: {
                    $in: await Campaign.find({
                        brand: brand._id
                    }).distinct("_id")
                }
            }),

            Application.countDocuments({
                campaign: {
                    $in: await Campaign.find({
                        brand: brand._id
                    }).distinct("_id")
                },
                status: "Pending"
            }),

            Collaboration.countDocuments({
                brand: brand._id,
                status: "Active"
            }),

            Collaboration.countDocuments({
                brand: brand._id,
                status: "Completed"
            }),

            Collaboration.countDocuments({
                brand: brand._id,
                status: "Cancelled"
            })

        ]);


        const spending = await Collaboration.aggregate([
            {
                $match: {
                    brand: brand._id
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: {
                        $sum: "$payment.paidAmount"
                    },
                    totalReleased: {
                        $sum: "$payment.releasedAmount"
                    }
                }
            }
        ]);


        const recentCollaborations =
            await Collaboration.find({
                brand: brand._id
            })
            .populate("campaign", "title")
            .populate({
                path: "creator",
                populate: {
                    path: "user",
                    select: "name avatar"
                }
            })
            .sort({
                updatedAt: -1
            })
            .limit(5);


        return res.status(200).json({

            success: true,

            data: {

                role: "brand",

                overview: {

                    totalCampaigns,

                    activeCampaigns,

                    completedCampaigns,

                    totalApplications,

                    pendingApplications,

                    activeCollaborations,

                    completedCollaborations,

                    cancelledCollaborations,

                    totalSpent:
                        spending[0]?.totalSpent || 0,

                    totalReleased:
                        spending[0]?.totalReleased || 0

                },

                recentCollaborations

            }

        });

    }


    /*
    ==========================================
    CREATOR DASHBOARD
    ==========================================
    */

    if (req.user.role === "creator") {

        const creator = await CreatorProfile.findOne({
            user: userId
        });

        if (!creator) {
            throw new ApiError(
                404,
                "Creator profile not found."
            );
        }


        const [
            totalApplications,
            pendingApplications,
            acceptedApplications,
            rejectedApplications,
            activeCollaborations,
            completedCollaborations,
            cancelledCollaborations
        ] = await Promise.all([

            Application.countDocuments({
                creator: creator._id
            }),

            Application.countDocuments({
                creator: creator._id,
                status: "Pending"
            }),

            Application.countDocuments({
                creator: creator._id,
                status: "Accepted"
            }),

            Application.countDocuments({
                creator: creator._id,
                status: "Rejected"
            }),

            Collaboration.countDocuments({
                creator: creator._id,
                status: "Active"
            }),

            Collaboration.countDocuments({
                creator: creator._id,
                status: "Completed"
            }),

            Collaboration.countDocuments({
                creator: creator._id,
                status: "Cancelled"
            })

        ]);


        const earnings = await Collaboration.aggregate([

            {
                $match: {
                    creator: creator._id
                }
            },

            {
                $group: {

                    _id: null,

                    totalEarnings: {
                        $sum: "$payment.creatorAmount"
                    },

                    releasedEarnings: {
                        $sum: "$payment.releasedAmount"
                    },

                    pendingEarnings: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: [
                                        "$payment.status",
                                        "Pending"
                                    ]
                                },
                                "$payment.creatorAmount",
                                0
                            ]
                        }
                    }

                }

            }

        ]);


        const recentCollaborations =
            await Collaboration.find({
                creator: creator._id
            })
            .populate("campaign", "title")
            .populate({
                path: "brand",
                populate: {
                    path: "user",
                    select: "name avatar"
                }
            })
            .sort({
                updatedAt: -1
            })
            .limit(5);


        return res.status(200).json({

            success: true,

            data: {

                role: "creator",

                overview: {

                    totalApplications,

                    pendingApplications,

                    acceptedApplications,

                    rejectedApplications,

                    activeCollaborations,

                    completedCollaborations,
                    cancelledCollaborations,

                    totalEarnings:
                        earnings[0]?.totalEarnings || 0,

                    releasedEarnings:
                        earnings[0]?.releasedEarnings || 0,

                    pendingEarnings:
                        earnings[0]?.pendingEarnings || 0,

                    averageRating:
                        creator.averageRating || 0,

                    totalReviews:
                        creator.totalReviews || 0

                },

                recentCollaborations

            }

        });

    }


    throw new ApiError(
        403,
        "Invalid user role."
    );

});
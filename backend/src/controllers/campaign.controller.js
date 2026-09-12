import Campaign from "../models/Campaign.js";
import BrandProfile from "../models/BrandProfile.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";



export const createCampaign = asyncHandler(async (req, res) => {

    const brandProfile = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brandProfile) {
        throw new ApiError(
            404,
            "Brand profile not found"
        );
    }

    const {
        title,
        description,
        category,
        platforms,
        budget,
        location,
        deadline,
        requirements,
        deliverables,
    } = req.body;

    if (
        !title ||
        !description ||
        !category ||
        !budget ||
        !deadline
    ) {
        throw new ApiError(
            400,
            "Please fill all required fields"
        );
    }

    const campaign = await Campaign.create({
        brand: brandProfile._id,
        title,
        description,
        category,
        platforms,
        budget,
        location,
        deadline,
        requirements,
        deliverables,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            campaign,
            "Campaign created successfully"
        )
    );

});

export const getMyCampaigns = asyncHandler(async (req, res) => {

    const brandProfile = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brandProfile) {
        throw new ApiError(
            404,
            "Brand profile not found"
        );
    }

    const campaigns = await Campaign.find({
        brand: brandProfile._id,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            campaigns,
            "Campaigns fetched successfully"
        )
    );

});


export const getAllCampaigns = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.platform) {
        filter.platforms = req.query.platform;
    }

    if (req.query.status) {
        filter.status = req.query.status;
    }

    const campaigns = await Campaign.find(filter)
        .populate({
            path: "brand",
            populate: {
                path: "user",
                select: "name avatar",
            },
        })
        .skip(skip)
        .limit(limit)
        .sort({
            createdAt: -1,
        });

    const total = await Campaign.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                campaigns,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            },
            "Campaigns fetched successfully"
        )
    );

});


import CreatorProfile from "../models/CreatorProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const createCreatorProfile = asyncHandler(async (req, res) => {

    const {
        username,
        bio,
        category,
        languages,
        location,
        socialLinks,
        pricing,
        skills
    } = req.body;

    if (!username) {
        throw new ApiError(400, "Username is required");
    }

    const existingProfile = await CreatorProfile.findOne({
        user: req.user._id
    });

    if (existingProfile) {
        throw new ApiError(
            409,
            "Creator profile already exists"
        );
    }

    const usernameExists = await CreatorProfile.findOne({
        username
    });

    if (usernameExists) {
        throw new ApiError(
            409,
            "Username already taken"
        );
    }

    const creatorProfile = await CreatorProfile.create({
        user: req.user._id,
        username,
        bio,
        category,
        languages,
        location,
        socialLinks,
        pricing,
        skills
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            creatorProfile,
            "Creator profile created successfully"
        )
    );

    
});

export const getMyProfile = asyncHandler(async (req, res) => {

    const profile = await CreatorProfile.findOne({
        user: req.user._id,
    }).populate("user", "name email avatar");

    if (!profile) {
        throw new ApiError(404, "Creator profile not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Creator profile fetched successfully"
        )
    );
});

export const getCreatorByUsername = asyncHandler(async (req, res) => {

    const profile = await CreatorProfile.findOne({
        username: req.params.username,
    }).populate("user", "name avatar");

    if (!profile) {
        throw new ApiError(404, "Creator not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Creator fetched successfully"
        )
    );
});

export const updateMyProfile = asyncHandler(async (req, res) => {

    const profile = await CreatorProfile.findOne({
        user: req.user._id
    });

    if (!profile) {
        throw new ApiError(404, "Creator profile not found");
    }

    const updatedProfile = await CreatorProfile.findByIdAndUpdate(
        profile._id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    ).populate("user", "name email avatar");

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedProfile,
            "Profile updated successfully"
        )
    );
});

export const deleteMyProfile = asyncHandler(async (req, res) => {

    const profile = await CreatorProfile.findOne({
        user: req.user._id
    });

    if (!profile) {
        throw new ApiError(404, "Creator profile not found");
    }

    await profile.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Profile deleted successfully"
        )
    );
});

export const getAllCreators = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.category) {
        filter.category = req.query.category;
    }

    if (req.query.location) {
        filter.location = req.query.location;
    }

    if (req.query.username) {
        filter.username = {
            $regex: req.query.username,
            $options: "i",
        };
    }

    const creators = await CreatorProfile.find(filter)
        .populate("user", "name email avatar")
        .skip(skip)
        .limit(limit);

    const total = await CreatorProfile.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                creators,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            },
            "Creators fetched successfully"
        )
    );

});


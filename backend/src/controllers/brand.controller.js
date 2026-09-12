import BrandProfile from "../models/BrandProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";


export const createBrandProfile = asyncHandler(async (req, res) => {

    const {
        companyName,
        companyLogo,
        website,
        industry,
        description,
        location,
        companySize,
        socialLinks
    } = req.body;

    if (!companyName || !industry) {
        throw new ApiError(
            400,
            "Company name and industry are required"
        );
    }

    const existingProfile = await BrandProfile.findOne({
        user: req.user._id
    });

    if (existingProfile) {
        throw new ApiError(
            409,
            "Brand profile already exists"
        );
    }

    const brand = await BrandProfile.create({
        user: req.user._id,
        companyName,
        companyLogo,
        website,
        industry,
        description,
        location,
        companySize,
        socialLinks
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            brand,
            "Brand profile created successfully"
        )
    );

});


export const getMyBrandProfile = asyncHandler(async (req, res) => {

    const profile = await BrandProfile.findOne({
        user: req.user._id,
    }).populate("user", "name email avatar");

    if (!profile) {
        throw new ApiError(404, "Brand profile not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            profile,
            "Brand profile fetched successfully"
        )
    );

});


export const updateBrandProfile = asyncHandler(async (req, res) => {

    const profile = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!profile) {
        throw new ApiError(404, "Brand profile not found");
    }

    const updatedProfile = await BrandProfile.findByIdAndUpdate(
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
            "Brand profile updated successfully"
        )
    );

});


export const deleteBrandProfile = asyncHandler(async (req, res) => {

    const profile = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!profile) {
        throw new ApiError(404, "Brand profile not found");
    }

    await profile.deleteOne();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Brand profile deleted successfully"
        )
    );

});


export const getAllBrands = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.industry) {
        filter.industry = req.query.industry;
    }

    if (req.query.location) {
        filter.location = req.query.location;
    }

    if (req.query.companyName) {
        filter.companyName = {
            $regex: req.query.companyName,
            $options: "i",
        };
    }

    const brands = await BrandProfile.find(filter)
        .populate("user", "name email avatar")
        .skip(skip)
        .limit(limit);

    const total = await BrandProfile.countDocuments(filter);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                brands,
                pagination: {
                    total,
                    page,
                    pages: Math.ceil(total / limit),
                },
            },
            "Brands fetched successfully"
        )
    );

});


export const getBrandById = asyncHandler(async (req, res) => {

    const brand = await BrandProfile.findById(req.params.id)
        .populate("user", "name avatar");

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            brand,
            "Brand fetched successfully"
        )
    );

});


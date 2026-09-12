import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";
import CreatorProfile from "../models/CreatorProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import BrandProfile from "../models/BrandProfile.js";
import createNotification from "../utils/createNotification.js";


export const applyToCampaign = asyncHandler(async (req, res) => {

    const creator = await CreatorProfile.findOne({
        user: req.user._id,
    });

    if (!creator) {
        throw new ApiError(
            404,
            "Creator profile not found"
        );
    }

    const campaign = await Campaign.findById(
        req.params.campaignId
    );

    if (!campaign) {
        throw new ApiError(
            404,
            "Campaign not found"
        );
    }

    if (campaign.status !== "Open") {
        throw new ApiError(
            400,
            "Campaign is closed"
        );
    }

    const alreadyApplied =
        await Application.findOne({
            campaign: campaign._id,
            creator: creator._id,
        });

    if (alreadyApplied) {
        throw new ApiError(
            400,
            "Already applied"
        );
    }

    const {
        proposal,
        expectedPrice,
        estimatedDelivery,
    } = req.body;

    const application =
        await Application.create({
            campaign: campaign._id,
            creator: creator._id,
            proposal,
            expectedPrice,
            estimatedDelivery,
        });

    campaign.applicantsCount++;
    await campaign.save();

    const brand = await BrandProfile.findById(campaign.brand);

    await createNotification({
        receiver: brand.user,
        sender: req.user._id,
        title: "New Application",
        message: "A creator applied to your campaign.",
        type: "Application",
        referenceId: application._id,
        referenceModel: "Application",
    });

    return res.status(201).json(

        new ApiResponse(
            201,
            application,
            "Application submitted successfully"
        )

    );

});


export const getMyApplications = asyncHandler(async (req, res) => {

    const creator = await CreatorProfile.findOne({
        user: req.user._id,
    });

    if (!creator) {
        throw new ApiError(404, "Creator profile not found");
    }

    const applications = await Application.find({
        creator: creator._id,
    })
        .populate({
            path: "campaign",
            populate: {
                path: "brand",
                populate: {
                    path: "user",
                    select: "name avatar",
                },
            },
        })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            applications,
            "Applications fetched successfully"
        )
    );

});


export const updateApplication = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    if (application.status !== "Pending") {
        throw new ApiError(
            400,
            "Only pending applications can be updated"
        );
    }

    const creator = await CreatorProfile.findOne({
        user: req.user._id,
    });

    if (!creator || !application.creator.equals(creator._id)) {
        throw new ApiError(
            403,
            "You are not allowed to update this application"
        );
    }

    const {
        proposal,
        expectedPrice,
        estimatedDelivery,
    } = req.body;

    application.proposal = proposal ?? application.proposal;
    application.expectedPrice =
        expectedPrice ?? application.expectedPrice;
    application.estimatedDelivery =
        estimatedDelivery ?? application.estimatedDelivery;

    await application.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            application,
            "Application updated successfully"
        )
    );

});


export const withdrawApplication = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    if (application.status !== "Pending") {
        throw new ApiError(
            400,
            "Application cannot be withdrawn"
        );
    }

    const creator = await CreatorProfile.findOne({
        user: req.user._id,
    });

    if (!creator || !application.creator.equals(creator._id)) {
        throw new ApiError(
            403,
            "Not authorized"
        );
    }

    await application.deleteOne();

    await Campaign.findByIdAndUpdate(
        application.campaign,
        {
            $inc: {
                applicantsCount: -1,
            },
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Application withdrawn successfully"
        )
    );

});

export const getCampaignApplications = asyncHandler(async (req, res) => {

    const brand = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brand) {
        throw new ApiError(404, "Brand profile not found");
    }

    const campaign = await Campaign.findById(req.params.campaignId);

    if (!campaign) {
        throw new ApiError(404, "Campaign not found");
    }

    if (!campaign.brand.equals(brand._id)) {
        throw new ApiError(
            403,
            "You are not authorized to view these applications"
        );
    }

    const applications = await Application.find({
        campaign: campaign._id,
    })
        .populate({
            path: "creator",
            populate: {
                path: "user",
                select: "name email avatar",
            },
        })
        .sort({
            createdAt: -1,
        });

    return res.status(200).json(
        new ApiResponse(
            200,
            applications,
            "Applications fetched successfully"
        )
    );

});


export const acceptApplication = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    const campaign = await Campaign.findById(application.campaign);

    if (!campaign) {
        throw new ApiError(404, "Campaign not found");
    }

    const brand = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brand || !campaign.brand.equals(brand._id)) {
        throw new ApiError(
            403,
            "Not authorized"
        );
    }

    if (application.status !== "Pending") {
        throw new ApiError(
            400,
            "Application already processed"
        );
    }

    application.status = "Accepted";

    await application.save();

    campaign.status = "Closed";

    campaign.selectedCreator = application.creator;

    await campaign.save();

    await Application.updateMany(
        {
            campaign: campaign._id,
            _id: {
                $ne: application._id,
            },
            status: "Pending",
        },
        {
            status: "Rejected",
        }
    );

    return res.status(200).json(
        new ApiResponse(
            200,
            application,
            "Application accepted successfully"
        )
    );

});


export const rejectApplication = asyncHandler(async (req, res) => {

    const application = await Application.findById(req.params.id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    const campaign = await Campaign.findById(application.campaign);

    if (!campaign) {
        throw new ApiError(404, "Campaign not found");
    }

    const brand = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brand || !campaign.brand.equals(brand._id)) {
        throw new ApiError(
            403,
            "Not authorized"
        );
    }

    if (application.status !== "Pending") {
        throw new ApiError(
            400,
            "Application already processed"
        );
    }

    application.status = "Rejected";

    await application.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            application,
            "Application rejected successfully"
        )
    );

});
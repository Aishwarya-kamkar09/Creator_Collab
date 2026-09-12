import Deal from "../models/Deal.js";
import Application from "../models/Application.js";
import Campaign from "../models/Campaign.js";
import BrandProfile from "../models/BrandProfile.js";
import CreatorProfile from "../models/CreatorProfile.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import createCollaborationFromDeal from "../utils/createCollaborationFromDeal.js";
import addTimelineEvent from "../utils/addTimelineEvent.js";


export const createDeal = asyncHandler(async (req, res) => {

    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
        .populate("campaign")
        .populate("creator");

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    const brand = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brand) {
        throw new ApiError(404, "Brand profile not found");
    }

    // Ensure the application belongs to one of this brand's campaigns
    if (application.campaign.brand.toString() !== brand._id.toString()) {
        throw new ApiError(
            403,
            "You are not allowed to create a deal for this application."
        );
    }

    const existingDeal = await Deal.findOne({
        application: applicationId,
    });

    if (existingDeal) {
        throw new ApiError(
            409,
            "Deal already exists for this application."
        );
    }

    const deal = await Deal.create({
        campaign: application.campaign._id,
        application: application._id,
        brand: brand._id,
        creator: application.creator._id,
        finalAmount: application.expectedPrice,
        deadline: application.campaign.deadline,
        deliverables: [],
        freeRevisions: 1,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            deal,
            "Deal created successfully."
        )
    );

});

export const updateDeal = asyncHandler(async (req, res) => {

    const { dealId } = req.params;

    const {
        finalAmount,
        deadline,
        freeRevisions,
        deliverables,
    } = req.body;

    const deal = await Deal.findById(dealId);

    if (!deal) {
        throw new ApiError(404, "Deal not found");
    }

    // Only owner brand can edit
    const brand = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brand) {
        throw new ApiError(404, "Brand profile not found");
    }

    if (deal.brand.toString() !== brand._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this deal."
        );
    }

    // Don't allow editing after creator accepts
    if (deal.brandAccepted) {
        throw new ApiError(
            400,
            "Offer has already been sent to the creator."
        );
    }

    if (finalAmount !== undefined) {
        deal.finalAmount = finalAmount;
    }

    if (deadline) {
        deal.deadline = deadline;
    }

    if (freeRevisions !== undefined) {
        deal.freeRevisions = freeRevisions;
    }

    if (deliverables) {
        deal.deliverables = deliverables;
    }

    await deal.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            deal,
            "Deal updated successfully."
        )
    );

});


export const confirmDeal = asyncHandler(async (req, res) => {

    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
        throw new ApiError(404, "Deal not found");
    }

    const brand = await BrandProfile.findOne({
        user: req.user._id,
    });

    if (!brand) {
        throw new ApiError(404, "Brand profile not found");
    }

    if (deal.brand.toString() !== brand._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to confirm this deal."
        );
    }

    if (deal.brandAccepted) {
        throw new ApiError(
            400,
            "Deal already confirmed."
        );
    }

    if (deal.deliverables.length === 0) {
        throw new ApiError(
            400,
            "Please add at least one deliverable."
        );
    }

    deal.brandAccepted = true;
    deal.brandAcceptedAt = new Date();

    await deal.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            deal,
            "Offer sent to creator successfully."
        )
    );

});


export const acceptDeal = asyncHandler(async (req, res) => {

    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
        throw new ApiError(404, "Deal not found");
    }

    const creator = await CreatorProfile.findOne({

        user: req.user._id,

    });

    if (!creator) {
        throw new ApiError(404, "Creator profile not found");
    }

    if (deal.creator.toString() !== creator._id.toString()) {

        throw new ApiError(
            403,
            "You are not authorized."
        );

    }

    if (!deal.brandAccepted) {

        throw new ApiError(
            400,
            "Brand has not confirmed the offer yet."
        );

    }

    if (deal.creatorAccepted) {

        throw new ApiError(
            400,
            "Deal already accepted."
        );

    }

    deal.creatorAccepted = true;

    deal.creatorAcceptedAt = new Date();

    deal.status = "Confirmed";

    await deal.save();

    const collaboration =
        await createCollaborationFromDeal(deal);

    //timeline event for collaboration started
    await addTimelineEvent({
        collaboration: collaboration._id,
        createdBy: req.user._id,
        title: "Collaboration Started",
        description:
            "Brand and Creator finalized the agreement.",
        eventType: "System",
    });

    
    return res.status(200).json(

        new ApiResponse(

            200,

            {

                deal,

                collaboration,

            },

            "Deal accepted successfully."

        )

    );

});


export const declineDeal = asyncHandler(async (req, res) => {

    const { dealId } = req.params;

    const deal = await Deal.findById(dealId);

    if (!deal) {
        throw new ApiError(404, "Deal not found");
    }

    const creator = await CreatorProfile.findOne({
        user: req.user._id,
    });

    if (!creator) {
        throw new ApiError(404, "Creator profile not found");
    }

    if (deal.creator.toString() !== creator._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized."
        );
    }

    if (!deal.brandAccepted) {
        throw new ApiError(
            400,
            "Offer has not been sent yet."
        );
    }

    if (deal.creatorAccepted) {
        throw new ApiError(
            400,
            "Deal already accepted."
        );
    }

    deal.status = "Cancelled";

    await deal.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            deal,
            "Deal declined successfully."
        )
    );

});

export const getMyDeals = asyncHandler(async (req, res) => {

    let deals = [];

    if (req.user.role === "brand") {

        const brand = await BrandProfile.findOne({
            user: req.user._id,
        });

        if (!brand) {
            throw new ApiError(404, "Brand profile not found");
        }

        deals = await Deal.find({
            brand: brand._id,
        })
            .populate("campaign", "title deadline")
            .populate({
                path: "creator",
                populate: {
                    path: "user",
                    select: "name email avatar",
                },
            });

    } else {

        const creator = await CreatorProfile.findOne({
            user: req.user._id,
        });

        if (!creator) {
            throw new ApiError(404, "Creator profile not found");
        }

        deals = await Deal.find({
            creator: creator._id,
        })
            .populate("campaign", "title deadline")
            .populate({
                path: "brand",
                populate: {
                    path: "user",
                    select: "name email avatar",
                },
            });

    }

    return res.status(200).json(
        new ApiResponse(
            200,
            deals,
            "Deals fetched successfully."
        )
    );

});


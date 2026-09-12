import Payment from "../models/Payment.js";
import Collaboration from "../models/Collaboration.js";

import BrandProfile from "../models/BrandProfile.js";
import CreatorProfile from "../models/CreatorProfile.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import checkCollaborationAccess from "../utils/checkCollaborationAccess.js";

import addTimelineEvent from "../utils/addTimelineEvent.js";


export const createPayment = asyncHandler(async(req,res)=>{

    if(req.user.role!=="brand"){

        throw new ApiError(
            403,
            "Only brands can create payment."
        );

    }

    const collaboration=
    await checkCollaborationAccess(
        req.user,
        req.params.collaborationId
    );

    const alreadyExists=
    await Payment.findOne({

        collaboration:collaboration._id

    });

    if(alreadyExists){

        throw new ApiError(
            400,
            "Payment already exists."
        );

    }

    const total=
    collaboration.agreement.finalAmount;

    const platformFee=
    Math.round(total*0.10);

    const creatorAmount=
    total-platformFee;

    const payment=
    await Payment.create({

        collaboration:
        collaboration._id,

        brand:
        collaboration.brand,

        creator:
        collaboration.creator,

        amount:total,

        platformFee,

        creatorAmount

    });

    collaboration.payment=
    payment._id;

    await collaboration.save();

    await addTimelineEvent({

        collaboration:
        collaboration._id,

        createdBy:req.user._id,

        title:"Payment Created",

        description:
        "Waiting for payment.",

        eventType:"Payment",

        metadata:{
            paymentId:payment._id
        }

    });

    return res.status(201).json(

        new ApiResponse(

            201,

            payment,

            "Payment created successfully."

        )

    );

});



export const verifyPayment = asyncHandler(async (req, res) => {

    if (req.user.role !== "brand") {
        throw new ApiError(
            403,
            "Only brands can verify payment."
        );
    }

    const payment = await Payment.findById(
        req.params.paymentId
    );

    if (!payment) {
        throw new ApiError(
            404,
            "Payment not found."
        );
    }

    const collaboration = await checkCollaborationAccess(
        req.user,
        payment.collaboration
    );

    if (payment.status !== "Pending") {
        throw new ApiError(
            400,
            `Payment is already ${payment.status}.`
        );
    }

    const {
        paymentId,
        orderId,
        transactionId
    } = req.body;

    payment.paymentId = paymentId;
    payment.orderId = orderId;
    payment.transactionId = transactionId;

    payment.status = "Escrow";
    payment.paidAt = new Date();

    await payment.save();

    await addTimelineEvent({

        collaboration: collaboration._id,

        createdBy: req.user._id,

        title: "Payment Successful",

        description:
            "Funds secured in escrow.",

        eventType: "Payment",

        metadata: {

            paymentId: payment._id,

            orderId,

            transactionId

        }

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            payment,

            "Payment verified successfully."

        )

    );

});


export const releasePayment = asyncHandler(async (req, res) => {

    if (req.user.role !== "brand") {

        throw new ApiError(
            403,
            "Only brands can release payment."
        );

    }

    const payment = await Payment.findById(
        req.params.paymentId
    );

    if (!payment) {

        throw new ApiError(
            404,
            "Payment not found."
        );

    }

    const collaboration =
        await checkCollaborationAccess(
            req.user,
            payment.collaboration
        );

    if (payment.status !== "Escrow") {

        throw new ApiError(
            400,
            "Payment is not in escrow."
        );

    }

    if (
        collaboration.progress.completedDeliverables !==
        collaboration.progress.totalDeliverables
    ) {

        throw new ApiError(
            400,
            "All deliverables must be approved first."
        );

    }

    payment.status = "Released";
    payment.releasedAt = new Date();

    await payment.save();

    collaboration.status = "Completed";
    collaboration.currentStage = "Completed";
    collaboration.project.completedAt = new Date();

    await collaboration.save();

    await addTimelineEvent({

        collaboration: collaboration._id,

        createdBy: req.user._id,

        title: "Payment Released",

        description:
            `₹${payment.creatorAmount} released to creator.`,

        eventType: "Payment",

        metadata: {

            paymentId: payment._id,

            creatorAmount: payment.creatorAmount,

            platformFee: payment.platformFee

        }

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            payment,

            "Payment released successfully."

        )

    );

});


export const refundPayment = asyncHandler(async (req, res) => {

    if (req.user.role !== "brand") {

        throw new ApiError(
            403,
            "Only brands can refund payment."
        );

    }

    const payment = await Payment.findById(
        req.params.paymentId
    );

    if (!payment) {

        throw new ApiError(
            404,
            "Payment not found."
        );

    }

    const collaboration =
        await checkCollaborationAccess(
            req.user,
            payment.collaboration
        );

    if (payment.status !== "Escrow") {

        throw new ApiError(
            400,
            "Only escrow payments can be refunded."
        );

    }

    if (collaboration.status !== "Cancelled") {

        throw new ApiError(
            400,
            "Project must be cancelled before refund."
        );

    }

    payment.status = "Refunded";
    payment.refundedAt = new Date();

    await payment.save();

    await addTimelineEvent({

        collaboration: collaboration._id,

        createdBy: req.user._id,

        title: "Payment Refunded",

        description:
            "Payment refunded to brand.",

        eventType: "Payment",

        metadata: {

            paymentId: payment._id

        }

    });

    return res.status(200).json(

        new ApiResponse(

            200,

            payment,

            "Payment refunded successfully."

        )

    );

});


export const getMyPayments = asyncHandler(async (req, res) => {

    let payments = [];

    if (req.user.role === "brand") {

        const brand = await BrandProfile.findOne({
            user: req.user._id
        });

        payments = await Payment.find({
            brand: brand._id
        })
        .populate("collaboration");

    } else {

        const creator = await CreatorProfile.findOne({
            user: req.user._id
        });

        payments = await Payment.find({
            creator: creator._id
        })
        .populate("collaboration");

    }

    return res.status(200).json(

        new ApiResponse(

            200,

            payments,

            "Payments fetched successfully."

        )

    );

});


export const getPaymentById = asyncHandler(async (req, res) => {

    const payment = await Payment.findById(
        req.params.paymentId
    )
    .populate("brand")
    .populate("creator")
    .populate("collaboration");

    if (!payment) {

        throw new ApiError(
            404,
            "Payment not found."
        );

    }

    await checkCollaborationAccess(
        req.user,
        payment.collaboration._id
    );

    return res.status(200).json(

        new ApiResponse(

            200,

            payment,

            "Payment fetched successfully."

        )

    );

});
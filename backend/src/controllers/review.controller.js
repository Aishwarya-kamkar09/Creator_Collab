import Review from "../models/Review.js";
import Collaboration from "../models/Collaboration.js";
import CreatorProfile from "../models/CreatorProfile.js";
import BrandProfile from "../models/BrandProfile.js";

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

import checkCollaborationAccess from "../utils/checkCollaborationAccess.js";
import addTimelineEvent from "../utils/addTimelineEvent.js";
import createNotification from "../utils/createNotification.js";


const updateProfileRating = async (userId, role) => {

    const reviews = await Review.find({
        receiver: userId,
    });

    const totalReviews = reviews.length;

    const averageRating =
        totalReviews === 0
            ? 0
            : Number(
                (
                    reviews.reduce(
                        (sum, review) =>
                            sum + review.rating,
                        0
                    ) / totalReviews
                ).toFixed(2)
            );

    if (role === "creator") {

        const creator =
            await CreatorProfile.findOne({
                user: userId,
            });

        if (creator) {

            creator.averageRating =
                averageRating;

            creator.totalReviews =
                totalReviews;

            await creator.save();
        }

    } else {

        const brand =
            await BrandProfile.findOne({
                user: userId,
            });

        if (brand) {

            brand.averageRating =
                averageRating;

            brand.totalReviews =
                totalReviews;

            await brand.save();
        }
    }
};


export const createReview = asyncHandler(
    async (req, res) => {

        const collaboration =
            await checkCollaborationAccess(
                req.user,
                req.params.collaborationId
            );

        if (
            collaboration.status !==
            "Completed"
        ) {

            throw new ApiError(
                400,
                "Review can only be submitted after collaboration is completed."
            );

        }

        const {
            rating,
            comment = "",
        } = req.body;

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            throw new ApiError(
                400,
                "Rating must be between 1 and 5."
            );

        }

        let receiver;
        let reviewerRole;
        let receiverRole;

        if (
            req.user.role === "brand"
        ) {

            reviewerRole = "brand";
            receiverRole = "creator";

            const creator =
                await CreatorProfile.findById(
                    collaboration.creator
                );

            receiver = creator.user;

        } else {

            reviewerRole = "creator";
            receiverRole = "brand";

            const brand =
                await BrandProfile.findById(
                    collaboration.brand
                );

            receiver = brand.user;

        }

        const existingReview =
            await Review.findOne({

                collaboration:
                    collaboration._id,

                reviewer:
                    req.user._id,

            });

        if (existingReview) {

            throw new ApiError(
                409,
                "You have already reviewed this collaboration."
            );

        }

        const review =
            await Review.create({

                collaboration:
                    collaboration._id,

                reviewer:
                    req.user._id,

                receiver,

                reviewerRole,

                receiverRole,

                rating,

                comment,

            });

        /*
         * Update collaboration flags
         */

        if (
            reviewerRole === "brand"
        ) {

            collaboration.review.brandReviewed =
                true;

        } else {

            collaboration.review.creatorReviewed =
                true;

        }

        await collaboration.save();

        /*
         * Update receiver rating
         */

        await updateProfileRating(
            receiver,
            receiverRole
        );

        /*
         * Timeline
         */

        await addTimelineEvent({

            collaboration:
                collaboration._id,

            createdBy:
                req.user._id,

            title:
                "Review Submitted",

            description:
                `${rating}/5 rating submitted.`,

            eventType:
                "System",

            metadata: {

                reviewId:
                    review._id,

                rating,

            }

        });

        /*
         * Notification
         */

        await createNotification({

            receiver,

            sender:
                req.user._id,

            title:
                "New Review",

            message:
                `You received a ${rating}/5 review.`,

            type:
                "Review",

            referenceId:
                review._id,

            referenceModel:
                "Review",

        });

        return res.status(201).json(

            new ApiResponse(

                201,

                review,

                "Review submitted successfully."

            )

        );

    }
);


export const getReviewById =
    asyncHandler(async (req, res) => {

        const review =
            await Review.findById(
                req.params.reviewId
            )

            .populate(
                "reviewer",
                "name avatar"
            )

            .populate(
                "receiver",
                "name avatar"
            )

            .populate(
                "collaboration",
                "campaign status"
            );

        if (!review) {

            throw new ApiError(
                404,
                "Review not found."
            );

        }

        return res.status(200).json(

            new ApiResponse(

                200,

                review,

                "Review fetched successfully."

            )

        );

});


export const getUserReviews =
    asyncHandler(async (req, res) => {

        const reviews =
            await Review.find({

                receiver:
                    req.params.userId,

            })

            .populate(
                "reviewer",
                "name avatar"
            )

            .populate(
                "collaboration",
                "campaign"
            )

            .sort({
                createdAt: -1
            });

        return res.status(200).json(

            new ApiResponse(

                200,

                reviews,

                "Reviews fetched successfully."
         )

     );

});


export const updateReview =
    asyncHandler(async (req, res) => {

        const review =
            await Review.findById(
                req.params.reviewId
            );

        if (!review) {

            throw new ApiError(
                404,
                "Review not found."
            );

        }

        if (
            review.reviewer.toString() !==
            req.user._id.toString()
        ) {

            throw new ApiError(
                403,
                "You can only edit your own review."
            );

        }

        const {
            rating,
            comment,
        } = req.body;

        if (
            rating !== undefined &&
            (
                !Number.isInteger(rating) ||
                rating < 1 ||
                rating > 5
            )
        ) {

            throw new ApiError(
                400,
                "Rating must be between 1 and 5."
            );

        }

        if (rating !== undefined) {

            review.rating = rating;

        }

        if (comment !== undefined) {

            review.comment = comment;

        }

        review.isEdited = true;

        review.editedAt = new Date();

        await review.save();

        await updateProfileRating(
            review.receiver,
            review.receiverRole
        );

        await addTimelineEvent({

            collaboration:
                review.collaboration,

            createdBy:
                req.user._id,

            title:
                "Review Updated",

            description:
                "A review was updated.",

            eventType:
                "System",

            metadata: {

                reviewId:
                    review._id,

            }

        });

        return res.status(200).json(

            new ApiResponse(

                200,

                review,

                "Review updated successfully."

            )

        );

});



export const deleteReview =
    asyncHandler(async (req, res) => {

        const review =
            await Review.findById(
                req.params.reviewId
            );
        if (!review) {
            throw new ApiError(
                404,
                "Review not found."
            );
        }
        if (
            review.reviewer.toString() !==
            req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "You can only delete your own review."
            );
        }
        const collaborationId =
            review.collaboration;
        const reviewerRole =
            review.reviewerRole;
        const receiver =
            review.receiver;
        const receiverRole =
            review.receiverRole;
        await review.deleteOne();

        /*
         * Update collaboration flag
         */

        const collaboration =
            await Collaboration.findById(
                collaborationId
            );

        if (collaboration) {

            if (
                reviewerRole === "brand"
            ) {

                collaboration.review.brandReviewed =
                    false;

            } else {

                collaboration.review.creatorReviewed =
                    false;

            }

            await collaboration.save();
        }

        /*
         * Recalculate rating
         */

        await updateProfileRating(
            receiver,
            receiverRole
        );

        return res.status(200).json(

            new ApiResponse(

                200,

                null,

                "Review deleted successfully."

            )

        );

});




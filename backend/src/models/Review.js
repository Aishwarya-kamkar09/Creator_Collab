import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        collaboration: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collaboration",
            required: true,
        },

        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        reviewerRole: {
            type: String,
            enum: ["brand", "creator"],
            required: true,
        },

        receiverRole: {
            type: String,
            enum: ["brand", "creator"],
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },

        isEdited: {
            type: Boolean,
            default: false,
        },

        editedAt: Date,

        status: {
            type: String,
            enum: ["Published", "Hidden"],
            default: "Published",
        },
    },
    {
        timestamps: true,
    }
);

// One review per person per collaboration
reviewSchema.index(
    {
        collaboration: 1,
        reviewer: 1,
    },
    {
        unique: true,
    }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
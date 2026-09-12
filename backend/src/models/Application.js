import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {

        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CreatorProfile",
            required: true,
        },

        proposal: {
            type: String,
            required: true,
        },

        expectedPrice: {
            type: Number,
            required: true,
        },

        estimatedDelivery: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Shortlisted",
                "Accepted",
                "Rejected",
                "Deal Created",
                "Withdrawn"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true,
    }
);

const Application = mongoose.model(
    "Application",
    applicationSchema
);

applicationSchema.index(
    { campaign: 1, creator: 1 },
    { unique: true }
);

export default Application;
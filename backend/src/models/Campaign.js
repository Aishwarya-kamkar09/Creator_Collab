import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
    {
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BrandProfile",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            required: true,
        },

        platforms: [{
            type: String,
        }],

        budget: {
            min: {
                type: Number,
                required: true,
            },
            max: {
                type: Number,
                required: true,
            },
        },

        location: {
            type: String,
            default: "Remote",
        },

        deadline: {
            type: Date,
            required: true,
        },

        requirements: [{
            type: String,
        }],

        deliverables: [{
            type: String,
        }],

        status: {
            type: String,
            enum: [
                "Open",
                "Closed",
                "Completed",
                "Cancelled"
            ],
            default: "Open",
        },

        applicantsCount: {
            type: Number,
            default: 0,
        },

        selectedCreator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CreatorProfile",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Campaign = mongoose.model(
    "Campaign",
    campaignSchema
);

export default Campaign;
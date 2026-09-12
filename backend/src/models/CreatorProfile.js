import mongoose from "mongoose";

const creatorProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        bio: {
            type: String,
            maxlength: 500,
            default: "",
        },

        category: {
            type: String,
            enum: [
                "Technology",
                "Fashion",
                "Gaming",
                "Fitness",
                "Education",
                "Travel",
                "Lifestyle",
                "Food",
                "Music",
                "Comedy",
                "Photography",
                "Other",
            ],
            default: "Other",
        },

        languages: [{
            type: String,
        }],

        location: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: "",
        },

        coverImage: {
            type: String,
            default: "",
        },

        socialLinks: {
            instagram: String,
            youtube: String,
            linkedin: String,
            twitter: String,
        },

        followers: {
            type: Number,
            default: 0,
        },

        engagementRate: {
            type: Number,
            default: 0,
        },

        pricing: {
            type: Number,
            default: 0,
        },

        skills: [{
            type: String,
        }],

        portfolio: [{
            title: String,
            link: String,
        }],

        availability: {
            type: Boolean,
            default: true,
        },
        averageRating: {
            type: Number,
            default: 0
        },

        totalReviews: {
            type: Number,
            default: 0
        },
        verified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const CreatorProfile = mongoose.model(
    "CreatorProfile",
    creatorProfileSchema
);

export default CreatorProfile;
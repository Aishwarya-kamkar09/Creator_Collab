import mongoose from "mongoose";

const brandProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    industry: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "500+"],
      default: "1-10",
    },

    socialLinks: {
      linkedin: {
        type: String,
        default: "",
      },
      instagram: {
        type: String,
        default: "",
      },
      twitter: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
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

const BrandProfile = mongoose.model(
  "BrandProfile",
  brandProfileSchema
);

export default BrandProfile;
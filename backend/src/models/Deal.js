import mongoose from "mongoose";

const deliverableSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
    },

    quantity: {
        type: Number,
        default: 1,
    },

    completed: {
        type: Boolean,
        default: false,
    }

}, { _id: false });

const dealSchema = new mongoose.Schema({

    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },

    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true,
        unique: true,
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BrandProfile",
        required: true,
    },

    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CreatorProfile",
        required: true,
    },

    finalAmount: {
        type: Number,
        required: true,
    },

    deliverables: [deliverableSchema],

    deadline: {
        type: Date,
        required: true,
    },

    freeRevisions: {
        type: Number,
        default: 1,
    },

    brandAccepted: {
        type: Boolean,
        default: false,
    },

    creatorAccepted: {
        type: Boolean,
        default: false,
    },

    status: {
        type: String,
        enum: [
            "Negotiation",
            "Confirmed",
            "Cancelled"
        ],
        default: "Negotiation",
    }

}, {
    timestamps: true,
});

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;
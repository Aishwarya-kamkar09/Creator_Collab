import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
{
    collaboration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collaboration",
        required: true,
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        default: "",
    },

    eventType: {
        type: String,
        enum: [
            "System",
            "Brand",
            "Creator",
            "Payment",
            "Revision",
            "Deliverable"
        ],
        required: true,
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    icon: {
    type: String,
    default: "info",
    }

},
{
    timestamps: true,
});

const Timeline = mongoose.model(
    "Timeline",
    timelineSchema
);

export default Timeline;
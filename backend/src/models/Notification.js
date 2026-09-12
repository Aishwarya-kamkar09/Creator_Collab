import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({

    receiver: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,

    },

    sender: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "User",

    },

    title: {

        type: String,

        required: true,

        trim: true,

    },

    message: {

        type: String,

        required: true,

        trim: true,

    },

    type: {

        type: String,

        enum: [

            "Application",

            "Deal",

            "Collaboration",

            "Deliverable",

            "Revision",

            "Payment",

            "Chat",

            "Review",

            "System"

        ],

        required: true,

    },

    referenceId: {

        type: mongoose.Schema.Types.ObjectId,

    },

    referenceModel: {

        type: String,

        enum: [

            "Application",

            "Deal",

            "Collaboration",

            "Message",

            "Payment",

            "Review"

        ]

    },

    isRead: {

        type: Boolean,

        default: false,

    },

    readAt: Date,

},{
    timestamps:true
});

export default mongoose.model(
    "Notification",
    notificationSchema
);
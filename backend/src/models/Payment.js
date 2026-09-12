import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
{
    collaboration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collaboration",
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

    amount: {
        type: Number,
        required: true,
    },

    platformFee: {
        type: Number,
        required: true,
    },

    creatorAmount: {
        type: Number,
        required: true,
    },

    gateway: {
        type: String,
        enum: [
            "Razorpay",
            "Stripe",
            "Manual"
        ],
        default: "Razorpay",
    },

    orderId: String,

    paymentId: String,

    transactionId: String,

    status: {

        type: String,

        enum: [
            "Pending",
            "Escrow",
            "Released",
            "Refunded",
            "Failed"
        ],

        default: "Pending",
    },

    paidAt: Date,

    releasedAt: Date,

    refundedAt: Date,

},
{
    timestamps:true
});

export default mongoose.model(
    "Payment",
    paymentSchema
);

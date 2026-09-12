import mongoose from "mongoose";


const deliverableSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },


        description: {
            type: String,
            default: "",
        },

        quantity: {
            type: Number,
            default: 1,
        },

        completed: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Submitted",
                "Revision Requested",
                "Approved"
            ],
            default: "Pending"
        },

        approved: {
            type: Boolean,
            default: false,
        },

        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        submittedLinks:[
        {
            url:String,
            fileType:String,
             enum: [
                "Image",
                "Video",
                "PDF",
                "Drive",
                "Instagram",
                "YouTube",
                "Other"
            ]
        }
    ],

//     submissionHistory: [
// {
//     submittedBy:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:"User"
//     },

//     submittedAt:Date,

//     links:[
//         {
//             url:String,
//             fileType:String
//         }
//     ]
// }
// ],

    feedback:{
        comment:{
            type:String,
            default:""
        },
        reviewedAt:Date
    },

        submittedAt: Date,

        approvedAt: Date,
    },
    { _id: true }
);

const revisionRequestSchema = new mongoose.Schema(
    {
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        deliverableId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        revisionNumber:{
            type:Number,
            default:1
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Resolved"
            ],
            default: "Pending"
        },

        creatorResponse:{
            comment:String,
            respondedAt:Date
        },

        submittedLinks:[
        {
            url:String,
            fileType:String
        }
        ],
        resolvedAt: Date,
    },
    {
        timestamps: true,
    }
);

const collaborationSchema = new mongoose.Schema(
    {
        campaign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
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

        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Application",
            required: true,
        },

        agreement: {
            finalAmount: {
                type: Number,
                required: true,
            },
            acceptedAt: {
                type: Date,
                default: Date.now
            },
            deadline: {
                type: Date,
                required: true,
            },

            deliverables: [deliverableSchema],
        },

        revision: {
            freeAllowed: {
                type: Number,
                default: 1,
            },

            used: {
                type: Number,
                default: 0,
            },

            requests: [revisionRequestSchema],
        },

        project: {
            startedAt: {
                type: Date,
                default: Date.now,
            },

            completedAt: Date,

            cancelledAt: Date,
        },

        cancellation: {
            cancelledBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            reason: String,
        },

        progress: {
            completedDeliverables: {
                type: Number,
                default: 0,
            },
            lastDeliverableCompletedAt:Date,
            totalDeliverables: {
                type: Number,
                default: 0,
            },

            percentage: {
                type: Number,
                default: 0,
            },

            lastUpdated: {
                type: Date,
                default: Date.now,
            },
        },

        currentStage: {
            type: String,

            enum: [
                "Planning",
                "In Progress",
                "Review",
                "Completed",
                "Cancelled",
            ],

            default: "Planning",
        },

        status: {
            type: String,

            enum: [
                "Active",
                "Submitted",
                "Revision Requested",
                "Approved",
                "Completed",
                "Cancelled",
            ],

            default: "Active",
        },

        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Payment",
        },

        review: {
            creatorReviewed: {
                type: Boolean,
                default: false,
            },

            brandReviewed: {
                type: Boolean,
                default: false,
            },
        },
    },
    {
        timestamps: true,
    }
);

const Collaboration = mongoose.model(
    "Collaboration",
    collaborationSchema
);

export default Collaboration;
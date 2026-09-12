import mongoose from "mongoose";

const attachmentSchema=new mongoose.Schema({

    url:{
        type:String,
        required:true
    },

    fileType:{
        type:String,
        enum:[
            "Image",
            "Video",
            "PDF",
            "Document",
            "Audio",
            "Other"
        ],
        default:"Other"
    }

},{_id:false});


const messageSchema=new mongoose.Schema({

    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Chat",
        required:true
    },

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    text:{
        type:String,
        trim:true,
        default:""
    },

    attachments:[attachmentSchema],

    isRead:{
        type:Boolean,
        default:false
    },

    readAt:Date,

    deleted:{
        type:Boolean,
        default:false
    }

},{
    timestamps:true
});

export default mongoose.model(
    "Message",
    messageSchema
);
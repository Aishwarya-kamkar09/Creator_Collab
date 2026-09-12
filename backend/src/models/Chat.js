import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

    collaboration:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Collaboration",
        required:true,
        unique:true
    },

    participants:[{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    }],

    lastMessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },

    lastMessageAt:Date

},{
    timestamps:true
});

export default mongoose.model(
    "Chat",
    chatSchema
);
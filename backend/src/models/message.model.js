import mongoose from "mongoose";
const messageSchema=new mongoose.Schema(
    {
        senderId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            reqq:true,
        },
        recieverId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            reqq:true,
        },
        text:
        {
            type:String,
        },
        image:{
            type:String,
        },

    },{timestamps:true}
);

const Message=mongoose.model("Message",messageSchema);
export default Message;
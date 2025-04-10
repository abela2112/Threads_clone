import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text:{
        type: String,
        required: true,
        trim: true,
    },
    authorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    communityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community', // Reference to the Community model
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    parentId:{
        
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread', // Reference to the parent thread if it's a reply
        default: null
    }
    ,
    children:[
        
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread' // Reference to child threads (replies)
        }
    ]
})

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);
export default Thread;
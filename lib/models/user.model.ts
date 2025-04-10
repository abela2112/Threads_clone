import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    bio: {
        type: String,
    },
    onBoard:{
        type: Boolean,
        default: false,
    },
    threads:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Thread',
        }
    ],
    communities:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Community',
        }
    ]
},{
    timestamps: true})


const User =mongoose.models.User || mongoose.model('User', userSchema);

export default User
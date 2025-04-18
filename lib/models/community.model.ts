import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
  {
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

    threads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Thread",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


const Community =mongoose.models.Community || mongoose.model('Community', communitySchema);

export default Community
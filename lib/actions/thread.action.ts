"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";
interface Params {
  text: string;
  authorId: string; // Assuming authorId is the ID of the user creating the thread
  communityId: string | null; // Assuming communityId is the ID of the community where the thread is being created
  path: string; // Path to revalidate after creating the thread
}
export async function createThread({
  text,
  authorId,
  communityId,
  path,
}: Params) {
  try {
    connectToDB(); // Ensure the database connection is established
    const communityObjectId = communityId
      ? await Community.findOne({ id: communityId }, { _id: 1 })
      : "";
    // if(!communityObjectId) throw new Error("Community not found");
    const createThread = await Thread.create({
      text,
      authorId,
      communityId: communityObjectId?._id,
      createdAt: new Date(),
    });
    if (!createThread) {
      throw new Error("Failed to create thread");
    }
    const updatedUser = await User.findByIdAndUpdate(
      authorId,

      { $push: { threads: createThread._id } }, // Add the thread ID to the user's threads array
      { new: true } // Return the updated user document
    );
    await updatedUser?.save();
    if (communityObjectId) {
      await Community.findByIdAndUpdate(communityObjectId._id, {
        $push: { threads: createThread._id },
      });
    }
    revalidatePath(path);
  } catch (error) {
    console.error("Error creating thread:", error);
  }
}

export async function fetchPosts(
  pagenumber: number = 1,
  pagesize: number = 20
) {
  try {
    let skipAmount = (pagenumber - 1) * pagesize; // Calculate how many posts to skip based on the page number and page size
    connectToDB(); // Ensure the database connection is established
    const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } }) // Fetch only top-level threads (not replies)
      .sort({ createdAt: -1 })
      .skip(skipAmount) // Skip the calculated number of posts
      .limit(pagesize) // Limit the number of posts to the page size
      .populate({
        path: "authorId", // Populate the authorId field with User details
        model: "User", // Specify the User model to populate from
      })
      .populate({
        path: "communityId",
        model: Community,
      })
      .populate({
        path: "children", // Populate the children field with replies
        populate: {
          path: "authorId", // Populate the authorId field of each child thread
          model: "User", // Specify the User model to populate from
          select: "_id id name parentId image", // Select only the username and _id fields from the User model
        },
      });
    const totalPosts = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    }); // Count total top-level threads

    const posts = await postsQuery.exec();
    const isNext = totalPosts > skipAmount + posts.length; // Check if there are more posts to fetch for the next page
    return {
      posts,
      isNext,
    };
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
}

export async function fetchThreadById(id: string) {
  try {
    connectToDB(); // Ensure the database connection is established
    const thread = await Thread.findById(id)
      .populate({
        path: "authorId",
        model: "User",
        select: "_id id name image",
      })
      .populate({
        path: "communityId",
        model: Community,
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "authorId",
            model: "User",
            select: "_id id name image",
          },
          {
            path: "children",
            model: "Thread",
            populate: {
              path: "authorId",
              model: "User",
              select: "_id name id image parentId",
            },
          },
        ],
      })
      .exec();

    return thread; // Return the thread document
  } catch (error) {
    console.error("Error fetching thread by ID:", error);
  }
}

export async function addCommentToThread(
  threadId: string,
  userId: string,
  comment: string,
  path: string
) {
  try {
    connectToDB(); // Ensure the database connection is established
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error("Thread not found");

    const newComment = new Thread({
      text: comment,
      authorId: userId,
      parentId: threadId,
    });
    const savedComment = await newComment.save();
    originalThread.children.push(savedComment._id);
    await originalThread.save();
    revalidatePath(path);
  } catch (error) {
    console.error("Error adding comment to thread:", error);
    throw new Error("Error adding comment to thread");
  }
}

export async function deleteThread(threadId: string, path: string) {
  try {
    connectToDB(); // Ensure the database connection is established
    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error("Thread not found");

    // Remove the thread from the author's threads array
    await User.findByIdAndUpdate(thread.authorId, {
      $pull: { threads: threadId },
    });

    // Remove the thread from the community's threads array if it exists
    if (thread.communityId) {
      await Community.findByIdAndUpdate(thread.communityId, {
        $pull: { threads: threadId },
      });
    }
    await Thread.findByIdAndDelete(threadId); // Delete the thread from the database
    // If the thread has children, delete them as well
    await Thread.deleteMany({ parentId: threadId }); // Delete all comments associated with the thread
    // Revalidate the path to refresh the data
    revalidatePath(path);
  } catch (error) {
    console.error("Error deleting thread:", error);
  }
}

export const likeOrUnlikeThread = async (
  threadId: string,
  userId: string,
  path: string
) => {
  try {
    console.log("Like or unlike thread", threadId, userId);

    connectToDB(); // Ensure the database connection is established
    const thread = await Thread.findById(threadId);
    if (!thread) throw new Error("Thread not found");

    const hasLiked = thread?.likes?.get(userId.toString()) || false;
    console.log("hasLiked", hasLiked);
    if (hasLiked) {
      // Unlike
      thread?.likes?.delete(userId);
    } else {
      // Like
      thread?.likes?.set(userId, true);
    }

    await thread.save();
    revalidatePath(path);
    // Check if the user has liked the thread after the operation
    const updatedThread = await Thread.findById(threadId);
    const hasLikedAfter = updatedThread?.likes?.get(userId.toString());
    console.log(
      "hasLikedAfter",
      hasLikedAfter,
      " updatedThread?.likes",
      updatedThread
    );
    return { success: true, isLiked: !hasLiked };
  } catch (error) {
    console.error("Error liking/unliking thread:", error);
    // throw new Error("Error liking/unliking thread");
  } // Revalidate the path to refresh the data
  // return thread;
};


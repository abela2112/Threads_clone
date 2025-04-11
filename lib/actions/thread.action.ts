"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
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
    const createThread = await Thread.create({
      text,
      authorId,
      communityId: null,
    });
    if (!createThread) {
      throw new Error("Failed to create thread");
    }
    const updatedUser = await User.findByIdAndUpdate(
      authorId ,

      { $push: { threads: createThread._id } }, // Add the thread ID to the user's threads array
      { new: true } // Return the updated user document
    );
    await updatedUser?.save();
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
      .sort({ createdAt: "desc" })
      .skip(skipAmount) // Skip the calculated number of posts
      .limit(pagesize) // Limit the number of posts to the page size
      .populate({
        path: "authorId", // Populate the authorId field with User details
        model: "User", // Specify the User model to populate from
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
  path: string,
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


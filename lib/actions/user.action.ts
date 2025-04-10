"use server";

import { revalidatePath } from "next/cache";
import User from "@/lib/models/user.model";
import { connectToDB } from "@/lib/mongoose";
import { FilterQuery, SortOrder } from "mongoose";
import Thread from "../models/thread.model";
interface UpdateUserParams {
  userId: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  pathname: string; // Optional parameter for the path to revalidate
}
export async function updateUser({
  userId,
  name,
  username,
  bio,
  image,
  pathname,
}: UpdateUserParams): Promise<void | Error> {
  try {
    await connectToDB(); // Ensure the database connection is established

    // Find the user by ID and update their details
    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { name, username: username.toLowerCase(), bio, image, onBoard: true }, // Set onBoard to true if it's a new user
      { upsert: true } // Return the updated document
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }
    if (pathname === "/profile/edit") {
      revalidatePath(pathname); // Revalidate the profile page to reflect changes
    }
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
  }
}

export async function fetchUser(userId: string) {
  try {
    await connectToDB();
    return await User.findOne({ id: userId });
    // .populate({
    //   path: "communities",
    //   model: "Community",

    // });
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user. Please try again later.");
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB(); // Ensure the database connection is established

    const userPosts = await User.findOne({ id: userId }).populate({
      path: "threads",
      model: "Thread",
      populate: {
        path: "children",
        model: "Thread",
        populate: {
          path: "authorId",
          model: "User",
          select: "id name image",
        },
      },
    });
    return userPosts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
  }
}

export async function fetchUsers({
  searchParams = "",
  pageNum = 1,
  pageSize = 20,
  sortBy = "desc",
  userId,
}: {
  searchParams?: string;
  pageNum?: number;
  pageSize?: number;
  sortBy?: SortOrder;
  userId: string;
}) {
  try {
    connectToDB();

    let skipAmount = (pageNum - 1) * pageSize;

    let query: FilterQuery<typeof User> = {
     id: {$ne: userId}
    };
    const regex = new RegExp(searchParams, "i");
    if (searchParams.trim() != "") {
      query = {
        $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
      };
    }
    const sortOptions = { createdAt: sortBy };
    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const usersList = await userQuery.exec();
    const totalUsers = await User.countDocuments(query);
    const isNext = totalUsers > skipAmount + pageSize;
    return { usersList, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

export async function getActivity(userId: string) {
  try {
    connectToDB(); // Ensure the database connection is established
    const userThreads = await Thread.find({ authorId: userId });

    const childThreadsIds = userThreads.reduce((acc, thread) => {
      return acc.concat(thread.children);
    }, []);
    const replies = await Thread.find({
      _id: { $in: childThreadsIds },
      authorId: { $ne: userId },
    }).populate("authorId", "_id id name image");

    return replies;
  } catch (error) {
    console.error("Error fetching activity:", error);
  }
}

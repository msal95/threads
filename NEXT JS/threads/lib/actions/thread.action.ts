"use server";

import { revalidatePath } from "next/cache";
import Thread from "../modals/thread.modal";
import User from "../modals/user.modal";
import { connectToDB } from "../mongoose";

export async function fetchPosts(pageNum = 1, pageSize = 20) {
  connectToDB();

  //Calculate the number of posts to skip
  const skipAmount = (pageNum - 1) * pageSize;

  // Fetch the poss that have no parent(Top level threads....)
  const postsQuery = Thread.find({
    parentId: { $in: [null, undefined] },
  })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: "author", model: User })
    .populate({
      path: "children",
      populate: {
        path: "author",
        model: User,
        select: "_id name parentId image",
      },
    });

  const totalPostCount = await Thread.countDocuments({
    parentId: { $in: [null, undefined] },
  });

  // const posts = await postsQuery.exec();
  const posts = await postsQuery.exec();

  const isNext = totalPostCount > skipAmount + posts.length;

  return { posts, isNext };
}

interface Params {
  text: string;
  author: string;
  communityId: string;
  path: string;
}

export async function createThread({
  text,
  author,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createAThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: createAThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Thread not created: ${error.message}`);
  }
}

export async function fetchThreadById(id: string) {
  connectToDB();
  try {
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`);
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
) {
  connectToDB();

  try {
    // Find the original thread by its Id
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw new Error("Thread Not found");
    }

    // Create a new thread with the comment Text
    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Save the new thread
    const savedCommentThread = await commentThread.save();
    console.log(
      "🚀 ~ file: thread.action.ts:135 ~ savedCommentThread:",
      savedCommentThread
    );

    // update the original thread to include the new comment

    originalThread.children.push(savedCommentThread._id);

    // save the original thread
    await originalThread.save();

    revalidatePath(path);
  } catch (error) {
    throw new Error(`Error adding comment to Thread: ${error}`);
  }
}

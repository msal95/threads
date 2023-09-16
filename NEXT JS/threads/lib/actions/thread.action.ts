"use server";

import { revalidatePath } from "next/cache";
import Thread from "../modals/thread.modal";
import User from "../modals/user.modal";
import { connectToDB } from "../mongoose";

interface Params {
  text: string;
  auther: string;
  communityId: string;
  path: string;
}

export async function createThread({
  text,
  auther,
  communityId,
  path,
}: Params) {
  try {
    connectToDB();

    const createAThread = await Thread.create({
      text,
      auther,
      community: null,
    });

    await User.findByIdAndUpdate(auther, {
      $push: { threads: createAThread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Thread not created: ${error.message}`);
  }
}

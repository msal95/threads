import { fecthUserPosts } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import React from "react";
import ThreadCard from "../cards/ThreadCard/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  const result = await fecthUserPosts(accountId);

  if (!result) redirect("/");
  return (
    <section className="relative">
      <div>
        {result?.threads?.map((thread: any) => (
          <ThreadCard
            key={thread?._id}
            id={thread._id}
            currentUserId={currentUserId || ""}
            content={thread.text}
            author={
              accountType === "User"
                ? { name: result?.name, image: result?.image, id: result?.id }
                : {
                    name: thread?.author?.name,
                    image: thread?.author?.image,
                    id: thread?.author?.id,
                  }
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default ThreadsTab;

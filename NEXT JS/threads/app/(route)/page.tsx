import ThreadCard from "@/components/cards/ThreadCard/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPosts(1, 30);

  const user = await currentUser();

  // console.log("🚀 ~ file: page.tsx:5 ~ Home ~ result:", result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {!result?.posts?.length && (
          <p className="no-result">No Threads Found</p>
        )}
        {result?.posts?.map((thread) => {
          return (
            <ThreadCard
              key={thread?._id}
              id={thread._id}
              currentUserId={user?.id || ""}
              content={thread.text}
              author={thread.author}
              community={thread.community}
              createdAt={thread.createdAt}
              comments={thread.children}
            />
          );
        })}
      </section>
    </>
  );
}

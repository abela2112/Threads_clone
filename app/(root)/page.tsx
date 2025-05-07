import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";

async function Home() {
  const user = await currentUser();
  if (!user) {
    console.log("No user is logged in");
    return <p>Please log in to view the content.</p>;
  }
  const result = await fetchPosts();
  console.log("result", result);
  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <section className="mt-9 flex flex-col gap-10">
          {result?.posts.length === 0 ? (
            <p className="no-result">No threads found</p>
          ) : (
            <>
              {result?.posts.map((post) => (
                <ThreadCard
                  key={post._id}
                  id={post._id}
                  text={post.text}
                  authorId={post.authorId}
                  currentUserId={user?.id || ""}
                  parentId={post.parentId}
                  communityId={post.communityId}
                  createdAt={post.createdAt}
                  comments={post.children}
                  likes={Object?.fromEntries(post.likes)}
                />
              ))}
            </>
          )}
        </section>
      </Suspense>
    </>
  );
}

export default Home;

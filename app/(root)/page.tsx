import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

async function Home() {
  const user = await currentUser();
  const result = await fetchPosts();

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
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
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}

export default Home;

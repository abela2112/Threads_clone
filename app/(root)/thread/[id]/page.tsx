import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const thread = await fetchThreadById(params?.id);

  if (!thread) {
    return {
      title: "Thread not found",
      description: "This thread does not exist.",
    };
  }

  return {
    title: `${thread.text.slice(0, 50)}... | Thread App`,
    description: `A thread by ${
      thread?.authorId?.username || "a user"
    } - ${thread?.text?.slice(0, 100)}`,
    openGraph: {
      title: thread.text.slice(0, 50),
      description: thread.text.slice(0, 100),
      url: `https://yourdomain.com/thread/${thread._id}`,
      siteName: "Thread",
      images: [
        {
          url:
            thread?.authorId?.image || "https://yourdomain.com/default-og.png",
          width: 800,
          height: 600,
        },
      ],
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: thread.text.slice(0, 50),
      description: thread.text.slice(0, 100),
      images: [
        thread.authorId?.image || "https://yourdomain.com/default-og.png",
      ],
    },
  };
}

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  if (!id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  if (!userInfo || !userInfo.onBoard) redirect("/onboarding");

  const thread = await fetchThreadById(id);
  if (!thread) return redirect("/");
  console.log("thread", thread);
  return (
    <section className="relative">
      <ThreadCard
        id={thread._id}
        text={thread.text}
        authorId={thread.authorId}
        currentUserId={user?.id || ""}
        parentId={thread.parentId}
        communityId={thread.communityId}
        createdAt={thread.createdAt}
        comments={thread.children}
        likes={Object.fromEntries(thread.likes)}
      />

      <div className="mt-7">
        <Comment
          threadId={JSON.stringify(thread?._id)}
          currentUserImg={userInfo?.image}
          currentUserId={JSON.stringify(userInfo?._id)}
        />
      </div>
      <div className="mt-10">
        {thread.children.map((comment: any) => (
          <ThreadCard
            key={comment._id}
            id={comment._id}
            text={comment.text}
            authorId={comment.authorId}
            currentUserId={user?.id || ""}
            parentId={comment.parentId}
            communityId={comment.communityId}
            createdAt={comment.createdAt}
            comments={comment.children}
            likes={Object.fromEntries(comment.likes)}
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;

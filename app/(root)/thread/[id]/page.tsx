import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  const {id}=await params;
  if (!id) return null;

  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  // if (!userInfo) return null;
  if (!userInfo || !userInfo.onBoard) redirect("/onboarding");

  const thread = await fetchThreadById(params.id);
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
      />

      <div className="mt-7">
        <Comment threadId={JSON.stringify(thread._id)} currentUserImg={userInfo?.image} currentUserId={JSON.stringify(userInfo._id)}/>
      </div>
      <div className="mt-10">
        {thread.children.map((comment:any) => (
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
            isComment={true}
          />
        ))}
      </div>
    </section>
  );
};

export default Page;

import { fetchUserPosts } from "@/lib/actions/user.action";
import ThreadCard from "../cards/ThreadCard";
import { redirect } from "next/navigation";
import { fetchCommunityPosts } from "@/lib/actions/community.action";

type Props = {
  currentUserId: string;
  accountId: string;
  accountType: string;
};

async function ThreadTab({ currentUserId, accountId, accountType }: Props) {
  console.log("accountId", accountId);
  console.log("accountType", accountType);
  let result: any;
  if (accountType === "User") {
    result = await fetchUserPosts(accountId);
  } else {
    result = await fetchCommunityPosts(accountId);
  }
  console.log("result", result);
  if (!result) return redirect("/");
  return (
    <div className="mt-9 flex flex-col gap-10">
      {result?.threads?.map((post: any) => (
        <ThreadCard
          key={post._id}
          id={post._id}
          text={post.text}
          authorId={
            accountType === "User"
              ? { id: result.id, name: result.name, image: result.image }
              : {
                  id: post.authorId.id,
                  name: post.authorId.name,
                  image: post.authorId.image,
                }
          }
          currentUserId={currentUserId}
          parentId={post.parentId}
          communityId={post.communityId}
          createdAt={post.createdAt}
          comments={post.children}
          likes={Object.fromEntries(post.likes)}
          isProfile
        />
      ))}
    </div>
  );
}

export default ThreadTab;

"use client";
import { likeOrUnlikeThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  userId: string;
  threadId: string;
  threadLikes?: Record<string, boolean>;
}
const LikeButton = ({ userId, threadId, threadLikes }: Props) => {
  const pathname = usePathname();
    // const isLiked = threadLikes?.get(userId) || false;
    console.log("isLiked", threadLikes?.[userId]);
  const handleClick = async () => {
   try {
    console.log("Like button clicked", userId, threadId);
    // Add your like functionality here
    await likeOrUnlikeThread(threadId, userId, pathname);
   } catch (error) {
    console.error("Error liking thread:", error);
   }
  };
 
  return (
    <button
        aria-label="like thread"
        type="button"
        // className="flex items-center justify-center"
    
    onClick={() => handleClick()}>
      <Image
        src={threadLikes?.[userId] ? "/assets/heart-filled.svg":"/assets/heart-gray.svg"}
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
      />
    </button>
  );
};

export default LikeButton;

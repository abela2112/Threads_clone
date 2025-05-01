import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  id: string;
  text: string;
  authorId: {
    id: string;
    name: string;
    image: string;
  };
  currentUserId: string;
  parentId: string;
  communityId: { id: string; name: string; image: string } | null;
  createdAt: string;
  comments: {
    authorId: {
      image: string;
    };
  }[];

  isComment?: boolean;
};

const ThreadCard = ({
  id,
  text,
  authorId,
  currentUserId,
  parentId,
  communityId,
  createdAt,
  comments,
  isComment = false,
}: Props) => {
  
    console.log("communityId", communityId);
  
  return (
    <article
      className={`flex flex-col w-full rounded-2xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link
              href={`/profile/${authorId.id}`}
              className="relative w-11 h-11"
            >
              <Image
                src={authorId.image}
                alt="profile image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${authorId.id}`} className="w-fit">
              <h4 className="text-base-semibold text-light-1 cursor-pointer">
                {authorId.name}
              </h4>
            </Link>
            <p className="text-sm-regular text-light-2 mt-2">{text}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  src={"/assets/heart-gray.svg"}
                  alt="heart"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src={"/assets/reply.svg"}
                    alt="reply"
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                  {/* <p className="text-sm-regular text-light-2">{comments.length}</p> */}
                </Link>
                <Image
                  src={"/assets/repost.svg"}
                  alt="repost"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src={"/assets/share.svg"}
                  alt="share"
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />
              </div>
              {!isComment && comments.length > 0 && (
                <p className="mt-2 text-subtle-medium text-gray-1">
                  {comments.length} repl{comments.length > 1 ? "ies" : "y"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.authorId.image}
              alt={`user ${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}
          <Link href={`/thread/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && communityId && (
        <Link
          href={`/communities/${communityId.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}
            {communityId && ` - ${communityId.name} Community`}
          </p>

          <Image
            src={(communityId && communityId?.image) || ""}
            alt={(communityId && communityId?.name) || ""}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default ThreadCard;

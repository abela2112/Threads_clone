import { Edit } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
interface Props {
  currentUserId: string;
  AccountId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  type?: "User" | "Community";
}
const ProfileHeader = ({
  currentUserId,
  AccountId,
  name,
  username,
  image,
  bio,
}: Props) => {
  console.log("currentUserId", currentUserId);
  console.log("AccountId", AccountId);
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-col w-full">
        <div className="flex items-start gap-3">
          <div className="flex justify-between items-center gap-2">
            <div className="relative w-20 h-20">
              <Image
                src={image}
                alt="profile image"
                fill
                className="rounded-full object-cover shadow-2xl"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-left text-heading3-bold text-light-1">
                {name}
              </h2>
              <p className="text-base-medium text-gray-1">@{username}</p>
            </div>
            {currentUserId === AccountId && (
              <div className="flex items-center gap-3">
                <Link
                  href={`/profile/${currentUserId}/edit`}
                  className="text-stone-50"
                >
                  <Edit />
                </Link>
              </div>
            )}
          </div>
        </div>
        <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
        <div className="mt-12 h-0.5 bg-dark-3 w-full" />
      </div>
    </div>
  );
};

export default ProfileHeader;

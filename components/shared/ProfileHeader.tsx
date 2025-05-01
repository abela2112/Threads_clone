import Image from "next/image";
import React from "react";
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
  return (
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
        </div>
      </div>
      <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>
      <div className="mt-12 h-0.5 bg-dark-3 w-full"/>
    </div>
  );
};

export default ProfileHeader;

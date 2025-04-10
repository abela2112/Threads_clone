"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type Props = {
  userId: string;
  name: string;
  username: string;
  image: string;
  personType: string;
};

const UserCard = ({ userId, name, username, image, personType }: Props) => {
  const router=useRouter()
  return (<article className="user-card">
    <div className="user-card_avatar">
        <Image src={image} alt={name} width={40} height={40} className="rounded-full" />
    </div>

    <div className="flex-1 text-ellipsis">
        <h4 className="text-base-semibold text-light-1">{name}</h4>
        <p className="text-small-medium text-gray-1">@{username}</p>
    </div>
    <Button className="user-card_btn" onClick={()=>{router.push(`/profile/${userId}`)}}>View</Button>
  </article>);
};

export default UserCard;

import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
interface PageProps {
  params: Promise<{ id: string }>;
}
const page =async ({ params }: PageProps) => {
    const user = await currentUser();
    const { id } = await params;
  
    if (!user) return null;
    const userInfo = await fetchUser(id);
  
    if (userInfo?._id === user.id && (!userInfo || !userInfo?.onBoard))
      redirect("/onboarding");
    const userData = {
      id: userInfo?.id || "",
      objectId: userInfo?._id?.toString() || "",
      name: userInfo?.name || "",
      username: userInfo?.username || "",
      image: userInfo?.image || "",
      bio: userInfo?.bio || ""
    };
  return (
    <div>
      <h1 className="head-text">Edit profile</h1>
      {/* <p className="mt-3 text-base-regular text-light-2">this is the edit profile page</p> */}
      <div className="mt-10">
      <AccountProfile user={userData} btnTitle="Save Changes"/>
    
      </div>
      </div>
  )
}

export default page
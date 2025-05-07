import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page() {
  const user = await currentUser();
  if (!user) return;

  const userInfo = await fetchUser(user?.id);
  if (userInfo && userInfo?.onBoard) redirect("/"); // If the user is already onboarded, redirect to another page or return null
  const userData = {
    id: user?.id,
    objectId: userInfo && userInfo?._id,
    name: userInfo ? userInfo?.name : user?.firstName,
    username: userInfo ? userInfo?.username : user?.username,
    image: userInfo ? userInfo?.image : user?.imageUrl,
    bio: userInfo ? userInfo?.bio : "",
  };

  return (
    <main className="flex flex-col justify-start mx-auto max-w-3xl py-20 px-10">
      <div className="head-text">Onboarding</div>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>
      <section className="mt-9 bg-dark-2 p-10 rounded-md">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}
export default Page;

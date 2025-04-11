import { fetchUser, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);

  if (!userInfo || !userInfo.onBoard) redirect("/onboarding");

  const activities = await getActivity(userInfo?._id);
  return (
    <>
    <h1 className="head-text">Activity</h1>
    <section className="mt-10 flex flex-col gap-5">
      {(activities ?? []).length > 0 ? (
        activities?.map((activity) => (
          <Link
            key={activity?._id}
            href={`/thread/${activity?.parentId}`}
            className="activity-card"
          >
            <Image
              src={activity?.authorId?.image}
              alt="profile"
              width={20}
              height={20}
              className={"rounded-full object-contain"}
            />
            <p className="!text-small-regular text-light-1">
              <span className="mr-1 text-primary-500">
                {activity?.authorId?.name}
              </span>
              {"  "}
              replied to your thread
            </p>
          </Link>
        ))
      ) : (
        <p className="no-result">No activity yet</p>
      )}
    </section>
    </>
  );
};

export default Page;

import CommunityCard from "@/components/cards/CommunityCard";
import Searchbar from "@/components/shared/Searchbar";
import { fetchCommunities } from "@/lib/actions/community.action";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const user = await currentUser();
  console.log("user", user);
  if (!user) {
    redirect("/sign-in");
    return null; // Return null if user is not logged in
  }
  const userInfo = await fetchUser(user?.id);

  if (!userInfo || !userInfo.onBoard) {
    redirect("/onboarding");
    return null; // Return null if user is not onboarded
  }
  const searchProps = await searchParams;

  const result = await fetchCommunities({
    searchString: searchProps?.q as string,
    pageNumber: 1,
    pageSize: 20,
  });
  // console.log("result", result);
  // return (<h1>hello world</h1>);
  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>
      <Searchbar routerType="communities" />
      <div className="mt-14 flex-wrap gap-9">
        {result?.communities.length === 0 ? (
          <p className="no result">No communities found</p>
        ) : (
          <>
            {result?.communities.map((community) => {
              console.log("community", community);
              return (
                <CommunityCard
                  key={community._id}
                  id={community.id}
                  name={community.name}
                  username={community.username}
                  imgUrl={community.image}
                  bio={community.bio}
                  members={
                    Array.isArray(community.members) ? community.members : []
                  }
                />
              );
            })}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;

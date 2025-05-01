import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs, profileTabs } from "@/constants";
import Image from "next/image";
import ThreadTab from "@/components/shared/ThreadTab";
import { fetchCommunityDetails } from "@/lib/actions/community.action";
import UserCard from "@/components/cards/UserCard";
interface PageProps {
  params: Promise<{ id: string }>;
}
async function Page({ params }: PageProps) {
  const user = await currentUser();
  const { id } = await params; // Extract the communityId from the params

  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  if (!userInfo || !userInfo.onBoard) redirect("/onboarding");

  const community = await fetchCommunityDetails(id);
  if (!community) return <p className="no-result">Community not found</p>;

  return (
    <section>
      <ProfileHeader
        currentUserId={user.id}
        AccountId={community?._id}
        name={community?.name}
        username={community?.username}
        image={community?.image}
        bio={community?.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab w-full">
            {communityTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                  src={tab.icon}
                  alt={tab.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {community?.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={"threads"}>
            <ThreadTab
              currentUserId={user.id}
              accountId={community?._id}
              accountType="Community"
            />
          </TabsContent>
          <TabsContent value={"members"}>
            <section className="mt-9 flex flex-col gap-10">
              {community.members.map((member: any) => (
                <UserCard
                  key={member.id}
                  image={member.image}
                  name={member.name}
                  username={member.username}
                  userId={member.id}
                  personType="Community"
                />
              ))}
            </section>
          </TabsContent>
          <TabsContent value={"requests"}>
            {/* <ThreadTab
              currentUserId={user.id}
              accountId={userInfo.id}
              accountType="User"
            /> */}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
export default Page;

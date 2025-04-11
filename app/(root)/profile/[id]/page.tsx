import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import Image from "next/image";
import ThreadTab from "@/components/shared/ThreadTab";
interface PageProps {
  params: Promise<{ id: string }>;
}
async function Page({ params }: PageProps) {
  const user = await currentUser();
  const { id } = await params;

  if (!user) return null;
  const userInfo = await fetchUser(id);

  if (!userInfo) return null;

  if (userInfo?._id === user.id && !userInfo.onBoard) redirect("/onboarding");
  const userId = user.id;
  console.log("user id", userInfo);

  return (
    <section>
      <ProfileHeader
        currentUserId={userId}
        AccountId={userInfo?._id}
        name={userInfo?.name}
        username={userInfo?.username}
        image={userInfo?.image}
        bio={userInfo?.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab w-full">
            {profileTabs.map((tab) => (
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
                    {userInfo?.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value}>
              <ThreadTab
                currentUserId={userId}
                accountId={userInfo.id}
                accountType="User"
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
export default Page;

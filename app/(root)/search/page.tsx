import UserCard from "@/components/cards/UserCard";
import Pagination from "@/components/shared/Pagination";
import Searchbar from "@/components/shared/Searchbar";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const user = await currentUser();
  if (!user) return null;
  const userInfo = await fetchUser(user.id);
  const searchProps = await searchParams;
  if (!userInfo || !userInfo.onBoard) redirect("/onboarding");
  const result = await fetchUsers({
    userId: user.id,
    searchParams: searchProps?.q as string,
    pageNum: searchProps?.page ? Number(searchProps?.page) : 1,
    pageSize: 10,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <Searchbar routerType="search" />
      <div className="mt-14 flex flex-col gap-9">
        {result?.usersList.length === 0 ? (
          <p className="no result">No users found</p>
        ) : (
          <>
            {result?.usersList.map((user) => (
              <UserCard
                key={user.id}
                userId={user.id}
                name={user.name}
                username={user.username}
                image={user.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
      <Pagination
        pageNumber={searchProps?.page ? +Number(searchProps?.page) : 1}
        isNext={result?.isNext ?? false}
        path="search"
      />
    </section>
  );
};

export default Page
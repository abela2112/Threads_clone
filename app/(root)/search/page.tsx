import UserCard from "@/components/cards/UserCard";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async() => {
    const user = await currentUser();
      if (!user) return null;
      const userInfo=await fetchUser(user.id)
    
      if (!userInfo.onBoard) redirect("/onboarding");
    const result=await fetchUsers({userId:user.id,searchParams:"",pageNum:1,pageSize:10})

    
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>
      <div className="mt-14 flex flex-col gap-9">
        {result?.usersList.length===0 ? (<p className="no result">No users found</p>):(
            <>
            {result?.usersList.map((user)=><UserCard key={user.id} userId={user.id} name={user.name} username={user.username} image={user.image} personType="User" />)}</>
        )}
      </div>
    </section>
  )
}

export default Page
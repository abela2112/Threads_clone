"use client";
import { sidebarLinks } from "@/constants";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
function LeftSidebar() {
  
  const pathname = usePathname(); // Get the current pathname from the router
  const { userId, sessionId, getToken, isLoaded, isSignedIn } = useAuth(); // Get the userId from the auth context
  console.log("userId", userId,"sessionId", sessionId,"isLoaded", isLoaded, "isSignedIn", isSignedIn);
  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route; // Check if the current pathname includes the route of the link

          if (link.route === "/profile") link.route = `/profile/${userId}`;
          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutOptions={{ redirectUrl: "/sign-in" }}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src={"assets/logout.svg"}
                alt="logout"
                width={24}
                height={24}
                className={"object-contain"}
              />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}

export default LeftSidebar;

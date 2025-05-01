"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Searchbar = ({ routerType }: { routerType: string }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        router.push(`/${routerType}?q=${searchTerm}`);
      } else {
        router.push(`/${routerType}`);
      }
      return () => clearTimeout(delayDebounceFn);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, routerType]);
  return <section className="searchbar">
    <Image
      src="/assets/search-gray.svg"
      alt="search"
      width={24}
      height={24}
      className="object-contain"
    />
    <input
      type="text"
      placeholder={`Search ${routerType}`}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="searchbar_input no-focus"/>
  </section>;
};

export default Searchbar;

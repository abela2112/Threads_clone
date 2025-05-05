"use client";

import { deleteThread } from "@/lib/actions/thread.action";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  id: string;
}
const DeleteThreadButton = ({ id }: Props) => {
  const pathname = usePathname();
  const handleDelete = async () => {
    try {
      await deleteThread(id, pathname);
    } catch (error) {
      console.log("Error deleting thread:", error);
    }
  };
  return (
    <div className="flex items-start justify-center">
      <button
        onClick={() => handleDelete()}
        aria-label="delete thread"
        type="button"
        className="flex items-center justify-center"
      >
        <Image
          src={"/assets/delete.svg"}
          alt="delete.svg"
          width={14}
          height={14}
          className="cursor-pointer object-contain "
        />
      </button>
    </div>
  );
};
//

export default DeleteThreadButton;

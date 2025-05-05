"use client";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { FacebookIcon } from "lucide-react";
const ShareButton = ({ threadId }: { threadId: string }) => {
  const pathname = usePathname();
  const [isCopied, setIsCopied] = useState(false);

  const threadUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }${pathname}${threadId}`;

  const handleCopy = async () => {
    // try {
    //   await navigator.clipboard.writeText(threadUrl);
    //   alert("Copied to clipboard!");
    // } catch (err) {
    //   console.error("Failed to copy: ", err);
    // }

    if (threadUrl === "#") {
      toast.error("Failed to generate share link. Please try again.");
      return;
    }

    // Open the share link in a new tab
    // window.open(shareLink, '_blank', 'noopener,noreferrer');

    // Optional: Copy to clipboard
    navigator.clipboard
      .writeText(threadUrl)
      .then(() => {
        setIsCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
      })
      .catch((err) => {
        console.error("Failed to copy to clipboard:", err);
        toast.error("Failed to copy link.");
      });
  };

  //   return (
  //     <div className="relative flex items-center justify-center">
  //       <button
  //         onClick={() => setOpen((prev) => !prev)}
  //         aria-label="share thread"
  //         type="button">
  //         <Image
  //           src={"/assets/share.svg"}
  //           alt="share"
  //           width={24}
  //           height={24}
  //           className="cursor-pointer object-contain"
  //         />
  //       </button>

  //       {open && (
  //         <div className="absolute z-50 mt-2 w-56 bg-white shadow-lg rounded-md p-4 space-y-3">
  //           <p className="text-sm text-gray-700">Share this thread:</p>

  //           <div className="flex flex-col space-y-2">
  //             <a
  //               href={`https://t.me/share/url?url=${encodeURIComponent(
  //                 threadUrl
  //               )}`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="text-blue-600 hover:underline"
  //             >
  //               Telegram
  //             </a>

  //             <a
  //               href={`https://wa.me/?text=${encodeURIComponent(threadUrl)}`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="text-green-600 hover:underline"
  //             >
  //               WhatsApp
  //             </a>

  //             <a
  //               href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
  //                 threadUrl
  //               )}`}
  //               target="_blank"
  //               rel="noopener noreferrer"
  //               className="text-blue-400 hover:underline"
  //             >
  //               Twitter
  //             </a>

  //             <button
  //               onClick={handleCopy}
  //               className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
  //             >
  //               Copy Link
  //             </button>
  //           </div>
  //         </div>
  //       )}

  //     </div>
  //   );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" aria-label="share thread">
          <Image
            src={"/assets/share.svg"}
            alt="share"
            width={24}
            height={24}
            className="cursor-pointer object-contain"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle>Share this Thread Via</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-x-2">
          <div className="my-5 flex items-center space-x-5 justify-between mx-auto">
            <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center">
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  threadUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <Image
                  src={"/assets/telegram-logo.webp"}
                  alt="telegram"
                  width={32}
                  height={32}
                  className="cursor-pointer object-contain"
                />
              </a>
            </div>

            <div>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(threadUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                <Image
                  src={"/assets/whatsapp-logo.png"}
                  alt="whatsapp"
                  width={32}
                  height={32}
                  className="cursor-pointer object-contain"
                />
              </a>
            </div>

            <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  threadUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                <Image
                  src={"/assets/twitter-x-logo.png"}
                  alt="twitter"
                  width={32}
                  height={32}
                  className="cursor-pointer object-contain"
                />
              </a>
            </div>
            <div className="w-8 h-8 bg-white rounded-full border border-gray-700 flex items-center justify-center">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  threadUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                <Image
                  src={"/assets/facebook-circle-logo-png.png"}
                  alt="facebook"
                  width={32}
                  height={32}
                  className="cursor-pointer object-contain"
                />
                {/* <FacebookIcon className="w-5 h-5" /> */}
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-400"> copy Link</p>
          <div className="my-2 flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input id="link" defaultValue={threadUrl} readOnly />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3 cursor-pointer"
              variant="secondary"
              onClick={() => handleCopy()}
              aria-label="copy link"
            >
              <span className="sr-only">Copy</span>
              {isCopied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareButton;

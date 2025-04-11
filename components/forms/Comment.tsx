"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { CommentValidation } from "@/lib/validationSchema/threads";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";

type Props = {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
};

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
   const router = useRouter();
    const pathname = usePathname(); // Get the current pathname for redirection after update
    const form = useForm<z.infer<typeof CommentValidation>>({
      resolver: zodResolver(CommentValidation),
      defaultValues: {
        thread: "",
      },
    });
   const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    try {
      await addCommentToThread(
        JSON.parse(threadId),
        JSON.parse(currentUserId),
        values.thread,
        pathname
      );
      form.reset(); // Reset the form after submission
    } catch (error) {
      console.log("Error adding comment:", error);
    }

     };
  return (
    <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="comment-form"
          >
            <FormField
              control={form.control}
              name="thread"
              render={({ field }) => (
                <FormItem className="flex gap-3 items-center w-full">
                  <FormLabel>
                    <Image src={currentUserImg} alt="profile image" className="rounded-full object-cover" width={48} height={48}/>
                  </FormLabel>
                  <FormControl className="border-none bg-transparent">
                    <Input
                    type="text"
                      placeholder="Comment..."
                      className="no-focus text-light-1 outline-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
    
            <Button type="submit" className="comment-form_btn">
              Reply
            </Button>
          </form>
        </Form>

  );
};

export default Comment;

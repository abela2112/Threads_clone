"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { ThreadValidation } from "@/lib/validationSchema/threads";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useOrganization } from "@clerk/nextjs";
import { Textarea } from "../ui/textarea";
import { createThread } from "@/lib/actions/thread.action";
import { useState } from "react";

type Props = {
  userId: string;
};

const PostThread = ({ userId }: Props) => {
  //   const [files, setFiles] = React.useState<File[]>([]); // State to hold the uploaded files
  //   const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // State to manage loading state
  const { organization } = useOrganization(); // Get the organization from Clerk
  const pathname = usePathname(); // Get the current pathname for redirection after update
  const form = useForm<z.infer<typeof ThreadValidation>>({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
    },
  });
  console.log("community id", organization);

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    try {
      setIsLoading(true); // Set loading state to true
      const thread = await createThread({
        text: values.thread,
        authorId: userId,
        communityId: organization ? organization.id : "",
        path: pathname,
      });
      console.log("thread", thread);
      console.log("community id", organization);
      setIsLoading(false); // Reset loading state
      form.reset(); // Reset the form after submission
      router.push("/");
    } catch (error: any) {
      setIsLoading(false); // Reset loading state on error
      console.log("Error updating user:", error.message);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 "
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2 ">
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={50}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;

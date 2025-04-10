"use client";
import { userSchema } from "@/lib/validationSchema/user";
import React, { ChangeEvent } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import {
  Form,
  FormControl,
  
  FormField,
  FormItem,
  FormLabel,

} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { updateUser } from "@/lib/actions/user.action";
import { useRouter, usePathname } from "next/navigation";

type Props = {
  user: {
    id: string;
    objectId: string;
    name: string | null;
    username: string | null;
    image: string;
    bio: string;
  };
  btnTitle?: string;
};

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [files, setFiles] = React.useState<File[]>([]); // State to hold the uploaded files
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname(); // Get the current pathname for redirection after update
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: user?.username || "", // Allow null or empty string
      name: user?.name || "", // Allow null or empty string
      profile_photo: user?.image || "", // Allow null or empty string
      bio: user?.bio || "",
    },
  });
  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files)); // Store the files in state
      if (!file.type.includes("image")) return;

      fileReader.onloadend = async (event) => {
        const imageUrl = (event.target?.result as string) || ""; // Get the image URL from the FileReader result
        fieldChange(imageUrl); // Update the form field with the image URL
      };
      fileReader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  // 2. Define a submit handler.
  const  onSubmit= async(values: z.infer<typeof userSchema>)=> {
   try {
    console.log("Submitting form with values:", values);
    const blob = values.profile_photo;
    const isImageChanged = isBase64Image(blob);

    if (isImageChanged) {
      // If the image is changed, upload it
      console.log("Image has changed, starting upload...");
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].ufsUrl) {
        console.log("Image uploaded successfully:", imgRes[0]);
        values.profile_photo = imgRes[0].ufsUrl; // Update the profile_photo field with the new URL
      }
    }

    const updatedUser = await updateUser({
      userId: user.id,
      name: values.name,
      username: values.username,
      bio: values.bio,
      image: values.profile_photo,
      pathname,
    });
    if (pathname === "profile/edit" && updatedUser) {
      router.back();
    } else {
      router.push("/");
    }
   } catch (error:any) {
    console.log("Error updating user:", error.message);
   }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 "
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="Profile Image"
                    width={96}
                    priority
                    height={96}
                    className="object-contain rounded-full"
                  />
                ) : (
                  <Image
                    src={"assets/profile.svg"}
                    alt="Profile Image"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, field.onChange)} // handleImageChange is a function to handle image change
                  className="account-form_image-input"
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-1">
                Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2 ">
                Username
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2 ">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;

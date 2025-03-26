"use client";

import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TypeOf, z } from "zod";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast, useToast } from "@/hooks/use-toast";
import { apiResponse } from "@/types/apiResponseType";

const page = () => {
  const params = useParams();
  console.log("paramas", params);
  const username = params.username;
  const { toast } = useToast();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (
    data: z.infer<typeof messageSchema> /*data : {content : string}*/
  ) => {
    const content = data?.content;
    try {
      const response = await axios.post("/api/send-message", {
        username,
        content,
      });
      console.log("response", response);
      toast({
        title: response.data.message,
        variant: "default",
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid place-items-center w-full">
      <div className="mt-3 w-full max-w-6xl  py-8 grid grid-cols-1 gap-5 ">
        <h1 className="text-4xl py-5 font-bold text-center">
          Public Profile Link
        </h1>

        <div className="grid grid-cols-1 gap-4 mt-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Write your anouymous message here"
                        id="message-2"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button type="submit">Send It</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default page;

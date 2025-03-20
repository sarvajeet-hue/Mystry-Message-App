"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchemas";
import { apiResponse } from "@/types/apiResponseType";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const verifyAccount = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  console.log("params", params);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log("data", data);
    const username = params.username;

    try {
      const verify_code = await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });

      router.replace("sign-in");
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<apiResponse>;  
      
      
    }
  };

  return ( 
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-3">
      <div className="w-full max-w-md lg:max-w-lg p-8  space-y-8 bg-white rounded-lg shadow-md">

        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
            <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <FormProvider {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default verifyAccount;

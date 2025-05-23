"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function SignIn() {
  const router = useRouter();
  const {toast} = useToast();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    console.log("data", data);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
      
    });
    console.log("result", result);

    if (result?.error) {
      console.log("Incorrect Username or Password");
      toast({
        title : "Sign in Failed" , 
        description : "Incorrect Username or Password",
        variant : "destructive"
      })
    }
    if (result?.url) {
      console.log("result_url" , result?.url)
      router.replace("/dashboard");
      toast({
        title : "SignIn Successfully" , 
        description : "Welcome to the Mystry App",
        variant : "default"
      })
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800 p-3">
      <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Email/Username" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">SignIn</Button>
          </form>
        </Form>

        <p>
          Already a member?{" "}
          <Link href={"/sign-up"} className="text-blue-600 hover:text-blue-800">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

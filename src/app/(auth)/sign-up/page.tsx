"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue , useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchemas";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponseType";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmiting] = useState(false);
  

  const debounced = useDebounceCallback(setUsername, 300);
  console.log("debounced" , debounced)
  

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username){
        
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameMessage(response?.data?.message);
        } catch (error) {
          const axiosError = error as AxiosError<apiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking Username"
          );
        } finally {
          setIsCheckingUsername(false);

        }
      }
    };

    
    checkUsernameUnique();
  }, [username]);
                                                                                                             
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmiting(true);
    console.log("data" , data)
    try {
      const dataResponse = await axios.post<apiResponse>("/api/sign-up", data);
      console.log("dataRespose" , dataResponse)
      router.replace(`/verify/${username}`);

      setIsSubmiting(false);
    } catch (error) {
      console.error("error in signup of user", error);
      const axiosError = error as AxiosError<apiResponse>;
      let errorMessage = axiosError.response?.data.message;
      setIsSubmiting(false);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-800">
        <div className="w-full max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">  
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Welcome Back to True Feedback
            </h1>
            <p className="mb-4">
              Sign in to continue your secret conversations
            </p>
          </div>

          <FormProvider  {...form}>
            <form className="grid gap-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    
                    {isCheckingUsername && <p>Loading...</p>}

                    <p className={`text-sm ${usernameMessage === "Username is Unique" ? ('text-green-600') : ('text-red-500')} ` }>
                      {usernameMessage}
                    </p>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
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
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {
                  isSubmitting ? (
                    <>
                      Please Wait...
                    </>
                  ) 
                  :
                   ("Signup")
                }
              </Button>
            </form>


          </FormProvider>

          
          <div className="text-center mt-4">
            <p>
              Already a member?{' '}
              <Link href={"/sign-in"} className="text-blue-600 hover:text-blue-800">Sign In</Link>
            </p>
              
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";



import { apiResponse } from "@/types/apiResponseType";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCcw } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast"


import {
  Card,
  CardContent,


  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();
  console.log("data_session", session);
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = useForm();

  const acceptMessages = watch("acceptMessages"); //this term need to be learn

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<apiResponse>("/api/accept-message");
      setValue("acceptMessages", response?.data?.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      console.log("axiosError", axiosError);
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]); // and this term we need to learn

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(true);

      try {
        const response = await axios.get<apiResponse>("/api/get-messages");
        console.log("response_message",response );
        // const messagesArray = Array.isArray(response.data.message) ? response.data.message : [];
        setMessages(response.data.messages || [])
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const AxiosError = error as AxiosError<apiResponse>;
        toast({
          title: 'Error',
          description:
          AxiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages , toast]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    console.log("acceptMessage" , acceptMessages)
    try {
      const response = await axios.post<apiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      
      setValue("acceptMessages", !acceptMessages);
    } catch (error) {
      console.log("error", error);
    }
  };


  const username = session?.user?.username ?? "Guest";
  console.log("username" , username)

  // const baseUrl = `${window.location.protocol}//${window.location.host}`

  const baseUrl = typeof window !== "undefined" 
  ? `${window.location.protocol}//${window.location.host}` 
  : ""; // Provide a fallback for SSR
  const profileUrl = `${baseUrl}/u/${username}`
  console.log("baseUrl" , baseUrl)


  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };
 
  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  return (
    <>
  
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch 
        onCheckedChange={handleSwitchChange}
        {...register('acceptMessages')}
        checked={acceptMessages}
        disabled={isSwitchLoading}/>
        
        
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button className="mt-4" variant="outline">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div >
        {messages.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.map((data , index) => {
              console.log("this is the data" , data)
              return (
                
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{data.content}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{data?.createdAt.toLocaleString()}</p>
                    </CardContent>

                  </Card>
                
              );
            })}
          </div>
        ) : (
          <p>No Message Found</p>
        )}
      </div>
    </div>

    </>
  );
};

export default Page;

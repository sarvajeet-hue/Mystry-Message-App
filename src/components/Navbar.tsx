"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";


export const Navbar = () => {
  const { data: session } = useSession();

  const user = session?.user as User;
  const router = useRouter();
  

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </Link>
        {session ? (
          <>
            <span className="mr-4 uppercase font-bold">
              Welcome, {user.username || user.email}
            </span>

            <div className="flex items-center gap-4">

              {session ? (<Button
                onClick={() => router.replace('/dashboard')}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Go to the Dashboard
              </Button>) : (<></>)}
              <Button
                onClick={() => signOut()}
                className="w-full md:w-auto bg-slate-100 text-black"
                variant="outline"
              >
                Logout
              </Button>
            </div>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

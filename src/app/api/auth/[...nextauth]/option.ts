import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserModel } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        console.log("credentials", credentials);
        try {
          const user = await UserModel.findOne({
            $or: [
              { username: credentials.identifier },
              { email: credentials.identifier },
            ],
          });
      
          if (!user) {
            return Promise.reject(new Error(JSON.stringify({ message: "No user found" })));
          }
          if (!user.isVerified) {
            return Promise.reject(new Error(JSON.stringify({ message: "Please verify your account" })));
          }
      
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            return Promise.reject(new Error(JSON.stringify({ message: "Incorrect password" })));
          }
      
          return user;
        } catch (error: any) {
          console.error("Auth error:", error);
          return Promise.reject(new Error(JSON.stringify({ message: "Authentication failed" })));
        }
      }
      
      
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages; 
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};

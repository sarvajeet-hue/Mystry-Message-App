import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { Message } from "@/model/user";

export async function POST(request : Request){
    await dbConnect()

    const session = getServerSession(authOptions)

    const {username , content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success : false , 
                message : "user not found"
            } , {status : 404})
        }
        if(!user.isAcceptingMessages){
            return Response.json({
                success : false , 
                message : "user not accepting the messages"
            } , {status : 401})
        }

        const newMessages = {content , createdAt : new Date()}
        user.messages.push(newMessages as Message)
        await user.save()
        return Response.json({
            success : true , 
            message : "Message Sent Successfully"
        } , {status : 200})
    } catch (error) {
        return Response.json({
            success : false , 
            message : "user not found"
        } , {status : 500})
    }

}
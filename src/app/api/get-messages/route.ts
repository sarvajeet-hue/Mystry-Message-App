import { UserModel } from "@/model/user";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET( request : Request){
    await dbConnect();
    const session = await getServerSession(authOptions)
 
    
    const user : User  = session?.user as User
    if(!session || !session.user){
        return Response.json({
            success : false, 
            message : "user not found"
        } , {status:401})
    }

    const userId = new mongoose.Types.ObjectId(user._id)
    console.log("userId" , userId)

    try {
        const user = await UserModel.aggregate([
            {$match : {_id : userId}} , 
            {$unwind : '$messages'},
            {$sort : {'messages.createdAt' : -1}}, 
            {$group : {_id : '$_id' , messages : {$push : '$messages'}}}
        ]).exec()    
        console.log("user" , user)

        if(!user || user.length === 0){
            return Response.json({
                success : false, 
                message : "Message was not found"
            } , {status: 200})
         
        }

        return Response.json({
            success : true, 
            message : "Message fetched Successfully" , 
            messages : user[0].messages
            
        })
    } catch (error) {
        return Response.json({
            success : false, 
            message : ""
        } , {status:500})
    }
}
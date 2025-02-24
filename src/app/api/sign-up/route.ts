import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";



export async function POST (request : Request) {
    await dbConnect()
    try {
        const {username , email , password} = await request.json()
        console.log("username :" , username)
        const existingUserVerifiedByUser = await UserModel.findOne({
            username ,
            isVerified : true
            
        })
       
        if(existingUserVerifiedByUser){
            return NextResponse.json({
                success : false ,
                message : "Username is already Taken"
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        console.log("email:", existingUserByEmail)
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(!existingUserByEmail.isVerified){
                return Response.json({
                    success : false, 
                    message : "User Already exit with this email"
                } , {status : 400}) 
            }else{
                const hashedpassword = await bcrypt.hash(password , 10)
                existingUserByEmail.password = hashedpassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save()
            }
        }else{
            let hashedpassword = await bcrypt.hash(password , 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel({
                    username , 
                    email , 
                    password : hashedpassword , 
                    verifyCode ,
                    isVerified : false,
                    verifyCodeExpiry  : expiryDate,                              
                    isAcceptingMessages : true,
                    messages : []
                   
            })

            await newUser.save()
        }

        // send verification email
        const email_Response  = await sendVerificationEmail(email , username , verifyCode)
        console.log("email_response" , email_Response)

        if(!email_Response.success){
            return NextResponse.json({
                success : false,
                message : "No response in mail.success"
            }  , {status : 500}) 
        }

        return NextResponse.json({
            success : true, 
            message : "User registration is successfull please verify your email"
        } , {status : 201}) 
    }
    catch(error){
        console.log("error registering User" , error)
        return NextResponse.json(
            {
                success : false,
                message : "Error registering User"
            } , 
            {status : 500}
        )
    }
} 
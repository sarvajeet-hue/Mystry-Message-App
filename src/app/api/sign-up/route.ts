import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



export async function POST (request : Request) {
    await dbConnect()
    try {
        const {username , email , password} = await request.json()
        const existingUserVerifiedByUser = await UserModel.findOne({
            username ,
            isVerified : true
        })
        if(existingUserVerifiedByUser){
            return Response.json({
                success : false ,
                message : "Username is already Taken"
            })
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            true 
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

        if(!email_Response.success){
            return Response.json({
                success : false,
                message : email_Response.message
            }) , {status : 500}
        }

        return Response.json({
            success : true, 
            message : "User registration is successfull please verify your email"
        }) , {status : 201}
    }
    catch(error){
        console.log("error registering User" , error)
        return Response.json(
            {
                success : false,
                message : "Error registering User"
            } , 
            {status : 500}
        )
    }
} 
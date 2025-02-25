import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";

export async function POST(request : Request) {
    await dbConnect()
    try {
        const {username ,code} = await request.json()

        const decodedUsername = decodeURIComponent(username)

        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(
                {
                    success : false, 
                    message : "Username was not Found"
                }, 
                {status: 400}
            )
        }
        const isCodeValid = user.verifyCode === code    
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        
        if(isCodeValid && isCodeNotExpired){
            user.isVerified = true
            await user.save();
            return Response.json(
                {
                    success : true, 
                    message : "Account Verify SuccessFully"
                } , 
                {status : 200}
            )
        }else if(!isCodeNotExpired){
            return Response.json(
                {
                    success : false, 
                    message : "Code is Expired"
                } , 
                {status : 400}
            )
        }else {
            return Response.json(
                {
                    success : false, 
                    message : "code is Incorrect"
                } , 
                {status : 400}
            )
        }
        
        
    }catch(error){
        console.log("error while verifying the code " , error)
        return Response.json(
            {
                success : false, 
                message : "Error While Verifying the code"
            },
            {status : 500}
        )
    }
}
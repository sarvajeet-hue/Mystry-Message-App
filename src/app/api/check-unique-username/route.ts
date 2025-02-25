import { UserModel } from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchemas";



const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export  async function GET(request : Request){
    
    await dbConnect()

    try{
        const {searchParams} = new URL(request.url)
        const queryParams = {
            username : searchParams.get('username')
        }

        // validate with zod

       const result =  UsernameQuerySchema.safeParse(queryParams)
       console.log("result" , result)

       if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json(
                {
                    success : false, 
                    message : usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : 'Invalid Query Parameters'
                } ,
                {status : 400}
            )
        
            
       }

       const {username} = result.data
       const existingVerifiedUser = await UserModel.findOne({username , isVerified : true})
       if(existingVerifiedUser){
        return Response.json(
            {
                success : false, 
                message : 'Username is Already Taken'
            } ,
            {status : 400}
        )
    
       }

       return Response.json(
        {
            success : true, 
            message : 'Username is available'
        } ,
        {status : 201}
    )



    }catch(error){
        console.log("error while checking username" , error)
        return Response.json({
            success : false , 
            message : "Error checking Username"
        } , {status : 500}) 
    }
}
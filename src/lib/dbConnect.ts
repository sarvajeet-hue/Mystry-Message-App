import mongoose from "mongoose";


    

const dbConnect = async () : Promise<void> => {
    
    try {
        console.log("dv")
        const db = await mongoose.connect(process.env.MONGODB_URI || '')
        console.log("db" , db)


    }catch(error){
        console.log("db not connected successfully" , error)
    }
}


export default dbConnect
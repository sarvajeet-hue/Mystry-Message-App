import mongoose , {Schema , Document} from "mongoose";

export interface Message extends Document  {
    content : string;
    createdAt : Date
}


const MessageSchema : Schema<Message> = new Schema({
    content : {
        type : String , 
        required : true

    } , 
    createdAt : {
        type : Date,
        required : true, 
        default : Date.now
    }
})

const MessageModel = mongoose.models.Message || mongoose.model("Message" , MessageSchema)


export interface User extends Document{
    username : string, 
    email : string , 
    password : string , 
    verifyCode : string,
    isVerified : boolean,
    verifyCodeExpiry : Date,
    isAcceptingMessages : boolean,
    messages : Message[]
}

const UserSchema : Schema<User> = new Schema({
    username : {
        type : String, 
        required : [true , "Username is required"],
        unique : true, 
        trim : true
    }, 
    email :  {
        type : String , 
        required : [true , "Email is required"],
        unique : true
    }, 
    password : {
        type : String, 
        required : [true , "Password is required"],
    },
    verifyCode : {
        type : String, 
        required : [true , "VerifyCode is required"]
    }, 
    verifyCodeExpiry : {
        type : Date
    } , 
    isAcceptingMessages : {
        type : Boolean , 
        default : true
    } , 
    isVerified : {
        type : Boolean,
        default : false
    } , 
    messages : [MessageSchema]


})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User" , UserSchema)

export  {UserModel , MessageModel}

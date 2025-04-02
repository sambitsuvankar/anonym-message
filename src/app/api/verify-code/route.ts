import dbConnect from '../../../lib/dbConnect'
import { z } from 'zod'
import UserModel from 'src/model/User'

export async function POST(request : Request){
    await dbConnect();

    try {
        const {username, code} = await request.json()

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username : decodedUsername})

        if(!user){
            return Response.json({
                success : false,
                message : "User not found"
            }, { status : 404 })        
        }

        if( user.verifyCode === code && user.verifyCodeExpiry > new Date() ){
            user.isVerified = true;
            await user.save();
            return Response.json({
                success : true,
                message : "User verified successfully"
            }, { status : 200 })
        }else if(user.verifyCodeExpiry < new Date()){
            return Response.json({
                success : false,
                message : "Verification code expired. Please sign-up again to get a new code"
            }, { status : 400 })
        }else {
            return Response.json({
                success : false,
                message : "Invalid verification code"
            }, { status : 400 })
        }

    } catch (error) {
        console.log("Error verifying code", error);
        return Response.json({
            success : false,
            message : "Error verifying code"
        }, { status : 500 })
    }
}
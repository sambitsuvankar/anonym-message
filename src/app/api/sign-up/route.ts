import dbConnect from "src/lib/dbConnect";
import UserModel from "src/model/User";
import bcrypt from "bcryptjs";

import {sendVerificationEmail} from "src/helper/sendVerificationEmail";


export async function POST(request : Request){
    await dbConnect();
    
    try {
        const {username, email, password}= await request.json()   // It is mandatory to use await here because request.json() returns a promise in Next.js

        console.log(username, email, password)
        // 1st wee have to check if the user is verified or not
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified : true})

        if(existingUserVerifiedByUsername){
            return Response.json({
                success : false,
                message : "Username already exists"
            },{
                status : 400
            })
        }

        // 2nd we have to check if the email is already registered or not
        const existingUserByEmail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "User already exists with this email"
                },{
                    status : 400
                })
            } else {
                // If existing user with email is not verified then update the verify code and expiry.
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000) // 1 hour
                await existingUserByEmail.save()
            }

        }else{
            const hashedPassword  = await bcrypt.hash(password, 10)

            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = new UserModel(
                {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry : expiryDate,
                    isVerified: false,
                    isAcceptingMessages: true,
                    messages: []
                }
            )

            await newUser.save()

            // Send verification email
           const emailResponse = await sendVerificationEmail(email,username,verifyCode)

           if(!emailResponse.success){
                return Response.json({
                    success : false,
                    message : emailResponse.message
                },
            {
                status : 500
            })
           }

           return Response.json(
            {
                success : true,
                message : "User Registred Succcessfully. Please verify your Email"
            },{
                status : 201
            }
           )
        }
    } catch (error) {
        console.error("Error registering user : ", error)
        return Response.json({
            success : false,
            message : "Failed to register user"
        },
        {
            status : 500
        }
)
    }
}
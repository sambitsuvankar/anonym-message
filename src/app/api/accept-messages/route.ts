import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "src/lib/dbConnect";
import UserModel from "src/model/User";
import { User } from "next-auth";

export async function POST(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions)

    // We have injected the user object in the session object in the "session" callback in the auth options.ts file.
    const user = session.user as User

    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not Authenticated"
        }, {status : 401})
    }

    const userId = user._id;

    const {acceptMessages} = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {isAcceptingMessages : acceptMessages}, {new : true})

        if(!updatedUser){
            console.log("Failed to update user status to accept messages")
            return Response.json({
                success : false,
                message : "Failed to update user status to accept messages"
            }, {status : 401})
        }else{
            return Response.json({
                success : true,
                message : "Message acceptance status updated successfully"
            }, {status : 200})

        }

        
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json({
            success : false,
            message : "Failed to update user status to accept messages"
        }, {status : 500})
    }
}

export async function GET(request : Request){
    await dbConnect();

    // Get thr user session
    const session = await getServerSession(authOptions)

    // We have injected the user object in the session object in the "session" callback in the auth options.ts file.
    const user = session.user as User

    // Check if the user is authenticated
    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not Authenticated"
        }, {status : 401})
    }

    const userId = user._id;

    try {
        // Retrieve the user from the database using the ID
        const foundUser = await UserModel.findById(userId)
        if(!foundUser){
            return Response.json({
                    success : false,
                    message : "User not Found"
                }, {status : 401})
        }
        
        //Return the user's message acceptance status
        return Response.json({
            success : true,
            isAcceptingMessages : foundUser.isAcceptingMessages
        }, {status : 200})
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
        { success: false, message: 'Error retrieving message acceptance status' },
        { status: 500 }
        );
    }
}
import mongoose from 'mongoose';
import dbConnect  from 'src/lib/dbConnect';
import { User } from 'next-auth';
import { authOptions } from './../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import UserModel from '../../../model/User'


export async function GET(request: Request){
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

        // For mongoose aggregation pipeline we need to convert the user._id which is a string to a mongoose object id
        const userId = new mongoose.Types.ObjectId(user._id) ;

        try {
            const user = await UserModel.aggregate([
                {
                    $match : {id : userId}
                },
                {
                    $unwind : "$messages"
                },
                {
                    $sort : {"messages.createdAt" : -1}
                },
                {
                    $group : { _id : '$_id', messages : {$push : '$messages'}}
                }
            ])

            if(!user || user.length === 0){
                return Response.json({
                    success : false,
                    message : "No messages found"
                }, {status : 404})
            }

            return Response.json({
                success : true,
                messages : user[0].messages
            }, {status : 404})
        } catch (error) {
            console.log(error)
            return Response.json(
                { message: 'Internal server error', success: false },
                { status: 500 }
              );
        }


}
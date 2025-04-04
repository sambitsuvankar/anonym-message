import dbConnect  from 'src/lib/dbConnect';
import { User } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import UserModel from '../../../../model/User'


export async function DELETE(request: Request, {params} : {params : {messageid : string}}){

    const messageid = params.messageid;
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

       try {
            const updateResult = await UserModel.updateOne(
                {
                    _id : user._id
                },
                {
                    $pull : {  // $pull directly remove the matched documents from the array in db
                        messages : {_id : messageid}
                    }
                }
            )

            if(updateResult.modifiedCount == 0){
                return Response.json({
                    success : false,
                    message : "Message Not found or Already deleted"
                }, {status : 404})
            }

            return Response.json({
                success : true,
                message : "Message deleted"
            }, {status : 200})
       } catch (error) {
            return Response.json({
                success : false,
                message : "Error deleting message"
            }, {status : 500})
       }

}
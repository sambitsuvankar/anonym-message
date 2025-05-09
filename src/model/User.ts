 import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content : string,
    createdAt : Date,
    _id: string
}

const MessageSchema : Schema<Message> = new Schema(
    {
        content : {
            type: String,
            required: true
        },
        createdAt : {
            type : Date,
            required : true,
            default : Date.now
        }
    }
)


export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date; 
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages: Message[];
  }

  // Updated User schema
const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    verifyCode: {
      type: String,
      required: [true, 'Verify Code is required'],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, 'Verify Code Expiry is required'],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessages: {
      type: Boolean,
      default: true,
    },
    messages: [MessageSchema],
  });
  
  const UserModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>('User', UserSchema);       
    // This means that if the model is already defined, it will not be redefined. So 1st it will look into the database that if the model is already defined or not. If it is not defined then it will define the model.
  
  export default UserModel;
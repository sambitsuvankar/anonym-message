import { Message } from "../model/User";
export interface ApiResponse{
    success : boolean;
    message : string;
    isAcceptingMessages?: boolean,   // This means that the key "isAcceptingMessages" is optional
    messages?: Array<Message>
}
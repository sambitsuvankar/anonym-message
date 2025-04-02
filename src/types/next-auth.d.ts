import { DefaultSession } from './../../node_modules/next-auth/core/types.d';
import 'next-auth'

// This file is made for extending the interface of User from next-auth
// This is done because the User object from next-auth does not have the _id field
// But we need the _id field in the User object to store the user's id from the database
// So we extend the User object from next-auth to include the _id field
// This is done by creating a new interface User which extends the User interface from next-auth

declare module 'next-auth'{
    interface User {
        _id? : string,
        isVerified?: boolean,
        isAcceptingMessages?: boolean,
        username?: string
    }

    interface Session {
        user : {
            _id? : string,
            isVerified?: boolean,
            isAcceptingMessages?: boolean,
            username?: string
        } & DefaultSession['User']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    }
  }
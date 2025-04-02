import NextAuth from "next-auth/next";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST} // This is done to make the handler available for both GET and POST requests
// As next js does not support multiple handlers for a single route, we have to export the same handler for both GET and POST requests
// This is done by exporting the handler as GET and POST
// The file structure in Next.js is such that the file name is the route and the function name is the method
// So in this case the file name is [...nextauth].ts and the function name is GET and POST
// So the route for this file will be /api/auth/[...nextauth]
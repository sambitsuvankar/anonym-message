import { z } from 'zod';

// For validating a single value
export const usernameValidation = z
  .string()
  .min(2, 'Username must be at least 2 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters');        

// For validating an object
export const signUpSchema = z.object({
  username: usernameValidation,

  email: z.string().email({ message: 'Invalid email address' }),// here we are using zod to validate the email address. where email() is it's inbuild validation method
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});
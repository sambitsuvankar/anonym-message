'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signInSchema } from '@/schemas/signInSchema';
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';


export default function SignInForm(){
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver : zodResolver(signInSchema),
    defaultValues : {
      identifier: "",
      password : ""
    }
  })


  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)

    console.log("data :", data)
    try {
        const result = await signIn("credentials", {   // As we were using the next Auth credential method for authentication
          redirect : false,
          identifier : data.identifier,
          password : data.password
        })
        console.log(result)
        if(result?.error){
          if (result.error === 'CredentialsSignin') {
            toast(
              "Login Failed",
              {
                description : "Incorrrect username or password"
              }
            )
          }else{
            toast(
              "Login Failed",
              {
                description : result.error
              }
            )
          }
        }else{
          toast(
            "Login Successful"
          )
        }

        if(result?.url){
          router.replace('/dashboard')
        }

    } catch (error) {
      
    } finally{
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <p className="mb-4">Sign In to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <Input {...field} name="email" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input type="password" {...field} name="password" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <p className='text-center'>Not a member ? <a href='/sign-up' className='text-blue-600'>Create an account</a></p>
          </form>
        </Form>
        
      </div>
    </div>
  );

}
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/hooks/use-toast";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import {
  loginUser
} from "@/apis/auth";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  phonenumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." })   
    .length(10, { message: "Phone number must be 10 digits" }), 
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export default function Login() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  
  const loginUserMutation = useMutation({
      mutationFn: loginUser,
      onSuccess: (result) => {
        toast({ title: "User Verified" });
        setAccessToken(result.access_token);
        router.push("/dashboard");
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message });
      },
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { phonenumber: "", password: "" },
  });

  const onSubmit = (data: { phonenumber: string; password: string }) => {
    data.phonenumber = "+1" + data.phonenumber
    loginUserMutation.mutate(data);
  }

  return (
    <div className="flex items-center justify-center h-screen w-full bg-blue-500">
      {/* Login Form Card */}
      <Card className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>See Your Network.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name="phonenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="xxx-xxx-xxxx" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Submit Button and Signup Link */}
              <div className="flex flex-col items-center">
                <Button type="submit" className="w-full">
                  Log in
                </Button>
                <Link href="/signup" className="mt-2 text-sm text-gray-500">
                  Don&apos;t have an account? Sign up.
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

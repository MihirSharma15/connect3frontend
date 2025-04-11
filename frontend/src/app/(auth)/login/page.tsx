"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "@/components/hooks/use-toast";
import React, { useState, useEffect } from "react";
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
import { setAuthCookie } from "@/utils/authUtils";
import { useSearchParams } from "next/navigation";
import { connectByInviteCode, searchUserByInviteCode } from "@/apis/auth";

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
import UnauthenticatedRoute from "@/app/(auth)/UnauthenticatedRoute";

export default function Login() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("inviteCode");

  useEffect(() => {
    if (inviteCode) {
      (async () => {
        try {
          await searchUserByInviteCode(inviteCode);
          setInviteError(null);
        } catch (error: any) {
          setInviteError("Invite Code Expired or Not Valid.");
        }
      })();
    }
  }, [inviteCode]);
  
  const loginUserMutation = useMutation({
      mutationFn: loginUser,
      onSuccess: (result) => {
        toast({ title: "User Verified" });
        setAuthCookie(result.token);
        if (inviteCode) {
          connectMutation.mutate(inviteCode);
        } else {
          router.push("/dashboard");
        }
      },
      onError: (error: any) => {
        toast({ title: "Error", description: error.message });
      },
  });

  // Mutation to connect by invite code
  const connectMutation = useMutation({
    mutationFn: (code: string) => connectByInviteCode(code),
    onSuccess: (data) => {
      toast({ title: "Connection Created", description: "Your connection has been created successfully." });
    },
    onError: (error: any) => {
      // Display the error. This error text is the same as shown in your invite page.
      toast({ title: "Error", description: error.message || "Invite Code Expired or Not Valid." });
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

  if (inviteCode && inviteError) {
    return (
      <UnauthenticatedRoute>
        <div className="flex flex-col items-center justify-center absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
          <h1 className="text-4xl font-bold mb-8">
            CONNECT<span className="text-customBlue">3</span>
          </h1>
          <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle>Error</CardTitle>
              <CardDescription>{inviteError}</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </UnauthenticatedRoute>
    );
  }

  return (
    <UnauthenticatedRoute>

      <div className="flex items-center justify-center absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
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
                      <FormLabel className="text-black">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="xxx-xxx-xxxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 font-bold text-sm" />
                    </FormItem>
                  )}
                />
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-black">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600 font-bold text-sm" />
                    </FormItem>
                  )}
                />
                {/* Submit Button and Sign-Up Link */}
                <div className="flex flex-col items-center space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-[#c7d6ef]"
                  >
                    Log in
                  </Button>
                  <div className="flex items-center gap-2">
                    Don&apos;t have an account?
                    <Link href={inviteCode ? `/signup?inviteCode=${inviteCode}` : "/signup"}>
                      <Button type="button" className="w-full bg-[#c7d6ef]" size="sm">
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </UnauthenticatedRoute>
  );
}


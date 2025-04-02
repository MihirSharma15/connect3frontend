"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendOTP,
  verifyCode,
  registerUser,
  loginUser,
} from "@/apis/auth";
import { setAuthCookie } from "@/utils/authUtils";
import UnauthenticatedRoute from "@/app/(auth)/UnauthenticatedRoute";

const PhoneSchema = z.object({
  phonenumber: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." })
    .length(10, { message: "Phone number must be 10 digits" }),
});

const OTPSchema = z.object({
  pin: z.string().length(6, { message: "OTP must be 6 digits" }),
});

const UserDetailsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .refine((value) => value.trim().split(/\s+/).length >= 2, {
      message: "Please enter both first and last name",
    }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
});

export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [phonenumber, setPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const sendOTPMutation = useMutation({
    mutationFn: sendOTP,
    onSuccess: () => {
      toast({ title: "OTP Sent", description: "Check your phone for the OTP." });
      setStep(2);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const verifyOTPMutation = useMutation({
    mutationFn: verifyCode,
    onSuccess: (result) => {
      toast({ title: "OTP Verified" });
      setAccessToken(result.phone_verification_token.access_token);
      setStep(3);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const registerUserMutation = useMutation({
    mutationFn: (data: { name: string; password: string; phonenumber: string }) =>
      registerUser(data, accessToken),
    onSuccess: () => {
      toast({ title: "Account Created", description: "Welcome to CONNECT3!" });
      loginMutation.mutate({ phonenumber, password: detailsForm.getValues("password") });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      toast({ title: "User Verified" });
      setAuthCookie(result.access_token); 
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast({ title: "Login Failed", description: error.message });
    },
  });

  const phoneForm = useForm({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phonenumber: "" },
  });

  const handlePhoneSubmit = ({ phonenumber }: { phonenumber: string }) => {
    setPhoneNumber("+1" + phonenumber);
    setAccessToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIrMTk4MDMyMDUxNzgifQ.p0I6NAiKtyHo-heotQeIWQlFlnNtJYhtILMOUxXp0dI"); // TESTING DELETE LATER
    setStep(3); // TESTING DELETE LATER
    // sendOTPMutation.mutate(phonenumber); UNCOMMENT LATER
  };

  const otpForm = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: { pin: "" },
  });

  const handleOTPSubmit = ({ pin }: { pin: string }) => {
    verifyOTPMutation.mutate({ phonenumber, code: pin });
  };

  const detailsForm = useForm({
    resolver: zodResolver(UserDetailsSchema),
    defaultValues: { name: "", password: "" },
  });

  const handleDetailsSubmit = (data: { name: string; password: string }) => {
    registerUserMutation.mutate({ name: data.name, password: data.password, phonenumber });
  };

  return (
    <UnauthenticatedRoute>
    <div className="flex items-center justify-center h-screen w-full bg-blue-500">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        {step === 1 && (
          <Form {...phoneForm}>
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="space-y-6">
              <h1 className="text-xl font-bold text-center">Sign Up</h1>
              <FormField
                control={phoneForm.control}
                name="phonenumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., +1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={sendOTPMutation.isLoading}>
                {sendOTPMutation.isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </Form>
        )}

        {step === 2 && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(handleOTPSubmit)}
              className="space-y-6"
            >
              <h1 className="text-xl font-bold text-center">Verify OTP</h1>
              <FormField
                control={otpForm.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-center">
                      One-Time Password
                    </FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={verifyOTPMutation.isLoading}
              >
                {verifyOTPMutation.isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>
        )}

        {step === 3 && (
          <Form {...detailsForm}>
            <form
              onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)}
              className="space-y-6"
            >
              <h1 className="text-xl font-bold text-center">Sign Up</h1>
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  type="text"
                  value={phonenumber.slice(2)}
                  disabled
                  className="bg-gray-200 cursor-not-allowed"
                />
              </FormItem>
              <FormField
                control={detailsForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="First Last" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={detailsForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="- - - - - - - - " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
    </UnauthenticatedRoute>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { Controller } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sendOTP,
  verifyCode,
  registerUser,
  loginUser,
  connectByInviteCode, 
  searchUserByInviteCode
} from "@/apis/auth";
import { setAuthCookie, } from "@/utils/authUtils";
import UnauthenticatedRoute from "@/app/(auth)/UnauthenticatedRoute";
import { useSearchParams } from "next/navigation";


const PhoneSchema = z.object({
  phonenumber: z
    .string()
    .regex(/^\+?[0-9]\d{1,14}$/, { message: "Invalid phone number format." })
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
      if (inviteCode) {
        connectMutation.mutate(inviteCode);
      }
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast({ title: "Login Failed", description: error.message });
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

  const phoneForm = useForm({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phonenumber: "" },
  });

  const handlePhoneSubmit = ({ phonenumber }: { phonenumber: string }) => {
    setPhoneNumber("+1" + phonenumber);
    sendOTPMutation.mutate("+1" + phonenumber);
    setStep(2);
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
    <div className="flex items-center justify-center absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {/* STEP 1: Phone Number */}
      {step === 1 && (
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Enter your phone number to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phonenumber" className="text-black">Phone Number</Label>
                <Input
                  id="phonenumber"
                  placeholder="XXX-XXX-XXXX"
                  {...phoneForm.register("phonenumber")}
                />
                <p className="text-red-600 text-sm font-bold">
                  {phoneForm.formState.errors.phonenumber?.message}
                </p>
              </div>
              <CardFooter className="p-0">
                <Button
                  type="submit"
                  className="w-full bg-[#c7d6ef]"
                  disabled={sendOTPMutation.isLoading}
                >
                  {sendOTPMutation.isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}

      {/* STEP 2: OTP Verification */}
{step === 2 && (
  <Card className="w-full max-w-sm">
    <CardHeader className="text-center">
      <CardTitle>Verify OTP</CardTitle>
      <CardDescription>Enter the OTP sent to your phone</CardDescription>
    </CardHeader>
    <CardContent className="text-center">
      <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="pin" className="text-black">One-Time Password</Label>
          <div className="flex justify-center">
            <Controller
              control={otpForm.control}
              name="pin"
              render={({ field }) => (
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
          </div>
          <p className="text-red-600 text-sm font-bold">
            {otpForm.formState.errors.pin?.message}
          </p>
        </div>
        <div className="p-0">
          <Button
            type="submit"
            className="w-full bg-[#c7d6ef]"
            disabled={verifyOTPMutation.isLoading}
          >
            {verifyOTPMutation.isLoading ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
)}



      {/* STEP 3: Complete Profile */}
      {step === 3 && (
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>Enter your name and password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-black">Phone Number</Label>
                <Input
                  id="phone"
                  type="text"
                  value={phonenumber.slice(2)}
                  disabled
                  className="bg-gray-200"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-black">Name</Label>
                <Input
                  id="name"
                  placeholder="First Last"
                  {...detailsForm.register("name")}
                />
                <p className="text-red-600 text-sm font-bold">
                  {detailsForm.formState.errors.name?.message}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  {...detailsForm.register("password")}
                />
                <p className="text-red-600 text-sm font-bold">
                  {detailsForm.formState.errors.password?.message}
                </p>
              </div>
              <CardFooter className="p-0">
                <Button type="submit" className="w-full bg-[#c7d6ef]">
                  Register
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
    </UnauthenticatedRoute>
  );
}
"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useFieldArray } from "react-hook-form";
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
  connectWithFriend,
} from "@/apis/auth";

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

const friendFormSchema = z.object({
  friends: z
    .array(
      z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    )
    .min(1, "Please add at least 1 friend.")
    .max(3, "You can add up to 3 friends."),
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
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });

  const phoneForm = useForm({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phonenumber: "" },
  });

  const handlePhoneSubmit = ({ phonenumber }: { phonenumber: string }) => {
    setPhoneNumber(phonenumber);
    setAccessToken("[REDACTED_JWT]"); // TESTING DELETE LATER
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
    setStep(4);
  };

  const friendForm = useForm({
    resolver: zodResolver(friendFormSchema),
    defaultValues: { friends: [" ", " ", " "] },
  });

  const { fields, append, remove } = useFieldArray({
    control: friendForm.control,
    name: "friends",
  });

  const [friendErrors, setFriendErrors] = useState<string[]>([]);

  const handleFriendsSubmit = async (data: z.infer<typeof friendFormSchema>) => {
    const sanitizedFriends = data.friends
      .map((friend) => friend.trim())
      .filter((friend) => friend !== "");

    if (sanitizedFriends.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one valid friend.",
      });
      return;
    }

    const newFriendErrors = Array(sanitizedFriends.length).fill("");

    try {
      for (const [index, friendPhoneNumber] of sanitizedFriends.entries()) {
        try {
          await connectWithFriend(friendPhoneNumber, accessToken);
        } catch (error: any) {
          newFriendErrors[index] =
            error.message || "Failed to connect with this friend.";
        }
      }

      setFriendErrors(newFriendErrors);

      const hasErrors = newFriendErrors.some((error) => error !== "");
      if (!hasErrors) {
        toast({
          title: "Connections Successful",
          description: "All friends are connected!",
        });
        router.push("/dashboard");
      } else {
        toast({
          title: "Partial Success",
          description: "Some connections failed. Please review the errors.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error Creating Connections",
        description: error.message || "Something went wrong.",
      });
    }
  };

  return (
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
              <Button type="submit" className="w-full bg-black text-white" disabled={sendOTPMutation.isLoading}>
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
                className="w-full bg-black text-white"
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
                  value={phonenumber}
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
              <Button type="submit" className="w-full bg-black text-white">
                Continue
              </Button>
            </form>
          </Form>
        )}

        {step === 4 && (
          <Form {...friendForm}>
            <form
              onSubmit={friendForm.handleSubmit(handleFriendsSubmit)}
              className="space-y-4"
            >
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={friendForm.control}
                  name={`friends.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Friend {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage>
                        {friendErrors[index] && (
                          <span className="text-red-500">
                            {friendErrors[index]}
                          </span>
                        )}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              ))}

              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => append("")}
                  disabled={fields.length >= 3}
                >
                  Add Friend
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(fields.length - 1)}
                  disabled={fields.length <= 1}
                >
                  Remove Friend
                </Button>
              </div>
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

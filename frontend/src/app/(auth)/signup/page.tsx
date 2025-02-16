"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/hooks/use-toast"; // Replace with your toast setup
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

// Validation schemas
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
  .array( z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
  )
  .min(1, "Please add at least 1 friend.")
  .max(3, "You can add up to 3 friends."),
  });


export default function Signup() {
  const router = useRouter();
  const [step, setStep] = useState(1); // Track which step the user is on
  const [phonenumber, setPhoneNumber] = useState(""); // Store phone number
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState(""); // Store the access token

  // Define API functions
  const sendOTP = async (phonenumber: string) => {
    const response = await fetch("http://localhost:8000/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phonenumber: phonenumber }),
    });
    if (!response.ok) {
      throw new Error("Failed to send OTP. Please try again.");
    }
    return response.json();
  };

  const verifyCode = async (data: { phonenumber: string; code: string }) => {
    const response = await fetch("http://localhost:8000/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to verify OTP.");
    }
    const result = await response.json();
    if (result.status !== "approved") {
      throw new Error("Wrong OTP. Please try again.");
    }
    setAccessToken(result.phone_verification_token.access_token); // Save the access token
    return result;
  };

  const registerUser = async (data: { name: string; password: string; phonenumber: string }) => {
    const response = await fetch("http://localhost:8000/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Phone-Verification-Token": accessToken, // Include the access token in the header
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create account. Please try again.");
    }
    return response.json();
  };

  const connectWithFriend = async (receiverPhoneNumber: string) => {
    const response = await fetch("http://localhost:8000/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Include the current user's access token
      },
      body: JSON.stringify({ phonenumber: receiverPhoneNumber }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to connect with the friend.");
    }
  
    return response.json();
  };
  

  // Mutations
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
    onSuccess: () => {
      toast({ title: "OTP Verified" });
      setStep(3);
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });
  

  const registerUserMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast({ title: "Account Created", description: "Welcome to CONNECT3!" });
      router.push("/dashboard");
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message });
    },
  });
  

  // Step 1: Phone Number Form
  const phoneForm = useForm({
    resolver: zodResolver(PhoneSchema),
    defaultValues: { phonenumber: "" },
  });

  const handlePhoneSubmit = ({ phonenumber }: { phonenumber: string }) => {
    setPhoneNumber(phonenumber);
    sendOTPMutation.mutate(phonenumber); // Call backend to send OTP
  };

  // Step 2: OTP Form
  const otpForm = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: { pin: "" },
  });

  const handleOTPSubmit = ({ pin }: { pin: string }) => {
    verifyOTPMutation.mutate({ phonenumber, code: pin }); // Call backend to verify OTP
  };

  // Step 3: User Details Form
  const detailsForm = useForm({
    resolver: zodResolver(UserDetailsSchema),
    defaultValues: { name: "", password: "" },
  });
  
  const handleDetailsSubmit = (data: { name: string; password: string }) => {
    setName(data.name);
    setPassword(data.password);
    setStep(4);
  };
  
  const friendForm = useForm({
    resolver: zodResolver(friendFormSchema),
    defaultValues: { friends: [" ", " ", " "], },
  });

  const { fields, append, remove } = useFieldArray({
    control: friendForm.control,
    name: "friends",
  });
  
  // Handle friends registration submission then complete sign up
  const [friendErrors, setFriendErrors] = useState<string[]>([]); // Track errors for each friend

  const handleFriendsSubmit = async (data: z.infer<typeof friendFormSchema>) => {
    // Filter out empty or whitespace-only values
    const sanitizedFriends = data.friends
      .map((friend) => friend.trim()) // Trim whitespace
      .filter((friend) => friend !== ""); // Remove empty strings

    if (sanitizedFriends.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one valid friend.",
      });
      return;
    }

    const newFriendErrors = Array(sanitizedFriends.length).fill(""); // Reset friend errors

    try {
      // Create connections with each valid friend
      for (const [index, friendPhoneNumber] of sanitizedFriends.entries()) {
        try {
          await connectWithFriend(friendPhoneNumber);
        } catch (error: any) {
          // If there's an error store it in `newFriendErrors`
          newFriendErrors[index] = error.message || "Failed to connect with this friend.";
        }
      }

      setFriendErrors(newFriendErrors);

      // Check if there are any errors
      const hasErrors = newFriendErrors.some((error) => error !== "");
        if (!hasErrors) {
          toast({
            title: "Connections Successful",
            description: "All friends are connected!",
          });

          // After connecting with friends register the user
          registerUserMutation.mutate({ name, password, phonenumber });
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
        {/* Step 1: Phone Number */}
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

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-6">
              <h1 className="text-xl font-bold text-center">Verify OTP</h1>
              <FormField
                control={otpForm.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel className="text-center">One-Time Password</FormLabel>
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
              <Button type="submit" className="w-full bg-black text-white" disabled={verifyOTPMutation.isLoading}>
                {verifyOTPMutation.isLoading ? "Verifying..." : "Verify"}
              </Button>
            </form>
          </Form>
        )}

        {/* Step 3: User Details */}
        {step === 3 && (
          <Form {...detailsForm}>
            <form onSubmit={detailsForm.handleSubmit(handleDetailsSubmit)} className="space-y-6">
              <h1 className="text-xl font-bold text-center">Sign Up</h1>
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <Input type="text" value={phonenumber} disabled className="bg-gray-200 cursor-not-allowed" />
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
                      <Input type="password" placeholder="••••••••" {...field} />
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
          <form onSubmit={friendForm.handleSubmit(handleFriendsSubmit)} className="space-y-4">
            {/* Dynamically render fields */}
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
                      <span className="text-red-500">{friendErrors[index]}</span>
                    )}
                  </FormMessage>
                  </FormItem>
                )}
              />
            ))}

            {/* Add and Remove friend buttons */}
            <div className="flex justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => append(" ")} // Append a blank field
                disabled={fields.length >= 3} // Limit to 3 fields
              >
                Add Friend
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(fields.length - 1)} // Remove the last field
                disabled={fields.length <= 1} // Prevent removing the last field
              >
                Remove Friend
              </Button>
            </div>

            {/* Submit button */}
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

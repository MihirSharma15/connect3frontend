"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
  friends: z
    .array(
      z
        .string()
        .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
        .optional()
    )
    .min(1, "Please add at least 1 friend.")
    .max(3, "You can add up to 3 friends."),
});

export default function RegisterFriends() {
  const router = useRouter();

  // React state to manage the number of friend fields, defaulting to 3
  const [friendsCount, setFriendsCount] = useState(3);

  // Initialize the form and validation logic
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friends: Array(friendsCount).fill(""), // Default: 3 empty friend inputs
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Registered Friends:", data);
    router.push("/dashboard");
  }

  // Add a new friend field (up to 3)
  function addFriendField() {
    if (friendsCount < 3) {
      setFriendsCount(friendsCount + 1);
    }
  }

  // Remove a friend field (at least 1 required)
  function removeFriendField() {
    if (friendsCount > 1) {
      setFriendsCount(friendsCount - 1);
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle>Register Friends</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {Array.from({ length: friendsCount }).map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`friends.${index}`} // Dynamic field name
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Friend {index + 1}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="xxx-xxx-xxxx"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              {/* Add/Remove Friend Buttons */}
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={addFriendField}
                  disabled={friendsCount >= 3} // Disable if 3 fields
                >
                  Add Friend
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={removeFriendField}
                  disabled={friendsCount <= 1} // Disable if 1 field
                >
                  Remove Friend
                </Button>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

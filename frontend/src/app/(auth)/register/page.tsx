"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
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

// Validation schema
const formSchema = z.object({
  friends: z
    .array(
      z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format")
    )
    .min(1, "Please add at least 1 friend.")
    .max(3, "You can add up to 3 friends."),
});

export default function RegisterFriends() {
  const router = useRouter();

  // Initialize the form with default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      friends: [" ", " ", " "], 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "friends",
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Registered Friends:", data); // Log submitted data
    router.push("/dashboard"); // Navigate to dashboard after submission
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
              {/* Dynamically render fields */}
              {fields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`friends.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Friend {index + 1}</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
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
                Continue
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label";
import { useState } from "react";

import formSchema from "./components/formSchema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowUpLeftFromSquareIcon, ArrowUpRight, SquareArrowUpIcon } from "lucide-react";
import Link from "next/link";
export default function Signup() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phoneNumber: "",
            password: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }

    return (
        <div className="min-h-screen bg-gradient-to-t from-slate-50 to-blue-500 flex">
            <div className="w-full h-screen flex flex-row">
                {/* Left Side */}
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <Card className="w-fit max-h-fit p-6 shadow-2xl">
                        <CardHeader>
                            <CardTitle>Sign Up</CardTitle>
                            <CardDescription>Join and See Your Network.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
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
                                        control={form.control}
                                        name="phoneNumber"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="919-609-9023" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input type="password" placeholder="" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="flex flex-row justify-between">
                                        <Button type="submit">
                                            Register
                                        </Button>
                                        <Button asChild variant="link">
                                            <Link href="/login">Already have an account?</Link>
                                        </Button>
                                    </div>
                                    
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                    
                    
                </div>
                {/* Right Side */}
            </div>
        </div>
    );
}
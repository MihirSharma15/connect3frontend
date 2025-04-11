// app/(auth)/invite/[inviteCode]/page.tsx
// No "use client"—this is a Server Component.

import React from "react";
import Link from "next/link";
import { searchUserByInviteCode } from "@/apis/auth";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

type InviteData = {
  user_id: string;
  name: string;
  phonenumber?: string;
  degree?: number;
};

type InvitePageProps = {
  params: { inviteCode: string };
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { inviteCode } = params;
  let inviteData: InviteData;

  try {
    inviteData = await searchUserByInviteCode(inviteCode);
  } catch (error: any) {
    return (
      <div className="flex flex-col items-center justify-center absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <h1 className="text-4xl font-bold mb-8">
          CONNECT<span className="text-customBlue">3</span>
        </h1>
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error.message || "Invite Code Expired or Not Valid."}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Main Heading */}
      <h1 className="text-4xl font-bold mb-8 text-black">
        CONNECT<span className="text-customBlue">3</span>
      </h1>

      {/* White main Card */}
      <Card className="w-full max-w-md bg-white px-8 py-8">
        {/* Top Blue Section (User Info) */}
        <CardHeader className="p-0 mb-8">
          <Card className="bg-[#c7d6ef] flex items-center gap-6 px-8 py-6 border-b-2 border-black rounded-sm">
            <div className="w-14 h-14 border-2 border-black rounded-full bg-white flex items-center justify-center">
              {/* Placeholder Avatar (replace with your own image/icon if desired) */}
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <p className="text-xl font-bold">{inviteData.name}</p>
              <p className="mt-1 text-base">has invited you to Connect3</p>
            </div>
          </Card>
        </CardHeader>

        {/* Main Card Content */}
        <CardContent className="p-0 mb-8">
          <div className="space-y-8">
          <Link href={`/signup?inviteCode=${inviteCode}`} passHref>
            <Button
              type="button"
              className="w-full bg-customBlue"
            >
              Sign Up to Connect →
            </Button>
            </Link>
            <hr className="border-black" />
            <p className="text-center text-base mt-4">
              Already have an account?{" "}
              <Link href={`/login?inviteCode=${inviteCode}`} passHref>
              <Button type="button" className="bg-customBlue" size="sm">
                Log In
              </Button>
              </Link>
            </p>
          </div>
        </CardContent>


        {/* Hidden Footer to maintain Card structure */}
        <CardFooter className="hidden" />
      </Card>
    </div>
  );
}

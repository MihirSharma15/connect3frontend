"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image"
if (localStorage) localStorage.theme = 'light';
export default function Home() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
    <div className="flex flex-col items-center justify-between h-screen p-6">
      <div className="mt-12">
      <Image src="/design.png" alt="Network Design" width={200} height={200} />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold mt-20">
          CONNECT<span className="text-customBlue">3</span>
        </h1>
        <p className="text-gray-600 font-medium mt-12 mb-6">See your social network</p>
      </div>

    
      <div className="flex flex-col gap-3 w-full max-w-xs items-center mb-16">
        <div className="flex justify-center gap-4">
          <Button className="bg-customBlue"><Link href="/signup">Sign Up</Link></Button>
          <Button className="bg-customBlue"><Link href="/login">Log In</Link></Button>
        </div>
      </div>
    </div>
    </div>
  );
}

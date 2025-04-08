"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image"
localStorage.theme = 'light';
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
        <Button className="w-1/3 border-2 border-black bg-customBlue text-black py-1.5 mb-2 rounded-lg drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          Get started
        </Button>
        <div className="flex justify-center gap-4">
          <Button className="border-2 border-black px-2 py-1.5 mr-1 rounded-md text-black bg-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"><Link href="/signup">Sign Up</Link></Button>
          <Button className="border-2 border-black px-3 py-1.5 ml-1 rounded-md text-black bg-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]"><Link href="/login">Log In</Link></Button>
        </div>
      </div>
    </div>
    </div>
  );
}

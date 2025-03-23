"use client";
import { AuroraText } from "@/components/ui/aurora-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { ArrowUpRightIcon } from "lucide-react";
import { HyperText } from "@/components/ui/hyper-text";
import { Button } from "@/components/ui/button";
import Graph from "@/components/ui/graph";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
localStorage.theme = 'light';
export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "absolute inset-0 skew-y-12"
        )}
      />

      {/* Main Content */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 relative z-10">
        {/* Left Content */}
        <div className="w-full lg:w-1/2 flex flex-col space-y-6 items-center lg:items-start text-center lg:text-left">
          <HyperText className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter text-blue-500">
            Connect3
          </HyperText>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter">
            <span className="text-blue-400">UNC's</span> First Social Graph
          </h1>
          <h2 className="text-xl sm:text-2xl font-light tracking-tight text-gray-700">
            Connections shape us. See yours.
          </h2>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Button asChild className="">
              <Link href="/signup">
                Get Started
                <ArrowUpRightIcon className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              className=""
            >
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>

        {/* Right Content (Graph) */}
        <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
            <Graph className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

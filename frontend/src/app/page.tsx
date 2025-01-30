"use client"
import { AuroraText } from "@/components/ui/aurora-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { ArrowUpIcon, ArrowUpRightIcon, ChartNetwork } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HyperText } from "@/components/ui/hyper-text";
import { Button } from "@/components/ui/button";
import Graph from "@/components/ui/graph";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-start justify-center">
      <div className="lg:flex lg:flex-row w-screen justify-between px-10 items-center">
        {/* Left content */}
        <div className="flex flex-col space-y-2 items-start w-full">
          <HyperText className="text-7xl font-bold tracking-tighter text-blue-500">
            Connect3
          </HyperText>
          <h1 className="text-5xl font-bold tracking-tighter ">
            <span className="text-blue-400">UNC's</span> First Social Graph
          </h1>
          <h1 className="text-2xl font-light tracking-tighter">
            Connections shape us. See yours.
          </h1>
          <div className="flex flex-row space-x-5">
            <Button className="bg-blue-500 text-white px-5 py-2 rounded-lg">
              Get Started
              <ArrowUpRightIcon />
            </Button>
            <Button variant="outline" className="bg-white text-blue-500 px-5 py-2 rounded-lg">
              Log in.
            </Button>
          </div>
        </div>
        {/* Right Content */}
        <Graph />
      </div>

    </div>
  );
}

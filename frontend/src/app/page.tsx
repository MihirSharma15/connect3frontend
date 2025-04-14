"use client"
import { AuroraText } from "@/components/ui/aurora-text";
import { TextAnimate } from "@/components/ui/text-animate";
import { ArrowUpIcon, ArrowUpRightIcon, ChartNetwork } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { HyperText } from "@/components/ui/hyper-text";
import { Button } from "@/components/ui/button";
import Graph from "@/components/ui/graph";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";
import { AccordionItem } from "@/components/ui/accordion";
import LandingPageSheet from "@/components/landingpagesheet";

export default function Home() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full h-screen flex flex-col items-start justify-center relative">
        <AnimatedGridPattern
          numSquares={100}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12 max-h-screen",
          )}
        />
        <div className="lg:flex lg:flex-row w-screen justify-between px-10 items-center">
          {/* Left content */}
          <div className="flex flex-col space-y-2 items-center md:items-start w-full">
            <HyperText className="text-5xl md:text-7xl font-bold tracking-tighter text-blue-500">
              Connect3
            </HyperText>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter ">
              <span className="text-blue-400">UNC's</span> First Social Graph
            </h1>
            <h1 className="text-xl md:text-2xl font-light tracking-tighter">
              Connections shape us. See yours.
            </h1>
            <div className="flex flex-col space-y-4 w-full max-w-md">
              <div className="flex flex-row space-x-5">
                <Button asChild className="bg-customBlue z-0 flex-1">
                  <Link href="/signup">
                    Get Started
                    <ArrowUpRightIcon />
                  </Link>
                </Button>
                <Button asChild variant={"neutral"} className="bg-white z-0 flex-1">
                  <Link href="/login">Log in.</Link>
                </Button>
              </div>
              <LandingPageSheet />
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section className="w-full py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-thin text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Card className="max-h-32 hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                  Create your account with your phonenumber.
                </CardContent>
              </Card>
              </div>
            <div className="text-center">
              <Card className="min-h-fit hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  Connect to up to 3 friends.
                </CardContent>
              </Card>
            </div>
            <div className="text-center">
              <Card className="min-h-fit hover:scale-105 transition-all duration-300">
                <CardHeader>
                  <CardTitle>Explore</CardTitle>
                </CardHeader>
                <CardContent>
                  See the entire UNC community. Visualized.
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section> 
      {/* FAQ Section */}
      <section className="w-full py-10 flex-col justify-center">
        <div className="container mx-auto px-6 flex flex-col items-center">
          <h2 className="text-4xl font-thin text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="multiple" className="w-full max-w-xl space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is Connect3?</AccordionTrigger>
              <AccordionContent>
                Connect3 is a social venture by UNC students. We are trying to map the entire UNC community and visualize it. Essentially see <span className="font-bold">who knows who</span>.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I connect with friends?</AccordionTrigger>
              <AccordionContent>
                Once you sign up, you'll be given a unique code to share with your friends. From there, you can connect to up to 3 friends by sharing an invite code. You, however, can accept any number of invite codes sent you to.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is there any cost?</AccordionTrigger>
              <AccordionContent>
                Nope! This is a social venture by students for students. We are not charging anything for this.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </div>
  );
}
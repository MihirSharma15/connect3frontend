"use client"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Link from "next/link"
import { ArrowUpRightIcon, Users, Network, Target } from "lucide-react"

export default function LandingPageSheet() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant={"neutral"}>Read Our Story</Button>
            </SheetTrigger>
            <SheetContent className="bg-white">
                <SheetHeader className="px-6">
                    <SheetTitle className="text-3xl font-bold">Our Story</SheetTitle>
                    <SheetDescription className="text-base">
                        Visualizing UNC's Social Network
                    </SheetDescription>
                </SheetHeader>
                <div className="space-y-8 py-6 px-6">
                    <div className="flex items-start space-x-4">
                        <Users className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            State Schools are MASSIVE. UNC has over <span className="font-bold">30,000</span> students yet somehow everyone knows each other. Through mutuals, chance encounters, and just dumb luck, we form a massive social network.
                        </p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Target className="h-6 w-6 text-blue-500 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Our goal is to visualize that.
                        </p>
                    </div>

                    <div className="flex items-start space-x-4">
                        <Network className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                You've probably heard of the "six degrees of separation" theory - the idea that any two people are connected by at most six social connections. At UNC, we believe in something even more powerful: the power of three.
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Each person has three connections. And those three connections have three connections. And so forth. Eventually, with enough people we get a social network that's not just theoretical, but tangible.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-6 space-y-4">
                    <p className="text-center text-sm font-medium text-blue-500">
                        Join the movement. Sign up now.
                    </p>
                    <Button asChild className="bg-customBlue w-full">
                        <Link href="/signup">
                            Get Started
                            <ArrowUpRightIcon className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <SheetClose asChild>
                        <Button variant="neutral" className="w-full">Close</Button>
                    </SheetClose>
                </div>
            </SheetContent>
        </Sheet>
    )
}

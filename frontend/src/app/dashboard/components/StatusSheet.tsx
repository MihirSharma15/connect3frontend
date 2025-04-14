import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react";
import StatusUpdate from "@/types/StatusUpdate";
import StatusCard from "./StatusCard";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function StatusSheet({ status_updates, last_read_at } : { status_updates: StatusUpdate[], last_read_at: Date }) {
    const [userStatus, setUserStatus] = useState("");

    const setStatusDisabled = !userStatus;

    const handleStatusUpdate = () => {
      //Handle the request of adding the status to the DB
      //Then update the status_updates to show the new status
    };

    return (<Sheet>
        <div className="fixed bottom-4 right-4 z-50">
  <SheetTrigger asChild>
    <Button>Status</Button>
  </SheetTrigger>
  </div>
  <SheetContent className="bg-white text-black pl-5 pr-5 flex flex-col h-full" side="right">
    <SheetHeader className="pl-0" >
      <SheetTitle>Your Network</SheetTitle>
    </SheetHeader>
    <ScrollArea className="flex-1 overflow-auto">
    {status_updates.map((status_update, index) => (
      <div key={index} className="mb-4">
        <StatusCard status_update={status_update} last_read_at={last_read_at} />
      </div>
    ))}
    </ScrollArea>
    
    <SheetFooter className="pt-0">
    <hr />
    <Label htmlFor="sheet-status-input">Set Your Status <span className="text-xs">(disappears after 24h)</span></Label>
        <Input id="sheet-status-input" defaultValue={userStatus} placeholder="Your Status" onChange={(e) => setUserStatus(e.target.value)} />
        <Button disabled={setStatusDisabled} type="submit">Set status</Button>
      {/* When status set, add to top of network statuses */}
    </SheetFooter>
  </SheetContent>
</Sheet>
      );
}
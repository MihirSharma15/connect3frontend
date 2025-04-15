import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useState, useEffect } from "react";
import StatusUpdate from "@/types/StatusUpdate";
import StatusCard from "./StatusCard";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import humanizer from "@/utils/humanizeDuration"
import { setReadCookie } from "@/utils/readUtils"
import { getAuthToken } from "@/utils/authUtils"
import { setStatus } from "@/apis/auth";

export default function StatusSheet({ status_updates, last_read_at, user_status, setUserStatus, setStatusUpdates, unreadState, setUnreadState } : { status_updates: StatusUpdate[], last_read_at: string,  user_status: StatusUpdate, setUserStatus: (status_update: StatusUpdate) => void, setStatusUpdates: (status_updates: StatusUpdate[]) => void, unreadState: boolean, setUnreadState: (state: boolean) => void }) {
    const [statusText, setStatusText] = useState(user_status.status || "");

    const [shareDistance, setShareDistance] = useState(user_status.degree?.toString() || "5");

    const setStatusDisabled = !statusText;
    const [removeUnreads, setRemoveUnreads] = useState(false);

    const token = getAuthToken(document);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
      if (isSheetOpen) {
        const timeout = setTimeout(() => setShowInput(true), 300); // delay to avoid keyboard
        return () => clearTimeout(timeout);
      } else {
        setShowInput(false);
      }
    }, [isSheetOpen]);

    const handleStatusUpdate = () => {
      if (!token) return;
      if (user_status.status) {
        //Status already exists
        const newUserStatus : StatusUpdate = {
          user_id: user_status.user_id,
          name: user_status.name,
          degree: 0,
          status: "",
          status_created_at: new Date(),
          status_expires_at: new Date(),
        };
        setUserStatus(newUserStatus);
        setStatus("", 5, token);
        status_updates.splice(status_updates.findIndex(s => s.user_id === user_status.user_id), 1);
        setStatusUpdates(status_updates);
        setStatusText("");
      } else {
        //Handle the request of adding the status to the DB
        setStatus(statusText, parseInt(shareDistance), token);

        const newUserStatus : StatusUpdate = {
          user_id: user_status.user_id,
          name: user_status.name,
          degree: 0,
          status: statusText,
          status_created_at: new Date(),
          status_expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24),
        };
        setUserStatus(newUserStatus);
        status_updates.unshift(newUserStatus);
        setStatusUpdates(status_updates);
      }
      //Then update the status_updates to show the new status
      
    };

    const updateLastRead = (open: boolean) => {
      setIsSheetOpen(open);
      if (open && document) setReadCookie(document);
      if (!open) {
        setUnreadState(false); // Whether to display unread on For You button
        setRemoveUnreads(true); // Whether to force remove unreads from post list
      }
    }

    return (<Sheet onOpenChange={updateLastRead}>
        <div className="fixed bottom-4 right-4 z-50">
  <SheetTrigger asChild>
    <div>
    <Button>For You {unreadState && (<div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />)}</Button>
    </div>
  </SheetTrigger>
  </div>
  <SheetContent className="bg-white text-black pl-5 pr-5 flex flex-col h-full w-[90vw] sm:w-[400px]" side="right">
    <SheetHeader className="pl-0" >
      <SheetTitle>Your Network</SheetTitle>
    </SheetHeader>
    <ScrollArea className="flex-1 overflow-auto pt-1">
    {status_updates.sort((a, b) => b.status_created_at.getTime() - a.status_created_at.getTime()).map((status_update, index) => (
      <div key={index} className="mb-4">
        <StatusCard status_update={status_update} last_read_at={removeUnreads ? Date.now().toString()+100 : last_read_at} />
      </div>
    ))}
    </ScrollArea>
    
    <SheetFooter className="pt-0">
    <hr />
    <Label htmlFor="sheet-status-input">{user_status.status ? "" : "Set "}Your Status <span className="text-xs">(disappears {user_status.status && user_status.status_expires_at ? `in ${humanizer.humanize(user_status.status_expires_at.getTime() - Date.now(), { language: "shortEn", units: ["h", "m", "s"], round: true, largest: 1, spacer: "" })}` : "after 24h"})</span></Label>
    {showInput && (<Input className="text-base" id="sheet-status-input" maxLength={500} value={statusText} placeholder="Your Status" disabled={!!user_status.status} onChange={(e) => setStatusText(e.target.value)} onFocus={(e) => {
    // If needed, do something on focus
  }} />)}
        <div className="flex flex-row gap-2">
        <Button className="flex-1" disabled={setStatusDisabled} type="submit" onClick={handleStatusUpdate}>{user_status.status ? "Clear" : "Share"} status</Button>
        <Select
            value={shareDistance}
            disabled={!!user_status.status}
            onValueChange={(value) => {
                setShareDistance(value);
            }}
        >
  <SelectTrigger className="w-20 mt-0.5">
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Share to degree...</SelectLabel>
      <SelectItem value="1">1st</SelectItem>
      <SelectItem value="2">2nd</SelectItem>
      <SelectItem value="3">3rd</SelectItem>
      <SelectItem value="4">4th</SelectItem>
      <SelectItem value="5">5th</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
        </div>
      {/* When status set, add to top of network statuses */}
    </SheetFooter>
  </SheetContent>
</Sheet>
      );
}
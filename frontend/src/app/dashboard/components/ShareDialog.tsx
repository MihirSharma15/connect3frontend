import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ShareButton from "./ShareButton";
import { useState } from "react";

export default function ShareDialog({ num_connections, invite_code } : { num_connections: number, invite_code: string }) {
    const [open, setOpen] = useState(true);

    return (<Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white text-black"
          >
            <DialogHeader>
                <DialogTitle>Unlock Your Network</DialogTitle>
              <DialogDescription>
                You must have 3 connections to unlock full the graph. Share your invite with your friends, and once they join you'll be able to see your network!
                <br /><br />
                You have invited <strong>{num_connections}/3</strong> connections.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ShareButton title="Join me on Connect3: UNC's First Social Graph!" text="" url={`https://connect3.live/invite/${invite_code}`} />
            </DialogFooter>
          </DialogContent>
          </Dialog>
      );
}
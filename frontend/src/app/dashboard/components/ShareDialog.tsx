import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import ShareButton from "./ShareButton";

export default function ShareDialog({ num_connections, invite_code } : { num_connections: number, invite_code: string }) {
    console.log(invite_code)
    return (<Dialog open={true} onOpenChange={() => {}}>
          <DialogContent className="bg-white [&>button]:hidden">
            <DialogHeader>
                <DialogTitle>Unlock Your Network</DialogTitle>
              <DialogDescription>
                You must have 3 connections to unlock the graph. Share your invite with your friends, and once they join you'll be able to see your network!
                <br /><br />
                You have invited <strong>{num_connections}/3</strong> connections.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <ShareButton title="Join me on Connect3: UNC's First Social Graph!" text="" url={`https://connect3.live/i/${invite_code}`} />
            </DialogFooter>
          </DialogContent>
          </Dialog>
      );
}
import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import StatusUpdate from "@/types/StatusUpdate";
import ordinalSuffixOf from "@/utils/ordinalSuffixOf";
import humanizer from "@/utils/humanizeDuration";

export default function StatusCard({ status_update, last_read_at } : { status_update: StatusUpdate, last_read_at: string }) {
    const age = humanizer.humanize(Date.now()-status_update.status_created_at.getTime(), { language: "shortEn", units: ["h", "m", "s"], round: true, largest: 1, spacer: "" });
    const isUnread = status_update.status_created_at.getTime() > parseInt(last_read_at);

    return (<Card className="w-full max-w-sm relative mx-auto w-[95%]">
        <CardContent className="pb-4">
            {isUnread && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            )}
            <CardDescription><strong>{status_update.name}</strong> ({ordinalSuffixOf(status_update.degree)}) - {age} ago</CardDescription>
            <CardDescription>{status_update.status}</CardDescription>
        </CardContent>
      </Card>
      )
};

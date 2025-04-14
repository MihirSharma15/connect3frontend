import {
  Card,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import StatusUpdate from "@/types/StatusUpdate";
import ordinalSuffixOf from "@/utils/ordinalSuffixOf";
import humanizer from "@/utils/humanizeDuration";

export default function StatusCard({ status_update, last_read_at } : { status_update: StatusUpdate, last_read_at: Date }) {
    const age = humanizer.humanize(Date.now()-status_update.status_created_at.getTime(), { language: "shortEn", units: ["h", "m", "s"], round: true, largest: 1, spacer: "" });

    return (<Card className="w-full max-w-sm">
        <CardContent className="pb-4">
            <CardDescription><strong>{status_update.name}</strong> ({ordinalSuffixOf(status_update.degree)}) - {age} ago</CardDescription>
            <CardDescription>{status_update.status}</CardDescription>
        </CardContent>
      </Card>
      )
};

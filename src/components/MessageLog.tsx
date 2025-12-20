import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  id: string;
  timestamp: Date;
  status: "sent" | "pending" | "error";
  message: string;
}

interface MessageLogProps {
  logs: LogEntry[];
}

const MessageLog = ({ logs }: MessageLogProps) => {
  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card/50 p-6">
        <p className="text-center text-muted-foreground text-sm">
          No messages sent yet. Configure and start the automation above.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-secondary/30">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Activity Log
        </h3>
      </div>
      <ScrollArea className="h-48">
        <div className="p-2 space-y-1">
          {logs.map((log, index) => (
            <div
              key={log.id}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-mono",
                "animate-slide-up",
                log.status === "sent" && "bg-success/10 text-success",
                log.status === "pending" && "bg-warning/10 text-warning",
                log.status === "error" && "bg-destructive/10 text-destructive"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-muted-foreground text-xs">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  log.status === "sent" && "bg-success",
                  log.status === "pending" && "bg-warning animate-pulse",
                  log.status === "error" && "bg-destructive"
                )}
              />
              <span className="truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MessageLog;

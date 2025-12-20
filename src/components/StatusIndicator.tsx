import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  isActive: boolean;
  messageCount: number;
}

const StatusIndicator = ({ isActive, messageCount }: StatusIndicatorProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-300",
            isActive
              ? "bg-success animate-pulse-glow"
              : "bg-muted-foreground/50"
          )}
        />
        <span
          className={cn(
            "text-sm font-medium uppercase tracking-wider",
            isActive ? "text-success" : "text-muted-foreground"
          )}
        >
          {isActive ? "Active" : "Idle"}
        </span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Messages sent:</span>
        <span className={cn(
          "font-mono text-lg font-bold transition-all duration-200",
          isActive ? "text-primary text-glow" : "text-foreground"
        )}>
          {messageCount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default StatusIndicator;

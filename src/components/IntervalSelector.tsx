import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface IntervalSelectorProps {
  interval: number;
  unit: "seconds" | "minutes";
  onIntervalChange: (value: number) => void;
  onUnitChange: (unit: "seconds" | "minutes") => void;
  disabled?: boolean;
}

const IntervalSelector = ({
  interval,
  unit,
  onIntervalChange,
  onUnitChange,
  disabled,
}: IntervalSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Send Interval
      </label>
      <div className="flex gap-3">
        <Input
          type="number"
          min="1"
          value={interval}
          onChange={(e) => onIntervalChange(Math.max(1, parseInt(e.target.value) || 1))}
          disabled={disabled}
          className="flex-1"
          placeholder="Interval"
        />
        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => onUnitChange("seconds")}
            disabled={disabled}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all duration-200",
              unit === "seconds"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            Seconds
          </button>
          <button
            type="button"
            onClick={() => onUnitChange("minutes")}
            disabled={disabled}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all duration-200",
              unit === "minutes"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            Minutes
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntervalSelector;

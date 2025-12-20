import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Play, Square, Phone, Zap, Smartphone, Wifi } from "lucide-react";
import StatusIndicator from "./StatusIndicator";
import IntervalSelector from "./IntervalSelector";
import MessageLog from "./MessageLog";
import { cn } from "@/lib/utils";
import { sendNativeSms, isNativeDevice } from "@/lib/sms";

interface LogEntry {
  id: string;
  timestamp: Date;
  status: "sent" | "pending" | "error";
  message: string;
}

const SMSAutomation = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [sendInterval, setSendInterval] = useState(10);
  const [unit, setUnit] = useState<"seconds" | "minutes">("seconds");
  const [isRunning, setIsRunning] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isNative, setIsNative] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsNative(isNativeDevice());
  }, []);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const sendMessage = useCallback(async () => {
    const logId = crypto.randomUUID();
    
    // Add pending log
    const pendingLog: LogEntry = {
      id: logId,
      timestamp: new Date(),
      status: "pending",
      message: `Sending to ${phoneNumber}...`,
    };
    setLogs((prev) => [pendingLog, ...prev].slice(0, 50));

    if (isNative) {
      // Actually send SMS on native device
      const result = await sendNativeSms({
        phoneNumber: phoneNumber,
        message: message,
      });

      // Update log with result
      setLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? {
                ...log,
                status: result.success ? "sent" : "error",
                message: result.success
                  ? `Message sent to ${phoneNumber}`
                  : `Failed: ${result.error}`,
              }
            : log
        )
      );

      if (result.success) {
        setMessageCount((prev) => prev + 1);
      }
    } else {
      // Simulation mode for web preview
      setTimeout(() => {
        setLogs((prev) =>
          prev.map((log) =>
            log.id === logId
              ? {
                  ...log,
                  status: "sent",
                  message: `[SIM] Message sent to ${phoneNumber}`,
                }
              : log
          )
        );
        setMessageCount((prev) => prev + 1);
      }, 500);
    }
  }, [phoneNumber, message, isNative]);

  const startAutomation = () => {
    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message to send.",
        variant: "destructive",
      });
      return;
    }

    const intervalMs = unit === "minutes" ? sendInterval * 60 * 1000 : sendInterval * 1000;

    setIsRunning(true);
    toast({
      title: "Automation Started",
      description: `${isNative ? "Sending real SMS" : "Simulation mode"} every ${sendInterval} ${unit}.`,
    });

    // Send first message immediately
    sendMessage();

    intervalRef.current = window.setInterval(sendMessage, intervalMs);
  };

  const stopAutomation = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    toast({
      title: "Automation Stopped",
      description: `Total messages sent: ${messageCount}`,
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 animate-slide-up">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4 animate-float">
          <MessageSquare className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">
          SMS <span className="text-primary text-glow">Automation</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Configure your message and schedule automatic delivery to the target number.
        </p>
      </div>

      {/* Platform Badge */}
      <div
        className={cn(
          "flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300",
          isNative
            ? "border-success/50 bg-success/10 text-success"
            : "border-warning/50 bg-warning/10 text-warning"
        )}
      >
        {isNative ? (
          <>
            <Smartphone className="w-4 h-4" />
            <span className="text-sm font-medium">Native Mode - Real SMS</span>
          </>
        ) : (
          <>
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Web Mode - Simulation Only</span>
          </>
        )}
      </div>

      {/* Status Bar */}
      <div
        className={cn(
          "flex items-center justify-center p-4 rounded-xl border transition-all duration-300",
          isRunning
            ? "border-primary/50 bg-primary/5"
            : "border-border bg-card/50"
        )}
      >
        <StatusIndicator isActive={isRunning} messageCount={messageCount} />
      </div>

      {/* Main Form */}
      <div
        className="space-y-6 p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm animate-slide-up"
        style={{ animationDelay: "100ms" }}
      >
        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Phone Number
          </label>
          <Input
            type="tel"
            placeholder="(555) 123-4567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            disabled={isRunning}
            maxLength={14}
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Message Content
          </label>
          <Textarea
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isRunning}
            maxLength={160}
          />
          <div className="flex justify-end">
            <span className="text-xs text-muted-foreground font-mono">
              {message.length}/160
            </span>
          </div>
        </div>

        {/* Interval */}
        <IntervalSelector
          interval={sendInterval}
          unit={unit}
          onIntervalChange={setSendInterval}
          onUnitChange={setUnit}
          disabled={isRunning}
        />

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          {!isRunning ? (
            <Button
              onClick={startAutomation}
              variant="glow"
              size="lg"
              className="flex-1"
            >
              <Play className="w-5 h-5" />
              Start Automation
            </Button>
          ) : (
            <Button
              onClick={stopAutomation}
              variant="destructive"
              size="lg"
              className="flex-1"
            >
              <Square className="w-5 h-5" />
              Stop Automation
            </Button>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
        <MessageLog logs={logs} />
      </div>

      {/* Info Banner */}
      {!isNative && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card/30 animate-slide-up"
          style={{ animationDelay: "300ms" }}
        >
          <Zap className="w-5 h-5 text-warning mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Install on Android for Real SMS</p>
            <p className="text-xs text-muted-foreground">
              To send actual SMS messages from your phone number, build and install this app on your Android device using the instructions below.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SMSAutomation;

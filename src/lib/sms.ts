import { SmsManager } from "@byteowls/capacitor-sms";

export interface SendSmsOptions {
  phoneNumber: string;
  message: string;
}

export interface SmsResult {
  success: boolean;
  error?: string;
}

/**
 * Send SMS using native Android capabilities
 * Returns true if sent successfully, false otherwise
 */
export const sendNativeSms = async ({ phoneNumber, message }: SendSmsOptions): Promise<SmsResult> => {
  try {
    // Clean the phone number - remove formatting
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    
    await SmsManager.send({
      numbers: [cleanNumber],
      text: message,
    });
    
    return { success: true };
  } catch (error) {
    console.error("SMS send error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

/**
 * Check if we're running on a native device (Android/iOS)
 */
export const isNativeDevice = (): boolean => {
  // Check if Capacitor native features are available
  return typeof window !== 'undefined' && 
         'Capacitor' in window && 
         (window as any).Capacitor?.isNativePlatform?.() === true;
};

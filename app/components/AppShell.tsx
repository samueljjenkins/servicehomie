"use client";
import { useEffect } from "react";
import { useIframeSdk } from "@whop/react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const sdk = useIframeSdk();

  useEffect(() => {
    // If running inside Whop iframe, handle communication
    if (sdk) {
      // Signal that the app is ready by sending a message
      const sendReady = () => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'APP_READY', height: document.body.scrollHeight }, '*');
        }
      };
      
      sendReady();
      window.addEventListener("resize", sendReady);
      const ro = new ResizeObserver(sendReady);
      ro.observe(document.body);
      
      return () => {
        window.removeEventListener("resize", sendReady);
        ro.disconnect();
      };
    }
  }, [sdk]);

  return <>{children}</>;
}

"use client";

/**
 * Helper to truncate URLs for logging (avoids showing full JWT tokens)
 */
function truncateUrl(url: string | URL): string {
  const urlStr = url.toString();
  const maxLength = 50;
  if (urlStr.length <= maxLength) return urlStr;
  return `${urlStr.substring(0, maxLength)}... [truncated, length: ${urlStr.length}]`;
}

/**
 * WebSocket interceptor for debugging Liveblocks messages
 * Call this ONCE when your app loads to patch the global WebSocket
 */
export function interceptWebSocket() {
  if (typeof window === "undefined") return;

  // Store original WebSocket
  const OriginalWebSocket = window.WebSocket;

  // Create patched WebSocket class
  class PatchedWebSocket extends OriginalWebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      console.log("🌐 WebSocket CONNECTING to:", truncateUrl(url));
      super(url, protocols);

      // Intercept onopen
      const originalOnOpen = this.onopen;
      this.onopen = (event) => {
        console.log("✅ WebSocket CONNECTED:", truncateUrl(url));
        if (originalOnOpen) originalOnOpen.call(this, event);
      };

      // Intercept onmessage - THIS IS WHAT YOU NEED
      const originalOnMessage = this.onmessage;
      this.onmessage = (event) => {
        console.group("📨 WebSocket MESSAGE RECEIVED");
        console.log("From:", truncateUrl(url));
        console.log("Timestamp:", new Date().toISOString());

        try {
          const data = JSON.parse(event.data);
          console.log("Parsed data:", data);

          // Highlight tool-related messages
          if (data.type?.includes?.("tool") || data.type?.includes?.("TOOL") || data.name) {
            console.log("🔧 TOOL-RELATED MESSAGE DETECTED!");
            console.log("Tool name:", data.name || data.toolName || "N/A");
            console.log("Arguments:", data.arguments || data.args || "N/A");
          }
        } catch (e) {
          console.log("Raw data (not JSON):", event.data);
        }

        console.groupEnd();

        if (originalOnMessage) originalOnMessage.call(this, event);
      };

      // Intercept onerror
      const originalOnError = this.onerror;
      this.onerror = (event) => {
        console.error("❌ WebSocket ERROR:", event);
        if (originalOnError) originalOnError.call(this, event);
      };

      // Intercept onclose
      const originalOnClose = this.onclose;
      this.onclose = (event) => {
        console.log("🔌 WebSocket CLOSED:", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });
        if (originalOnClose) originalOnClose.call(this, event);
      };

      // Intercept send
      const originalSend = this.send;
      this.send = function (data: string | ArrayBufferLike | Blob | ArrayBufferView) {
        console.group("📤 WebSocket MESSAGE SENT");
        console.log("To:", truncateUrl(url));

        try {
          const parsedData = typeof data === "string" ? JSON.parse(data) : data;
          console.log("Parsed data:", parsedData);
        } catch (e) {
          console.log("Raw data:", data);
        }

        console.groupEnd();

        return originalSend.call(this, data);
      };
    }
  }

  // Replace global WebSocket
  (window as any).WebSocket = PatchedWebSocket;

  console.log("🔍 WebSocket interceptor installed! All WebSocket traffic will be logged.");
}

/**
 * Remove the interceptor (useful for cleanup)
 */
export function removeWebSocketInterceptor() {
  // You'd need to store the original WebSocket reference to restore it
  console.warn("WebSocket interceptor removal not implemented. Refresh page to remove.");
}

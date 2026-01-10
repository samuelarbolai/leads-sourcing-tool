import posthog from "posthog-js";
import { keys } from "./keys";

export const initializeAnalytics = () => {
  const envKeys = keys();
  if (envKeys.NEXT_PUBLIC_POSTHOG_KEY && envKeys.NEXT_PUBLIC_POSTHOG_HOST) {
    posthog.init(envKeys.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: envKeys.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2025-05-24",
    });
  }
};

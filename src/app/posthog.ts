import { PostHog } from "posthog-node";

let posthogInstance: null | PostHog = null;

export default function getPostHogServer() {
  if (!posthogInstance) {
    posthogInstance = new PostHog(process.env.NEXT_PUBLIC_PHK as string, {
      host: process.env.NEXT_PUBLIC_PH || "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
  }
  return posthogInstance;
}

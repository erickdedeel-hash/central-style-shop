import { sendMetaCapiEvent } from "./meta-capi.functions";

export const META_PIXEL_ID = "1570599151398051";

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: unknown;
    __metaPixelReady?: boolean;
  }
}

function newEventId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

/** Loads the official Meta Pixel base code exactly once and fires a single PageView. */
export function initMetaPixel() {
  if (typeof window === "undefined") return;
  if (window.__metaPixelReady) return;
  window.__metaPixelReady = true;

  /* eslint-disable */
  (function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return;
    const n: any = (f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = b.createElement(e) as HTMLScriptElement;
    t.async = true;
    t.src = v;
    const s = b.getElementsByTagName(e)[0];
    s?.parentNode?.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq?.("init", META_PIXEL_ID);
  void trackMetaEvent("PageView");
}

/**
 * Fires one event on the browser Pixel and the same event server-side through
 * the Conversions API, sharing a single event_id so Meta deduplicates them.
 */
export async function trackMetaEvent(
  eventName: "PageView" | "InitiateCheckout" | "Purchase",
  customData?: Record<string, string | number>,
) {
  if (typeof window === "undefined") return;
  const eventId = newEventId();

  window.fbq?.("track", eventName, customData ?? {}, { eventID: eventId });

  try {
    await sendMetaCapiEvent({
      data: {
        event_name: eventName,
        event_id: eventId,
        event_source_url: window.location.href,
        ...(getCookie("_fbp") && { fbp: getCookie("_fbp")! }),
        ...(getCookie("_fbc") && { fbc: getCookie("_fbc")! }),
        ...(customData && { custom_data: customData }),
      },
    });
  } catch {
    // Tracking must never break the page.
  }
}

import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

const PIXEL_ID = "1570599151398051";
const API_VERSION = "v21.0";

type CapiInput = {
  event_name: string;
  event_id: string;
  event_source_url?: string;
  fbp?: string;
  fbc?: string;
  custom_data?: Record<string, string | number>;
};

/**
 * Sends a server-side event to the Meta Conversions API.
 * The access token is read ONLY here, from the server secret, and is never
 * returned to the browser nor logged.
 */
export const sendMetaCapiEvent = createServerFn({ method: "POST" })
  .inputValidator((input: CapiInput) => {
    if (!input || typeof input.event_name !== "string" || typeof input.event_id !== "string") {
      throw new Error("Invalid event payload");
    }
    const allowed = ["PageView", "InitiateCheckout", "Purchase"];
    if (!allowed.includes(input.event_name)) throw new Error("Unsupported event");
    return input;
  })
  .handler(async ({ data }) => {
    const token = process.env["META_CAPI_ACCESS_TOKEN"];
    if (!token) return { sent: false, reason: "missing_token" as const };

    const userAgent = getRequestHeader("user-agent") ?? undefined;
    let ip: string | undefined;
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? undefined;
    } catch {
      ip = undefined;
    }

    const body = {
      data: [
        {
          event_name: data.event_name,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.event_id,
          action_source: "website",
          ...(data.event_source_url && { event_source_url: data.event_source_url }),
          user_data: {
            ...(ip && { client_ip_address: ip }),
            ...(userAgent && { client_user_agent: userAgent }),
            ...(data.fbp && { fbp: data.fbp }),
            ...(data.fbc && { fbc: data.fbc }),
          },
          ...(data.custom_data && { custom_data: data.custom_data }),
        },
      ],
    };

    try {
      const res = await fetch(
        `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        // Never log the token or the request URL (it carries the token).
        console.error(`Meta CAPI request failed with status ${res.status}`);
        return { sent: false, reason: "request_failed" as const };
      }
      return { sent: true };
    } catch {
      console.error("Meta CAPI request threw an error");
      return { sent: false, reason: "network_error" as const };
    }
  });

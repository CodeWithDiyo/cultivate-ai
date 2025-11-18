// FILE: /app/api/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getConvexServer } from "@/convex/server";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const data: Record<string, unknown> = await req.json();
    const convex = getConvexServer();

    // Call the Convex mutation that writes to flutterwaveWebhooks
    await convex.mutation(api.webhooks.handleFlutterwaveWebhook, {
      paymentData: data,
    });

    return NextResponse.json({ status: "ok" });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: "error", message });
  }
}

// FILE: /app/api/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    // Verify signature if needed here

    // Call Convex mutation
    await api.webhooks.handleFlutterwaveWebhook({
      paymentData: data,
    });

    return NextResponse.json({ status: "ok" });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ status: "error", message: (err as any).message });
  }
}

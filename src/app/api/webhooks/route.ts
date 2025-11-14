// FILE: /app/api/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/convex/_generated/server"; // import db for direct access

export async function POST(req: NextRequest) {
  try {
    const data: Record<string, unknown> = await req.json();

    // Handle the payment data directly in the route
    await db.insert("flutterwaveWebhooks", {
      paymentData: data,
      createdAt: Date.now(),
    });

    // You can run additional logic here, e.g., update orders, mark revenue, etc.

    return NextResponse.json({ status: "ok" });
  } catch (err: unknown) {
    console.error("Webhook error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ status: "error", message });
  }
}

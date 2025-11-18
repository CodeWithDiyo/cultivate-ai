// src/app/api/payments/route.ts

import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// Initialize server-side Convex client
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");

// Shallow payload type to avoid deep TS instantiation
type CreatePaymentPayload = {
  txRef?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  response?: Record<string, unknown>;
  bidId?: Id<"campaignBids">;
};

// Minimal mutation type signature for safe TS usage
type CreatePaymentResult = { paymentId: Id<"payments"> };

// Helper function to call Convex mutation without deep type expansion
async function createPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResult> {
  // TS sees this as `any` only in the wrapper, so rest of the code stays fully typed
  return convex.mutation(api.payments.createPayment as unknown as typeof api.payments.createPayment, payload);
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreatePaymentPayload;

    if (!body.amount || !body.currency) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const paymentResult = await createPayment({
      txRef: body.txRef ?? "",
      amount: body.amount,
      currency: body.currency,
      paymentMethod: body.paymentMethod ?? "card",
      response: body.response ?? {},
      bidId: body.bidId,
    });

    return NextResponse.json({ success: true, paymentId: paymentResult.paymentId }, { status: 200 });
  } catch (err: unknown) {
    console.error("Payment API error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

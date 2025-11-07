// FILE: /convex/payments.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Payments (schema-aligned)
 *
 * Schema expectations (from your schema.ts):
 * payments: {
 *   bidId: Id<"campaignBids">,
 *   txRef: string,
 *   status: "pending" | "success" | "failed",
 *   amount: number,
 *   currency: string,
 *   paymentMethod?: string,
 *   response?: any,
 *   createdAt: number
 * }
 *
 * transactions: {
 *   userId: Id<"userProfiles">,
 *   type: "investment" | "revenue" | "payout" | "commission",
 *   amount: number,
 *   currency: string,
 *   description: string,
 *   relatedId?: string,
 *   createdAt: number
 * }
 */

export const createPayment = mutation({
  args: {
    // Link to a campaign bid (if this payment is for an investment)
    bidId: v.optional(v.id("campaignBids")),
    txRef: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.optional(v.string()), // e.g. "flutterwave"
    response: v.optional(v.any()),
  },
  handler: async (ctx, { bidId, txRef, amount, currency, paymentMethod, response }) => {
    const paymentId = await ctx.db.insert("payments", {
      bidId: bidId ?? undefined,
      txRef: txRef ?? "",
      status: "pending",
      amount,
      currency,
      paymentMethod: paymentMethod ?? undefined,
      response: response ?? undefined,
      createdAt: Date.now(),
    });

    return { paymentId };
  },
});

export const updatePaymentStatus = mutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(v.literal("pending"), v.literal("success"), v.literal("failed")),
    response: v.optional(v.any()),
  },
  handler: async (ctx, { paymentId, status, response }) => {
    const payment = await ctx.db.get(paymentId);
    if (!payment) throw new Error("Payment not found");

    // Patch payment record with new status & optionally response
    await ctx.db.patch(paymentId, {
      status,
      response: response ?? payment.response,
    });

    // If this payment references a bid, fetch it so we can record a transaction and notify the investor
    if (status === "success") {
      if (payment.bidId) {
        const bid = await ctx.db.get(payment.bidId);
        // If bid exists, record a transaction attributed to the investor (and campaign)
        if (bid) {
          // Insert a transaction record following your schema
          await ctx.db.insert("transactions", {
            userId: bid.investorId,
            type: "investment",
            amount: payment.amount,
            currency: payment.currency,
            description: `Payment successful (txRef: ${payment.txRef ?? String(paymentId)})`,
            relatedId: payment.txRef ?? String(paymentId),
            createdAt: Date.now(),
          });

          // Notify the investor (type matches your notifications schema)
          await ctx.db.insert("notifications", {
            userId: bid.investorId,
            message: `Your payment of ${payment.currency} ${payment.amount} was successful.`,
            type: "system",
            meta: { paymentId, bidId: payment.bidId },
            read: false,
            createdAt: Date.now(),
          });
        } else {
          // No bid found — fallback: insert a generic transaction (without userId) is not allowed by schema,
          // so skip transaction in this case. Alternatively you could log an error or create admin notification.
        }
      } else {
        // Payment not associated with a bid: we still can create a generic transaction if needed,
        // but your transactions table requires userId. Skip to avoid schema violation.
      }
    }

    return { success: true };
  },
});

/**
 * Get payments for an investor by looking up their campaign bids first,
 * then collecting payments referencing those bids (uses the payments.by_bidId index).
 */
export const getPaymentsByInvestor = query({
  args: { investorId: v.id("userProfiles") },
  handler: async (ctx, { investorId }) => {
    // Collect all bid IDs for this investor
    const bids = await ctx.db
      .query("campaignBids")
      .withIndex("by_investorId", (q) => q.eq("investorId", investorId))
      .collect();

    if (bids.length === 0) return [];

    // For each bid, fetch related payments (using payments.by_bidId index)
    const paymentsForInvestor = [];
    for (const b of bids) {
      // If index exists, use withIndex; otherwise query + filter would be necessary.
      const payments = await ctx.db
        .query("payments")
        .withIndex("by_bidId", (q) => q.eq("bidId", b._id))
        .collect();

      paymentsForInvestor.push(...payments);
    }

    // Return sorted by createdAt descending
    return paymentsForInvestor.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getPaymentById = query({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, { paymentId }) => {
    const payment = await ctx.db.get(paymentId);
    if (!payment) throw new Error("Payment not found");
    return payment;
  },
});

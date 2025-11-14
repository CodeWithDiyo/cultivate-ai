// /convex/webhooks.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

/**
 * Handle Flutterwave webhook
 */
export const handleFlutterwaveWebhook = mutation({
  args: {
    paymentData: v.any(), // Accept any JSON data from webhook
  },
  handler: async (ctx, { paymentData }) => {
    console.log("Received Flutterwave webhook:", paymentData);

    // Example: Save the raw webhook payload to a DB table
    await ctx.db.insert("flutterwaveWebhooks", {
      paymentData,
      createdAt: Date.now(),
    });

    // Optional: Update related revenue/payouts
    // if paymentData contains a reference to a revenue/payout ID
    if (paymentData?.revenueId) {
      const revenueId = paymentData.revenueId as Id<"revenues">;
      await ctx.db.patch(revenueId, { status: "completed" });
      console.log(`Marked revenue ${revenueId} as completed.`);
    }

    return { success: true };
  },
});

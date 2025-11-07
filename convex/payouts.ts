import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Cultivate AI: Payout System
 * Handles outgoing payments to users.
 */

// Create a payout request
export const createPayout = mutation({
  args: {
    userId: v.id("userProfiles"),
    amount: v.number(),
    method: v.string(), // e.g. "flutterwave", "bank_transfer"
    details: v.optional(v.string()), // optional note or metadata
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"), v.literal("paid"))),
  },
  handler: async (ctx, args) => {
    const payoutId = await ctx.db.insert("payoutRequests", {
      userId: args.userId,
      amount: args.amount,
      method: args.method,
      details: args.details ?? "",
      status: args.status ?? "pending",
      createdAt: Date.now(),
    });

    return { payoutId };
  },
});

// Approve payout (admin action)
export const approvePayout = mutation({
  args: { payoutId: v.id("payoutRequests"), approvedBy: v.id("userProfiles") },
  handler: async (ctx, { payoutId, approvedBy }) => {
    const payout = await ctx.db.get(payoutId);
    if (!payout) throw new Error("Payout not found");

    await ctx.db.patch(payoutId, {
      status: "approved",
      details: `${payout.details || ""} | Approved by: ${approvedBy} at ${Date.now()}`,
    });

    return { success: true };
  },
});

// Mark payout as completed (after Flutterwave or bank transfer)
export const completePayout = mutation({
  args: { payoutId: v.id("payoutRequests") },
  handler: async (ctx, { payoutId }) => {
    const payout = await ctx.db.get(payoutId);
    if (!payout) throw new Error("Payout not found");

    await ctx.db.patch(payoutId, { status: "paid" });

    // Log transaction
    await ctx.db.insert("transactions", {
      userId: payout.userId,
      type: "payout",
      amount: payout.amount,
      currency: "USD",
      description: "Payout completed",
      createdAt: Date.now(),
    });

    return { success: true };
  },
});

// Fetch payouts for a specific user
export const getUserPayouts = query({
  args: { userId: v.id("userProfiles") },
  handler: async (ctx, { userId }) => {
    const payouts = await ctx.db
      .query("payoutRequests")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return payouts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Fetch all payouts (admin)
export const getAllPayouts = query({
  args: {},
  handler: async (ctx) => {
    const payouts = await ctx.db.query("payoutRequests").collect();
    return payouts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// AI mock for payout optimization
export const optimizePayoutDistribution = mutation({
  args: {
    totalBudget: v.number(),
    activeUsers: v.number(),
  },
  handler: async (ctx, { totalBudget, activeUsers }) => {
    const avgReward = totalBudget / activeUsers;
    return {
      message: "AI-optimized payout distribution completed",
      recommendedAverage: avgReward.toFixed(2),
    };
  },
});

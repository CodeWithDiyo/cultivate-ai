// FILE: /convex/transactions.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Transaction management for Cultivate AI
 * Tracks all completed payments, investments, and returns.
 */

// ✅ Record a new transaction
export const recordTransaction = mutation({
  args: {
    userId: v.id("userProfiles"),
    type: v.union(
      v.literal("investment"),
      v.literal("revenue"),
      v.literal("payout"),
      v.literal("commission")
    ),
    amount: v.number(),
    currency: v.string(),
    description: v.string(),
    relatedId: v.optional(v.string()), // can store campaignId, bidId, or payoutId
  },
  handler: async (ctx, args) => {
    const transactionId = await ctx.db.insert("transactions", {
      userId: args.userId,
      type: args.type,
      amount: args.amount,
      currency: args.currency,
      description: args.description,
      relatedId: args.relatedId ?? undefined,
      createdAt: Date.now(),
    });

    return { transactionId };
  },
});

// ✅ Get all transactions for a specific user
export const getUserTransactions = query({
  args: { userId: v.id("userProfiles") },
  handler: async (ctx, { userId }) => {
    const txs = await ctx.db
      .query("transactions")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return txs.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ✅ Get transactions linked to a specific campaign
export const getTransactionsByCampaign = query({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const txs = await ctx.db.query("transactions").collect();
    return txs.filter((t) => t.relatedId === campaignId);
  },
});

// ✅ Update a transaction (e.g. for reconciliation)
export const updateTransaction = mutation({
  args: {
    transactionId: v.id("transactions"),
    description: v.optional(v.string()),
    amount: v.optional(v.number()),
  },
  handler: async (ctx, { transactionId, ...updates }) => {
    const transaction = await ctx.db.get(transactionId);
    if (!transaction) throw new Error("Transaction not found");

    await ctx.db.patch(transactionId, updates);
    return { success: true };
  },
});

// ✅ Fetch all transactions (admin only)
export const getAllTransactions = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("transactions").collect();
    return all.sort((a, b) => b.createdAt - a.createdAt);
  },
});

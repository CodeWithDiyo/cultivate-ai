import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Manage campaign investments/bids
 */

// Create a new investment/bid for a campaign
export const createInvestment = mutation({
  args: {
    campaignId: v.id("economicCampaigns"),
    investorId: v.id("userProfiles"),
    principal: v.number(),
    affiliateId: v.optional(v.id("userProfiles")),
  },
  handler: async (ctx, { campaignId, investorId, principal, }) => {
    const investmentId = await ctx.db.insert("campaignBids", {
      campaignId,
      investorId,
      amount: principal,
      remaining: principal,
      status: "pending",
      createdAt: Date.now(),
    });

    return investmentId;
  },
});

// Mark an investment as funded
export const markInvestmentFunded = mutation({
  args: { investmentId: v.id("campaignBids") },
  handler: async (ctx, { investmentId }) => {
    await ctx.db.patch(investmentId, { status: "funded" });
    return { success: true };
  },
});

// Get all investments for a campaign (real-time)
export const getInvestmentsByCampaign = query({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async (ctx, { campaignId }) => {
    return await ctx.db
      .query("campaignBids")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();
  },
});

// Get all investments for an investor (real-time)
export const getInvestmentsByInvestor = query({
  args: { investorId: v.id("userProfiles") },
  handler: async (ctx, { investorId }) => {
    return await ctx.db
      .query("campaignBids")
      .withIndex("by_investorId", (q) => q.eq("investorId", investorId))
      .collect();
  },
});

// Repay part of an investment (updates remaining principal)
export const repayInvestment = mutation({
  args: { investmentId: v.id("campaignBids"), amount: v.number() },
  handler: async (ctx, { investmentId, amount }) => {
    const investment = await ctx.db.get(investmentId);
    if (!investment) throw new Error("Investment not found");

    const newRemaining = Math.max(0, investment.remaining - amount);
    const newStatus = newRemaining === 0 ? "settled" : investment.status;

    await ctx.db.patch(investmentId, {
      remaining: newRemaining,
      status: newStatus,
    });

    return { success: true, remaining: newRemaining, status: newStatus };
  },
});

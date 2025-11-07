import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Revenue system for Cultivate AI
 * Tracks campaign revenue, investor returns, and platform earnings.
 */

// Add or update revenue entry
export const recordRevenue = mutation({
  args: {
    investorId: v.id("userProfiles"),
    campaignId: v.id("economicCampaigns"),
    type: v.union(
      v.literal("investor_profit"),
      v.literal("affiliate_reward"),
      v.literal("platform_fee")
    ),
    amount: v.number(),
    status: v.optional(v.union(v.literal("pending"), v.literal("completed"))),
  },
  handler: async (ctx, args) => {
    const revenueId = await ctx.db.insert("revenues", {
      investorId: args.investorId,
      campaignId: args.campaignId,
      type: args.type,
      amount: args.amount,
      status: args.status ?? "pending",
      createdAt: Date.now(),
    });

    return { revenueId };
  },
});

// Fetch total platform revenue (only platform_fee)
export const getPlatformRevenue = query({
  args: {},
  handler: async (ctx) => {
    const revenues = await ctx.db.query("revenues").collect();
    const total = revenues
      .filter((r) => r.type === "platform_fee" && r.status === "completed")
      .reduce((sum, r) => sum + r.amount, 0);

    return { total, count: revenues.length };
  },
});

// Fetch campaign revenue
export const getCampaignRevenue = query({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const revenues = await ctx.db
      .query("revenues")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .collect();

    const total = revenues.reduce((sum, r) => sum + r.amount, 0);
    return { total, breakdown: revenues };
  },
});

// Fetch revenue by investor/user
export const getUserRevenue = query({
  args: { investorId: v.id("userProfiles") },
  handler: async (ctx, { investorId }) => {
    const revenues = await ctx.db
      .query("revenues")
      .withIndex("by_investorId", (q) => q.eq("investorId", investorId))
      .collect();

    const total = revenues.reduce((sum, r) => sum + r.amount, 0);
    const completed = revenues
      .filter((r) => r.status === "completed")
      .reduce((s, r) => s + r.amount, 0);

    return { total, completed, revenues };
  },
});

// Update revenue status
export const updateRevenueStatus = mutation({
  args: {
    revenueId: v.id("revenues"),
    status: v.union(v.literal("pending"), v.literal("completed")),
  },
  handler: async (ctx, { revenueId, status }) => {
    const revenue = await ctx.db.get(revenueId);
    if (!revenue) throw new Error("Revenue not found");

    await ctx.db.patch(revenueId, { status });
    return { success: true };
  },
});

// AI-assisted revenue projection (mock)
export const projectRevenueGrowth = mutation({
  args: {
    campaignId: v.id("economicCampaigns"),
    months: v.number(),
  },
  handler: async (ctx, { campaignId, months }) => {
    const campaign = await ctx.db.get(campaignId);
    if (!campaign) throw new Error("Campaign not found");

    // Mock AI projection
    const base = Math.random() * 0.2 + 0.8; // simulate growth
    const projection = Array.from({ length: months }).map((_, i) => ({
      month: i + 1,
      expectedGrowth: Math.round((campaign.raisedAmount || 0) * base ** (i + 1)),
    }));

    return { campaign: campaign.title, projection };
  },
});

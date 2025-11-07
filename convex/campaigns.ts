import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Campaign CRUD + real-time queries
 */

export const createCampaign = mutation({
  args: {
    userId: v.id("userProfiles"), // match schema
    title: v.string(),
    description: v.string(),
    sector: v.string(),
    location: v.optional(v.string()),
    fundingGoal: v.number(),
    minInvestment: v.number(),
    thumbnailUrl: v.optional(v.string()),
  },
  handler: async (
    ctx,
    { userId, title, description, sector, location, fundingGoal, minInvestment, thumbnailUrl }
  ) => {
    const newCampaignId = await ctx.db.insert("economicCampaigns", {
      userId,
      title,
      description,
      sector,
      location: location ?? undefined,
      fundingGoal,
      minInvestment,
      raisedAmount: 0,
      status: "pending", // initial state until approved
      aiScore: undefined,
      aiSummary: undefined,
      thumbnailUrl: thumbnailUrl ?? undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return newCampaignId;
  },
});

/**
 * Get campaign by ID
 */
export const getCampaignById = query({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async (ctx, { campaignId }) => {
    return await ctx.db.get(campaignId);
  },
});

/**
 * Get all active (approved + funding) campaigns
 */
export const getActiveCampaigns = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("economicCampaigns")
      .withIndex("by_status", (q) => q.eq("status", "funding"))
      .collect();
  },
});

/**
 * Update campaign status
 */
export const updateCampaignStatus = mutation({
  args: {
    campaignId: v.id("economicCampaigns"),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("funding"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, { campaignId, status }) => {
    await ctx.db.patch(campaignId, { status, updatedAt: Date.now() });
    return { success: true };
  },
});

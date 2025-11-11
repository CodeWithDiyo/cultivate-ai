// FILE: /convex/ai.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { runAgentTask } from "@/lib/agentkit";

/**
 * AgentKit AI integration for Cultivate AI
 */

// Recommend campaigns with potential climate impact
export const recommendCampaigns = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await runAgentTask({
      userId,
      taskName: "recommend_campaigns",
      context: { userId },
    });
  },
});

// Generate step-by-step climate solution plan for a campaign
export const generateCampaignSolutionPlan = mutation({
  args: { campaignId: v.id("economicCampaigns"), userId: v.string() },
  handler: async (ctx, { campaignId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "campaign_solution_plan",
      context: { campaignId },
    });
  },
});

// Recommend potential innovators for grants/loans
export const recommendInnovatorsForGrant = query({
  args: { grantId: v.id("economicCampaigns"), userId: v.string() },
  handler: async (ctx, { grantId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "grant_innovator_matching",
      context: { grantId },
    });
  },
});

// Evaluate an innovator's solution
export const evaluateSolution = query({
  args: { solutionId: v.id("solutions"), userId: v.string() },
  handler: async (ctx, { solutionId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "evaluate_solution",
      context: { solutionId },
    });
  },
});

// Cache AI recommendations for a campaign
export const generateAndCacheRecommendations = mutation({
  args: {
    campaignId: v.id("economicCampaigns"),
  },
  handler: async ({ campaignId }, ctx) => {
    const campaigns = await ctx.db.economicCampaigns.getAll();
    if (!campaigns) return [];

    const campaignList = campaigns.map(c => ({ id: c._id, title: c.title, sector: c.sector }));

    const prompt = `
      You are a climate change AI advisor.
      Given the following campaigns, recommend the top 5 campaigns for campaign ID ${campaignId}:
      ${JSON.stringify(campaignList)}
      Return an array of campaign IDs only.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content ?? "[]";
    const recommendedIds = JSON.parse(text);

    // Cache in Convex
    await ctx.db.aiRecommendations.insert({
      campaignId,
      recommendedCampaignIds: recommendedIds,
      createdAt: Date.now(),
    });

    return recommendedIds;
  },
});

// Query to get cached recommendations
export const getRecommendations = query({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async ({ campaignId }, ctx) => {
    const cached = await ctx.db.aiRecommendations.filter(r => r.campaignId === campaignId).first();
    return cached?.recommendedCampaignIds ?? [];
  },
});
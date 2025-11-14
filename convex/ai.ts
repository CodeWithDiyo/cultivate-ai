// /convex/ai.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { runAgentTask } from "../lib/agentkit";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/* --------------------------------------------------
   1️⃣ Recommend campaigns
-------------------------------------------------- */
export const recommendCampaigns = query({
  args: { userId: v.string() },
  handler: async (_ctx, { userId }) => {
    return await runAgentTask({
      userId,
      taskName: "recommend_campaigns",
      context: { userId },
    });
  },
});

/* --------------------------------------------------
   2️⃣ Generate climate plan
-------------------------------------------------- */
export const generateCampaignSolutionPlan = mutation({
  args: {
    campaignId: v.id("economicCampaigns"),
    userId: v.string(),
  },
  handler: async (_ctx, { campaignId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "campaign_solution_plan",
      context: { campaignId },
    });
  },
});

/* --------------------------------------------------
   3️⃣ Recommend innovators
-------------------------------------------------- */
export const recommendInnovatorsForGrant = query({
  args: {
    grantId: v.id("economicCampaigns"),
    userId: v.string(),
  },
  handler: async (_ctx, { grantId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "grant_innovator_matching",
      context: { grantId },
    });
  },
});

/* --------------------------------------------------
   4️⃣ Evaluate solution
-------------------------------------------------- */
export const evaluateSolution = query({
  args: {
    solutionId: v.id("solutions"), 
    userId: v.string(),
  },
  handler: async (_ctx, { solutionId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "evaluate_solution",
      context: { solutionId },
    });
  },
});

/* --------------------------------------------------
   5️⃣ Generate + cache recommendations
-------------------------------------------------- */
export const generateAndCacheRecommendations = mutation({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const campaigns = await ctx.db.query("economicCampaigns").collect();
    if (!campaigns.length) return [];

    const prompt = `
      You are a climate innovation AI advisor.
      Given these campaigns, recommend the top 5 related to ${campaignId}.
      Return ONLY JSON: ["id1","id2","id3"].
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices?.[0]?.message?.content ?? "[]";

    let recommended: string[] = [];
    try {
      recommended = JSON.parse(text);
    } catch {
      recommended = [];
    }

    await ctx.db.insert("aiRecommendations", {
      campaignId,
      recommendedCampaignIds: recommended,
      createdAt: Date.now(),
    });

    return recommended;
  },
});

/* --------------------------------------------------
   6️⃣ Get cached recommendations
-------------------------------------------------- */
export const getRecommendations = query({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async (ctx, { campaignId }) => {
    const cached = await ctx.db
      .query("aiRecommendations")
      .withIndex("by_campaignId", (q) => q.eq("campaignId", campaignId))
      .order("desc")
      .first();

    return cached?.recommendedCampaignIds ?? [];
  },
});

// FILE: /convex/ai.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { runAgentTask } from "../lib/agentkit"; // ✅ fixed relative import
import OpenAI from "openai"; // ✅ properly import OpenAI SDK (if used)

// ✅ Initialize OpenAI safely
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * 🤖 AgentKit + OpenAI AI Integration for Cultivate AI
 * ----------------------------------------------------
 * Handles intelligent recommendations, evaluations, and cache of AI insights.
 */

/* --------------------------------------------------
   1️⃣ Recommend campaigns with high climate potential
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
   2️⃣ Generate climate solution plan for a campaign
-------------------------------------------------- */
export const generateCampaignSolutionPlan = mutation({
  args: { campaignId: v.id("economicCampaigns"), userId: v.string() },
  handler: async (_ctx, { campaignId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "campaign_solution_plan",
      context: { campaignId },
    });
  },
});

/* --------------------------------------------------
   3️⃣ Recommend innovators for grants or loans
-------------------------------------------------- */
export const recommendInnovatorsForGrant = query({
  args: { grantId: v.id("economicCampaigns"), userId: v.string() },
  handler: async (_ctx, { grantId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "grant_innovator_matching",
      context: { grantId },
    });
  },
});

/* --------------------------------------------------
   4️⃣ Evaluate an innovator’s submitted solution
-------------------------------------------------- */
export const evaluateSolution = query({
  args: { solutionId: v.id("solutions"), userId: v.string() },
  handler: async (_ctx, { solutionId, userId }) => {
    return await runAgentTask({
      userId,
      taskName: "evaluate_solution",
      context: { solutionId },
    });
  },
});

/* --------------------------------------------------
   5️⃣ Generate + cache AI campaign recommendations
-------------------------------------------------- */
export const generateAndCacheRecommendations = mutation({
  args: { campaignId: v.id("economicCampaigns") },
  handler: async (ctx, { campaignId }) => {
    // ✅ fetch all campaigns
    const campaigns = await ctx.db.query("economicCampaigns").collect();
    if (!campaigns || campaigns.length === 0) return [];

    const campaignList = campaigns.map((c) => ({
      id: c._id,
      title: c.title,
      sector: c.sector,
    }));

    const prompt = `
      You are a climate innovation AI advisor.
      Given the following campaigns, recommend the top 5 most impactful campaigns
      related to campaign ID ${campaignId}.
      Campaign list: ${JSON.stringify(campaignList)}
      Return only an array of campaign IDs (JSON).
    `;

    // ✅ OpenAI call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices?.[0]?.message?.content ?? "[]";
    let recommendedIds: string[] = [];
    try {
      recommendedIds = JSON.parse(text);
    } catch {
      recommendedIds = [];
    }

    // ✅ cache results in Convex
    await ctx.db.insert("aiRecommendations", {
      campaignId,
      recommendedCampaignIds: recommendedIds,
      createdAt: Date.now(),
    });

    return recommendedIds;
  },
});

/* --------------------------------------------------
   6️⃣ Get cached AI recommendations
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

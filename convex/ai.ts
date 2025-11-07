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

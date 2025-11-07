import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  /**
   * ===========================
   * USERS
   * ===========================
   */
  userProfiles: defineTable({
    clerkId: v.string(), // Clerk Auth ID
    fullName: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("innovator"),
      v.literal("investor"),
      v.literal("grantmaker"),
      v.literal("admin"),
      v.literal("public")
    ),
    avatarUrl: v.optional(v.string()),
    country: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  /**
   * ===========================
   * CAMPAIGNS (Climate Projects)
   * ===========================
   */
  economicCampaigns: defineTable({
    userId: v.id("userProfiles"), // creator / innovator
    title: v.string(),
    description: v.string(),
    sector: v.string(), // e.g. renewable energy, waste mgmt, etc.
    location: v.optional(v.string()),
    fundingGoal: v.number(),
    minInvestment: v.number(),
    raisedAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("funding"),
      v.literal("completed")
    ),
    aiScore: v.optional(v.number()), // from AI analysis
    aiSummary: v.optional(v.string()), // short AI insight
    thumbnailUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_sector", ["sector"]),

  /**
   * ===========================
   * INVESTMENTS
   * ===========================
   */
  campaignBids: defineTable({
    campaignId: v.id("economicCampaigns"),
    investorId: v.id("userProfiles"),
    affiliateId: v.optional(v.id("userProfiles")),
    amount: v.number(),
    remaining: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed"),
      v.literal("funded"),
      v.literal("settled")
    ),
    createdAt: v.number(),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_investorId", ["investorId"])
    .index("by_status", ["status"]),

  /**
   * ===========================
   * PAYMENTS (Flutterwave)
   * ===========================
   */
  payments: defineTable({
    bidId: v.id("campaignBids"),
    txRef: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("success"),
      v.literal("failed")
    ),
    amount: v.number(),
    currency: v.string(),
    paymentMethod: v.optional(v.string()),
    response: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_bidId", ["bidId"])
    .index("by_txRef", ["txRef"]),

  /**
   * ===========================
   * TRANSACTIONS LOG
   * ===========================
   */
  transactions: defineTable({
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
    relatedId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"]),

  /**
   * ===========================
   * REVENUE DISTRIBUTION
   * ===========================
   */
  revenues: defineTable({
    campaignId: v.id("economicCampaigns"),
    investorId: v.id("userProfiles"),
    amount: v.number(),
    type: v.union(
      v.literal("investor_profit"),
      v.literal("affiliate_reward"),
      v.literal("platform_fee")
    ),
    status: v.union(v.literal("pending"), v.literal("completed")),
    createdAt: v.number(),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_investorId", ["investorId"])
    .index("by_status", ["status"]),

  /**
   * ===========================
   * PAYOUT REQUESTS
   * ===========================
   */
  payoutRequests: defineTable({
    userId: v.id("userProfiles"),
    amount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("paid")
    ),
    method: v.string(),
    details: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"]),

  /**
   * ===========================
   * NOTIFICATIONS (Real-time)
   * ===========================
   */
  notifications: defineTable({
    userId: v.id("userProfiles"),
    message: v.string(),
    type: v.union(
      v.literal("sale"),
      v.literal("commission"),
      v.literal("system"),
      v.literal("alert"),
      v.literal("info"),
      v.literal("ai_recommendation")
    ),
    meta: v.optional(v.any()),
    read: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_type", ["type"])
    .index("by_read", ["read"]),

  /**
   * ===========================
   * AI CONTENT (Analysis & Insights)
   * ===========================
   */
  aiContents: defineTable({
    campaignId: v.optional(v.id("economicCampaigns")),
    type: v.union(
      v.literal("summary"),
      v.literal("recommendation"),
      v.literal("forecast"),
      v.literal("solution")
    ),
    content: v.string(),
    createdAt: v.number(),
  })
    .index("by_campaignId", ["campaignId"])
    .index("by_type", ["type"]),

  /**
   * ===========================
   * AI RECOMMENDATIONS CACHE
   * ===========================
   */
  aiRecommendations: defineTable({
    campaignId: v.id("economicCampaigns"),
    recommendedCampaignIds: v.array(v.string()),
    score: v.optional(v.number()),
    createdAt: v.number(),
  }).index("by_campaignId", ["campaignId"]),
});

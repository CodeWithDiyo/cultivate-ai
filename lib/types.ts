// /src/lib/types.ts
import type { Id } from "@/convex/_generated/dataModel";

export type Campaign = {
  _id: Id<"economicCampaigns">;
  userId: Id<"userProfiles">;
  title: string;
  description: string;
  sector: string;
  status: "pending" | "approved" | "rejected" | "funding" | "completed";
  location?: string;
  fundingGoal?: number;
  minInvestment?: number;
  raisedAmount?: number;
  thumbnailUrl?: string;
  aiScore?: number;
  aiSummary?: string;
  createdAt: number;
  updatedAt: number;
};

export type Revenue = {
  _id: Id<"revenues">;
  investorId: Id<"userProfiles">;
  campaignId: Id<"economicCampaigns">;
  type: "investor_profit" | "affiliate_reward" | "platform_fee";
  amount: number;
  status: "pending" | "completed";
  createdAt: number;
};
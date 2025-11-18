"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import type { Id } from "@/convex/_generated/dataModel";

/**
 * Campaign type (matches convex schema economicCampaigns)
 */
type Campaign = {
  _id: Id<"economicCampaigns">;
  userId: Id<"userProfiles">;
  title: string;
  description: string;
  sector: string;
  location?: string;
  fundingGoal: number;
  minInvestment: number;
  raisedAmount: number;
  status: "pending" | "approved" | "rejected" | "funding" | "completed";
  aiScore?: number;
  aiSummary?: string;
  thumbnailUrl?: string;
  createdAt: number;
  updatedAt: number;
};

export default function InvestorCampaignPage() {
  const { user } = useUser();
  // NOTE: your Clerk user id is not automatically a Convex Id<"userProfiles">.
  // If you store Clerk -> userProfiles mapping, replace the casting below with the actual Convex id.
  const investorId = (user?.id ?? "") as Id<"userProfiles">;

  const params = useParams();
  // params.id from next/navigation can be string | string[]; cast to Convex Id type
  const campaignId = (params?.id as string) as Id<"economicCampaigns">;

  // Convex query (cast result to Campaign | undefined)
  const campaign = useQuery(api.campaigns.getCampaignById, { campaignId }) as
    | Campaign
    | undefined;

  const createInvestment = useMutation(api.investments.createInvestment);

  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!campaign) return <p className="p-6">Loading campaign...</p>;

  const handleInvest = async () => {
    if (!investorId) {
      alert("Please sign in to invest.");
      return;
    }
    if (amount === "" || Number(amount) <= 0) {
      alert("Enter a valid investment amount.");
      return;
    }

    const principal = Number(amount);
    setLoading(true);
    try {
      // createInvestment expects: { campaignId: Id<"economicCampaigns">, investorId: Id<"userProfiles">, principal: number, affiliateId?: Id<"userProfiles"> }
      await createInvestment({ campaignId, investorId, principal });
      alert("Investment submitted. Complete payment to fund.");
      router.push("/payments");
    } catch (err) {
      console.error("Investment error:", err);
      alert("Failed to submit investment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{campaign.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{campaign.description}</p>
          <p className="mt-2">Sector: {campaign.sector}</p>
          <p>
            Funding Goal: {campaign.fundingGoal.toLocaleString()} (Min investment:{" "}
            {campaign.minInvestment.toLocaleString()})
          </p>
          <p>Raised: {campaign.raisedAmount.toLocaleString()}</p>

          <div className="mt-4 flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Investment amount"
              value={amount}
              onChange={(e) => {
                const v = e.target.value;
                setAmount(v === "" ? "" : Number(v));
              }}
              className="w-40"
            />
            <Button onClick={handleInvest} disabled={loading || amount === "" || Number(amount) <= 0}>
              {loading ? "Submitting..." : "Invest"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// FILE: /app/investor/campaign/[id]/page.tsx
"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export default function InvestorCampaignPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const params = useParams();
  const campaignId = params?.id ?? "";
  const campaign = useQuery(api.campaigns.getCampaignById, { campaignId });
  const createInvestment = useMutation(api.investments.createInvestment);
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!campaign) return <p className="p-6">Loading campaign...</p>;

  const handleInvest = async () => {
    if (!userId) return alert("Sign in to invest.");
    if (!amount || Number(amount) <= 0) return alert("Enter a valid amount.");

    setLoading(true);
    try {
      await createInvestment({ campaignId, investorId: userId, principal: Number(amount) });
      alert("Investment submitted. Complete payment to fund.");
      router.push("/payments");
    } catch (err) {
      console.error(err);
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
          <p>Goal: {campaign.amount} {campaign.currency ?? "USD"}</p>

          <div className="mt-4 flex gap-2 items-center">
            <Input
              type="number"
              placeholder="Investment amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-40"
            />
            <Button onClick={handleInvest} disabled={loading || !amount}>
              {loading ? "Submitting..." : "Invest"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

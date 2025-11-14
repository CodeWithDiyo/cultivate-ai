"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";

// Match backend revenue type
type RevenueItem = {
  _id: Id<"revenues">;
  investorId: Id<"userProfiles">;
  campaignId: Id<"economicCampaigns">;
  type: "investor_profit" | "affiliate_reward" | "platform_fee";
  amount: number;
  status: "pending" | "completed";
  createdAt: number;
};

export default function RevenuesPage() {
  // Admin fetch all revenues
  const revenues = useQuery(api.revenues.getAll) ?? [];

  // Mutation to mark revenue as completed
  const updateRevenueStatus = useMutation(api.revenues.updateRevenueStatus);

  const handleComplete = (revenueId: Id<"revenues">) => {
    updateRevenueStatus({ revenueId, status: "completed" });
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Revenue & Payouts</h1>

      {revenues.length === 0 && (
        <p className="text-gray-500">No revenues recorded yet.</p>
      )}

      <div className="grid gap-4">
        {revenues.map((r: RevenueItem) => (
          <Card key={r._id} className="shadow-sm">
            <CardHeader>
              <CardTitle>
                Investor: {r.investorId} | {r.amount} USD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Type: {r.type}</p>
              <p className="text-xs text-gray-400">
                Created: {new Date(r.createdAt).toLocaleString()}
              </p>
              {r.status !== "completed" && (
                <Button onClick={() => handleComplete(r._id)}>
                  Mark as Completed
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

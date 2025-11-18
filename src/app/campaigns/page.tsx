"use client";

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OpenAI from "openai";

// --- Types ---
type Campaign = {
  _id: Id<"economicCampaigns">;
  title: string;
  description: string;
  sector: string;
  type: string;
  amount: number;
  currency?: string;
};

// --- OpenAI Client ---
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

export default function PublicCampaignsPage() {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns) as Campaign[] | undefined;

  const [recommended, setRecommended] = useState<Id<"economicCampaigns">[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  // Unique sectors
  const sectors = campaigns ? [...new Set(campaigns.map((c) => c.sector))] : [];

  // Filter campaigns
  const filteredCampaigns =
    sectorFilter === "all"
      ? campaigns
      : campaigns?.filter((c) => c.sector.toLowerCase() === sectorFilter.toLowerCase());

  // --- AI Recommendation ---
  useEffect(() => {
    if (!campaigns || campaigns.length === 0) return;

    const fetchAI = async () => {
      setLoadingAI(true);
      try {
        const prompt = `
          You are an expert climate advisor.
          Recommend the top 5 campaigns from this list based on climate impact.
          Return ONLY a JSON array of campaign IDs.
          
          Campaigns: ${JSON.stringify(campaigns)}
        `;

        const completion = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [{ role: "user", content: prompt }],
        });

        const text = completion.choices[0]?.message?.content ?? "[]";

        const parsed = JSON.parse(text) as Id<"economicCampaigns">[];
        setRecommended(parsed);
      } catch (err) {
        console.error("AI Recommendation Failed:", err);
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAI();
  }, [campaigns]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Active Climate Campaigns</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={sectorFilter === "all" ? "default" : "outline"}
          onClick={() => setSectorFilter("all")}
        >
          All
        </Button>

        {sectors.map((sector) => (
          <Button
            key={sector}
            variant={sectorFilter === sector ? "default" : "outline"}
            onClick={() => setSectorFilter(sector)}
          >
            {sector}
          </Button>
        ))}
      </div>

      {loadingAI && (
        <p className="text-sm text-gray-500">Loading AI recommendations...</p>
      )}

      {/* Campaign Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {filteredCampaigns?.map((c) => {
          const isRecommended = recommended.includes(c._id);

          return (
            <Card
              key={c._id}
              className={`shadow-sm hover:shadow-md transition ${
                isRecommended ? "border-2 border-green-500" : ""
              }`}
            >
              <CardHeader>
                <CardTitle>
                  {c.title}
                  {isRecommended && (
                    <span className="text-green-600 text-sm ml-2">Recommended</span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Sector: {c.sector} | Type: {c.type} | Goal: {c.amount}{" "}
                  {c.currency ?? "USD"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

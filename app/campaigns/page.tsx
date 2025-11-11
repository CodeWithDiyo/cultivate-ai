"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default function PublicCampaignsPage() {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  const filteredCampaigns =
    sectorFilter === "all"
      ? campaigns
      : campaigns?.filter((c: any) => c.sector.toLowerCase() === sectorFilter.toLowerCase());

  const sectors = Array.from(new Set(campaigns?.map((c: any) => c.sector) ?? []));

  // AI recommendation
  useEffect(() => {
    const fetchAIRecommendations = async () => {
      if (!campaigns || campaigns.length === 0) return;
      setLoadingAI(true);
      try {
        const prompt = `
          You are an expert climate change advisor. 
          Recommend the top 5 campaigns from this list based on potential global/local climate impact:
          ${JSON.stringify(campaigns)}
          Return an array of campaign IDs only.
        `;
        const response = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [{ role: "user", content: prompt }],
        });
        const text = response.choices[0]?.message?.content ?? "[]";
        const ids = JSON.parse(text);
        setRecommended(ids);
      } catch (err) {
        console.error("AI recommendation failed:", err);
      } finally {
        setLoadingAI(false);
      }
    };
    fetchAIRecommendations();
  }, [campaigns]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Active Climate Campaigns</h1>

      <div className="flex gap-2 mb-4">
        <Button variant={sectorFilter === "all" ? "default" : "outline"} onClick={() => setSectorFilter("all")}>
          All
        </Button>
        {sectors.map((s) => (
          <Button key={s} variant={sectorFilter === s ? "default" : "outline"} onClick={() => setSectorFilter(s)}>
            {s}
          </Button>
        ))}
      </div>

      {loadingAI && <p className="text-sm text-gray-500">Loading AI recommendations...</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {filteredCampaigns?.map((c: any) => {
          const isRecommended = recommended.includes(c._id);
          return (
            <Card key={c._id} className={`shadow-sm hover:shadow-md transition ${isRecommended ? "border-2 border-green-500" : ""}`}>
              <CardHeader>
                <CardTitle>
                  {c.title} {isRecommended && <span className="text-green-600 text-sm">Recommended</span>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-2">{c.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Sector: {c.sector} | Type: {c.type} | Goal: {c.amount} {c.currency ?? "USD"}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

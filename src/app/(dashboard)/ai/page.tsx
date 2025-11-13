// FILE: /app/(dashboard)/ai/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default function AIDashboard() {
  const campaigns = useQuery(api.campaigns.getActiveCampaigns);
  const [aiInsights, setAIInsights] = useState<string>("Loading AI insights...");

  useEffect(() => {
    if (!campaigns) return;
    const fetchInsights = async () => {
      try {
        const prompt = `
          You are an AI advisor for climate change campaigns. 
          Provide a concise summary and recommend top 3 campaigns from this list:
          ${JSON.stringify(campaigns)}
        `;
        const response = await openai.chat.completions.create({
          model: "gpt-5-mini",
          messages: [{ role: "user", content: prompt }],
        });
        setAIInsights(response.choices[0].message?.content ?? "No AI insights available.");
      } catch (err) {
        console.error(err);
        setAIInsights("Failed to load AI insights.");
      }
    };
    fetchInsights();
  }, [campaigns]);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">AI Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 whitespace-pre-line">{aiInsights}</p>
        </CardContent>
      </Card>
    </div>
  );
}

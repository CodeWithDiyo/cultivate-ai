"use client";

import React, { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";
import { useConvexMutation } from "@/hooks/useConvexMutation";

interface Props {
  userId: string;
}

export default function CreateCampaignForm({ userId }: Props) {
  const router = useRouter();

  // This should now work without errors
  const createCampaign = useConvexMutation(api.campaigns.createCampaign);

  const convexUserId = userId as Id<"userProfiles">;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [location, setLocation] = useState("");
  const [fundingGoal, setFundingGoal] = useState<number | "">("");
  const [minInvestment, setMinInvestment] = useState<number | "">("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!convexUserId) {
      alert("You must be signed in to create a campaign.");
      return;
    }
    if (!title || !description || !sector || !fundingGoal || !minInvestment) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const newId = await createCampaign({
        userId: convexUserId,
        title,
        description,
        sector,
        location: location || undefined,
        fundingGoal: Number(fundingGoal),
        minInvestment: Number(minInvestment),
        thumbnailUrl: thumbnailUrl || undefined,
      });

      console.log("Campaign created:", newId);
      setTitle("");
      setDescription("");
      setSector("");
      setLocation("");
      setFundingGoal("");
      setMinInvestment("");
      setThumbnailUrl("");

      router.refresh();
      alert("Campaign successfully created.");
    } catch (err) {
      console.error("createCampaign error:", err);
      alert("Failed to create campaign.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input 
        placeholder="Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
      />
      <Textarea 
        placeholder="Description" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
        required 
      />
      <Input 
        placeholder="Sector" 
        value={sector} 
        onChange={(e) => setSector(e.target.value)} 
        required 
      />
      <Input 
        placeholder="Location (optional)" 
        value={location} 
        onChange={(e) => setLocation(e.target.value)} 
      />
      <Input
        type="number"
        placeholder="Funding Goal"
        value={fundingGoal}
        onChange={(e) => setFundingGoal(e.target.value === "" ? "" : Number(e.target.value))}
        required
      />
      <Input
        type="number"
        placeholder="Min Investment"
        value={minInvestment}
        onChange={(e) => setMinInvestment(e.target.value === "" ? "" : Number(e.target.value))}
        required
      />
      <Input 
        placeholder="Thumbnail URL (optional)" 
        value={thumbnailUrl} 
        onChange={(e) => setThumbnailUrl(e.target.value)} 
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}

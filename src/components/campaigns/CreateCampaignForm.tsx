"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel"; // import Id type

interface Props {
  userId: string; // Clerk user ID (string)
}

export default function CreateCampaignForm({ userId }: Props) {
  const router = useRouter();
  const createCampaign = useMutation(api.campaigns.createCampaign);

  // Cast Clerk string ID to Convex ID type
  const convexUserId = userId as unknown as Id<"userProfiles">;

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
    if (!convexUserId) return alert("You must be signed in to create a campaign.");
    if (!title.trim() || !description.trim() || !sector.trim() || !fundingGoal || !minInvestment) {
      return alert("Please fill all required fields.");
    }

    setLoading(true);
    try {
      await createCampaign({
        userId: convexUserId,
        title,
        description,
        sector,
        location: location || undefined,
        fundingGoal: Number(fundingGoal),
        minInvestment: Number(minInvestment),
        thumbnailUrl: thumbnailUrl || undefined,
      });

      // Clear form
      setTitle("");
      setDescription("");
      setSector("");
      setLocation("");
      setFundingGoal("");
      setMinInvestment("");
      setThumbnailUrl("");

      router.refresh();
      alert("Campaign created successfully.");
    } catch (err: unknown) {
      console.error(err);
      alert("Failed to create campaign.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input placeholder="Campaign title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <Input placeholder="Sector (e.g., Agriculture, Energy)" value={sector} onChange={(e) => setSector(e.target.value)} required />
      <Input placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
      <Input
        type="number"
        placeholder="Funding Goal (e.g., 10000)"
        value={fundingGoal}
        onChange={(e) => setFundingGoal(e.target.value === "" ? "" : Number(e.target.value))}
        required
      />
      <Input
        type="number"
        placeholder="Minimum Investment (e.g., 100)"
        value={minInvestment}
        onChange={(e) => setMinInvestment(e.target.value === "" ? "" : Number(e.target.value))}
        required
      />
      <Input placeholder="Thumbnail URL (optional)" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}

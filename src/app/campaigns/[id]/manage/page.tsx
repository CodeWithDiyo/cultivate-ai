// FILE: /app/campaigns/[id]/manage/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditCampaignPage() {
  const params = useParams();
  const campaignId = params?.id ?? "";
  const campaign = useQuery(api.campaigns.getCampaignById, { campaignId });
  const updateCampaignStatus = useMutation(api.campaigns.updateCampaignStatus);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (campaign) {
      setTitle(campaign.title ?? "");
      setDescription(campaign.description ?? "");
      setSector(campaign.sector ?? "");
      setAmount(campaign.amount ?? "");
    }
  }, [campaign]);

  const handlePublish = async (newStatus: "active" | "completed" | "cancelled") => {
    setLoading(true);
    try {
      await updateCampaignStatus({ campaignId, status: newStatus });
      alert("Campaign status updated.");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to update campaign status.");
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) return <p className="p-6">Loading campaign...</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Edit Campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            <Input value={sector} onChange={(e) => setSector(e.target.value)} placeholder="Sector" />
            <Input
              type="number"
              value={amount === "" ? "" : amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="Amount"
            />

            <div className="flex gap-2 mt-3">
              <Button onClick={() => handlePublish("active")} disabled={loading}>
                Mark Active
              </Button>
              <Button variant="destructive" onClick={() => handlePublish("cancelled")} disabled={loading}>
                Cancel Campaign
              </Button>
              <Button onClick={() => handlePublish("completed")} disabled={loading}>
                Mark Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

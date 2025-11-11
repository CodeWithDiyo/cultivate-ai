// FILE: /components/campaigns/CreateCampaignForm.tsx
"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Props {
  ownerId: string;
}

export default function CreateCampaignForm({ ownerId }: Props) {
  const router = useRouter();
  const createCampaign = useMutation(api.campaigns.createCampaign);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("");
  const [type, setType] = useState<"grant" | "loan" | "empowerment" | "fixed_asset">("grant");
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ownerId) return alert("You must be signed in to create a campaign.");
    if (!title.trim() || !description.trim() || !sector.trim() || !amount) return alert("Please fill all fields.");

    setLoading(true);
    try {
      await createCampaign({
        ownerId,
        title,
        description,
        sector,
        type,
        amount: Number(amount),
        country: undefined,
      });
      // Clear form
      setTitle("");
      setDescription("");
      setSector("");
      setAmount("");
      // redirect to manage page or refresh
      router.refresh();
      alert("Campaign created successfully.");
    } catch (err) {
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

      <div className="flex gap-2">
        <Select value={type} onValueChange={(v) => setType(v as any)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="grant">Grant</SelectItem>
            <SelectItem value="loan">Loan</SelectItem>
            <SelectItem value="empowerment">Empowerment</SelectItem>
            <SelectItem value="fixed_asset">Fixed Asset</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Amount (e.g., 10000)"
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </div>
    </form>
  );
}

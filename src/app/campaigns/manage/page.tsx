// FILE: /app/campaigns/manage/page.tsx
"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import CreateCampaignForm from "@/src/components/campaigns/CreateCampaignForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function ManageCampaignsPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const myCampaigns = useQuery(api.campaigns.getCampaignsByOwner, { ownerId: userId });

  // Fallback: if backend hasn't defined getCampaignsByOwner, use getActiveCampaigns and filter client-side
  const campaigns = myCampaigns ?? [];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">My Campaigns</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create a new campaign</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCampaignForm ownerId={userId} />
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-semibold mt-6 mb-3">Your submitted campaigns</h2>
        {!campaigns || campaigns.length === 0 ? (
          <p className="text-sm text-muted-foreground">No campaigns yet — create the first one above.</p>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((c: any) => (
              <Card key={c._id} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{c.title}</span>
                    <span className="text-sm text-muted-foreground">{c.status}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                  <div className="mt-3 flex gap-2">
                    <Link href={`/campaigns/${c._id}/manage`} className="text-blue-600 hover:underline">
                      Edit
                    </Link>
                    <Link href={`/campaigns/${c._id}`} className="text-blue-600 hover:underline">
                      View Public
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

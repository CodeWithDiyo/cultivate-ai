// FILE: /app/admin/page.tsx
"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const campaigns = useQuery(api.campaigns.getPendingCampaigns); // Convex query for admin review
  const approveCampaign = useMutation(api.campaigns.approveCampaign);
  const rejectCampaign = useMutation(api.campaigns.rejectCampaign);

  if (!campaigns) return <p className="p-6">Loading campaigns...</p>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <section>
        <h2 className="text-lg font-semibold mb-3">Pending Campaigns</h2>
        {campaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns pending approval.</p>
        ) : (
          <div className="grid gap-4">
            {campaigns.map((c: any) => (
              <Card key={c._id} className="shadow-sm hover:shadow-md transition">
                <CardHeader>
                  <CardTitle>{c.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{c.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Sector: {c.sector}</p>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => approveCampaign({ campaignId: c._id })} size="sm">
                      Approve
                    </Button>
                    <Button
                      onClick={() => rejectCampaign({ campaignId: c._id })}
                      variant="destructive"
                      size="sm"
                    >
                      Reject
                    </Button>
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

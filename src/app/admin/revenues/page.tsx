// FILE: /app/admin/revenues/page.tsx
"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function RevenuesPage() {
  const revenues = useQuery(api.revenues.getAll); // Convex query
  const processPayout = useMutation(api.payoutRequests.processPayout);

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold">Revenue & Payouts</h1>

      {revenues?.length === 0 && <p className="text-gray-500">No revenues recorded yet.</p>}

      <div className="grid gap-4">
        {revenues?.map((r: any) => (
          <Card key={r._id} className="shadow-sm">
            <CardHeader>
              <CardTitle>
                {r.userId} | {r.amount} USD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Source: {r.source}</p>
              <p className="text-xs text-gray-400">Created: {new Date(r.createdAt).toLocaleString()}</p>
              {!r.paid && (
                <Button onClick={() => processPayout({ revenueIds: [r._id], amount: r.amount })}>
                  Process Payout
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

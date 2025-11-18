"use client";

import React from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Id } from "@/convex/_generated/dataModel";

type Notification = {
  _id: Id<"notifications">;
  userId: Id<"userProfiles">;
  message: string;
  type: "sale" | "commission" | "system" | "alert" | "info" | "ai_recommendation";
  read: boolean;
  createdAt: number;
  meta?: Record<string, unknown>;
};

export default function NotificationsPage() {
  const { user } = useUser();

  // Clerk user.id is NOT automatically a Convex Id<"userProfiles">.
  // Replace with the real Convex profile ID if you link Clerk -> Convex.
  const userId = (user?.id as string) as Id<"userProfiles">;

  // ✅ FIX: use correct query name
  const notifications =
    useQuery(api.notifications.getUserNotifications, { userId }) as
    | Notification[]
    | undefined;

  const markRead = useMutation(api.notifications.markAsRead);

  if (!userId) return <p className="p-6">Sign in to view notifications.</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {!notifications && <p className="text-gray-500">Loading...</p>}

      {notifications?.length === 0 && (
        <p className="text-gray-500">No notifications yet.</p>
      )}

      {notifications?.map((n) => (
        <Card
          key={n._id}
          className={`shadow-sm ${n.read ? "bg-gray-50" : "bg-white"}`}
        >
          <CardContent className="flex justify-between items-center">
            <div>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>

            {!n.read && (
              <Button
                size="sm"
                onClick={() => markRead({ notificationId: n._id })}
              >
                Mark Read
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

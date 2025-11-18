"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Id } from "@/convex/_generated/dataModel";

/* ------------------------------------------------------
   Notification Interface — matches Convex backend
------------------------------------------------------ */
interface Notification {
  _id: Id<"notifications">;
  _creationTime?: number;
  type:
    | "system"
    | "alert"
    | "info"
    | "commission"
    | "sale"
    | "ai_recommendation";
  message: string;
  read: boolean;
  createdAt: number;
  userId: Id<"userProfiles">;
  meta?: Record<string, unknown>;
}

export default function NotificationCenter() {
  const { user } = useUser();

  // Convert Clerk string ID → Convex typed ID (safe cast)
  const userId = (user?.id as unknown as Id<"userProfiles">) ?? undefined;

  const [tab, setTab] = useState("all");
  const [aiNotifications, setAiNotifications] = useState<Notification[]>([]);

  // Typed query result
  const notifications = useQuery(
  api.notifications.getUserNotifications,
  userId ? { userId } : "skip"
  ) as Notification[] | undefined;


  // Mutation function (typed response shape)
  const prioritize = useMutation(api.notifications.prioritizeNotifications);
  const markAllAsRead = useMutation(api.notifications.markAllAsRead);

  /* Local type for the prioritize() response to avoid implicit `any` */
  type PrioritizeResult = { message?: string; prioritized?: Notification[] } | null | undefined;

  useEffect(() => {
    if (!userId) return;

    let isMounted = true;

    (async () => {
      try {
        // call prioritize and narrow result to the expected shape
        const raw = (await prioritize({ userId })) as PrioritizeResult;
        const prioritized = Array.isArray(raw?.prioritized) ? raw!.prioritized! : [];
        if (isMounted) setAiNotifications(prioritized);
      } catch (err) {
        console.error("Failed to prioritize notifications:", err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [userId, notifications, prioritize]);

  const handleMarkAllRead = async () => {
    if (!userId) return;
    await markAllAsRead({ userId });
  };

  const renderIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "system":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "info":
        return <Info className="h-5 w-5 text-gray-500" />;
      case "commission":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "sale":
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case "ai_recommendation":
        return <Bell className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const renderList = (data: Notification[]) => {
    if (!data?.length)
      return (
        <p className="text-gray-500 text-sm text-center py-8">
          No notifications to display
        </p>
      );

    return data.map((n) => (
      <motion.div
        key={n._id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-start gap-3 rounded-xl p-3 border mb-2 ${
          !n.read ? "bg-blue-50 border-blue-100" : "bg-white"
        }`}
      >
        <div className="mt-1">{renderIcon(n.type)}</div>

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">{n.message}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(n.createdAt).toLocaleString()}
          </p>
        </div>
      </motion.div>
    ));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="shadow-lg rounded-2xl">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-bold text-gray-800">
            Notification Center
          </CardTitle>

          <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
            Mark all as read
          </Button>
        </CardHeader>

        <Separator />

        <CardContent>
          <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="ai">AI Priority</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {renderList((notifications || []) as Notification[])}
            </TabsContent>

            <TabsContent value="unread">
              {renderList(((notifications || []) as Notification[]).filter((n) => !n.read))}
            </TabsContent>

            <TabsContent value="ai">
              {renderList(aiNotifications)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

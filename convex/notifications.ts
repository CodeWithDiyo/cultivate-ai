import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Germinate Notification System (real-time)
 * ----------------------------------------
 * Handles all system, campaign, transaction, and AI-related notifications.
 * Integrates with AgentKit for intelligent alert routing and message generation.
 */

// ✅ Create a new notification
export const createNotification = mutation({
  args: {
    userId: v.id("userProfiles"),
    message: v.string(),
    type: v.union(
      v.literal("sale"),
      v.literal("commission"),
      v.literal("system"),
      v.literal("alert"),
      v.literal("info"),
      v.literal("ai_recommendation")
    ),
    meta: v.optional(v.any()), // Optional context (e.g., campaignId, transactionId)
  },
  handler: async (ctx, { userId, message, type, meta }) => {
    await ctx.db.insert("notifications", {
      userId,
      message,
      type,
      read: false,
      meta: meta ?? {},
      createdAt: Date.now(),
    });
    return { success: true };
  },
});

// ✅ Fetch all notifications for a user
export const getUserNotifications = query({
  args: { userId: v.id("userProfiles") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// ✅ Mark a single notification as read
export const markAsRead = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async (ctx, { notificationId }) => {
    const notif = await ctx.db.get(notificationId);
    if (!notif) throw new Error("Notification not found");

    await ctx.db.patch(notificationId, { read: true });
    return { success: true };
  },
});

// ✅ Mark all notifications for a user as read
export const markAllAsRead = mutation({
  args: { userId: v.id("userProfiles") },
  handler: async (ctx, { userId }) => {
    const notifs = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    await Promise.all(
      notifs.map(async (n) => {
        if (!n.read) await ctx.db.patch(n._id, { read: true });
      })
    );

    return { success: true };
  },
});

// ✅ Get unread notification count (for badge updates)
export const getUnreadCount = query({
  args: { userId: v.id("userProfiles") },
  handler: async (ctx, { userId }) => {
    const unreadNotifs = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    return unreadNotifs.filter((n) => !n.read).length;
  },
});

// ✅ AI-driven prioritization (AgentKit-powered mock)
export const prioritizeNotifications = mutation({
  args: { userId: v.id("userProfiles") },
  handler: async (ctx, { userId }) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    if (notifications.length === 0)
      return { message: "No notifications found", prioritized: [] };

    // Adjusted to match schema: prioritize AI-based recommendation type
    const prioritized = notifications
      .sort((a, b) => {
        const priorityA = (a.read ? 0 : 2) + (a.type === "ai_recommendation" ? 2 : 0);
        const priorityB = (b.read ? 0 : 2) + (b.type === "ai_recommendation" ? 2 : 0);
        return priorityB - priorityA || b.createdAt - a.createdAt;
      })
      .slice(0, 10);

    return { message: "AI-prioritized top notifications", prioritized };
  },

  await ctx.db.notifications.insert({
  userId: bid.investorId,
  message: `Your investment in ${campaign.title} has been credited with profit.`,
  type: "commission",
  read: false,
  createdAt: Date.now(),
});

if (bid.affiliateId && campaign.affiliateRewardAmount) {
  await ctx.db.notifications.insert({
    userId: bid.affiliateId,
    message: `You earned a reward for referring an investor to ${campaign.title}.`,
    type: "commission",
    read: false,
    createdAt: Date.now(),
  });
}

for (const recommendedId of recommendedIds) {
  await ctx.db.notifications.insert({
    userId: recommendedId, // assuming recommended campaign owner / user
    message: `AI recommends your campaign for high-impact climate action.`,
    type: "ai_recommendation",
    read: false,
    createdAt: Date.now(),
  });
}

});


// FILE: /convex/users.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * User profile management: create, update, fetch
 */

export const createUserProfile = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal("innovator"), v.literal("investor"), v.literal("institution"), v.literal("admin")),
    fullName: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
  },
  handler: async (ctx, { userId, role, fullName, email, phone }) => {
    return await ctx.db.insert("userProfiles", {
      userId,
      role,
      personalInfo: { fullName, email, phone },
      verified: false,
      aiCredits: 0,
      balance: 0,
      createdAt: Date.now(),
    });
  },
});

export const getUserProfile = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get("userProfiles", userId);
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),
    personalInfo: v.optional(
      v.object({
        fullName: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
      })
    ),
    role: v.optional(v.union(v.literal("innovator"), v.literal("investor"), v.literal("institution"), v.literal("admin"))),
  },
  handler: async (ctx, { userId, personalInfo, role }) => {
    const updateData: any = {};
    if (personalInfo) updateData.personalInfo = personalInfo;
    if (role) updateData.role = role;

    return await ctx.db.update("userProfiles", userId, updateData);
  },
});

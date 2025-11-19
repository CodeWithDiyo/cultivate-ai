import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define reusable types to reduce complexity
const userRole = v.union(
  v.literal("innovator"),
  v.literal("investor"), 
  v.literal("grantmaker"),
  v.literal("admin"),
  v.literal("public")
);

// Define the exact role type for TypeScript
type UserRole = "innovator" | "investor" | "grantmaker" | "admin" | "public";

/**
 * User profile management: create, update, fetch
 */
export const createUserProfile = mutation({
  args: {
    clerkId: v.string(),
    role: userRole,
    fullName: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    country: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, role, fullName, email, avatarUrl, country, bio } = args;
    
    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existing) return existing;

    const newUser = await ctx.db.insert("userProfiles", {
      clerkId,
      fullName,
      email,
      role,
      avatarUrl: avatarUrl ?? undefined,
      country: country ?? undefined,
      bio: bio ?? undefined,
      createdAt: Date.now(),
    });

    return newUser;
  },
});

/**
 * Get user profile by Clerk ID
 */
export const getUserProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("userProfiles")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();
  },
});

/**
 * Update user profile (partial)
 */
export const updateUserProfile = mutation({
  args: {
    clerkId: v.string(),
    fullName: v.optional(v.string()),
    email: v.optional(v.string()),
    role: v.optional(userRole),
    avatarUrl: v.optional(v.string()),
    country: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { clerkId, fullName, email, role, avatarUrl, country, bio } = args;
    
    const user = await ctx.db
      .query("userProfiles")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) throw new Error("User not found");

    // Define proper type for updateData with exact role type
    const updateData: {
      fullName?: string;
      email?: string;
      role?: UserRole;
      avatarUrl?: string;
      country?: string;
      bio?: string;
    } = {};

    if (fullName !== undefined) updateData.fullName = fullName;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (country !== undefined) updateData.country = country;
    if (bio !== undefined) updateData.bio = bio;

    await ctx.db.patch(user._id, updateData);

    return { success: true, updated: updateData };
  },
});

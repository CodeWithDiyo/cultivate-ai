"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function signOutAction() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: "No active session" };
    }

    // Instead of manually revoking sessions, we'll redirect to Clerk's sign-out
    // This is more reliable and follows Clerk's recommended approach
    redirect("/sign-out");
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

// FILE: convex/server.ts
import { ConvexHttpClient } from "convex/browser";
import { api } from "./_generated/api";

export function getConvexServer() {
  if (!process.env.CONVEX_URL) {
    throw new Error("Missing CONVEX_URL environment variable");
  }

  return new ConvexHttpClient(process.env.CONVEX_URL);
}

export { api };

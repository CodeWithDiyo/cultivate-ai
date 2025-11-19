// hooks/useConvexMutation.ts
import { useMutation } from "convex/react";
import type { FunctionReference } from "convex/server";

// Fixed version with proper typing
export function useConvexMutation(mutation: FunctionReference<"mutation">) {
  return useMutation(mutation);
}

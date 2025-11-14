// /lib/agentkit.ts
import OpenAI from "openai";

/**
 * Create OpenAI client lazily (Convex-safe)
 */
export function getOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  });
}

/**
 * Task names allowed
 */
export type AgentTaskName =
  | "recommend_campaigns"
  | "campaign_solution_plan"
  | "grant_innovator_matching"
  | "evaluate_solution";

/**
 * Flexible context type
 */
export type AgentTaskContext = Record<string, unknown>;

/**
 * Output type
 */
export type AgentTaskOutput =
  | string
  | Record<string, unknown>
  | unknown[]
  | null;

/**
 * Input structure
 */
export interface RunAgentTaskInput {
  userId: string;
  taskName: AgentTaskName;
  context?: AgentTaskContext;
}

/**
 * Generic AI task runner
 */
export async function runAgentTask({
  userId,
  taskName,
  context = {},
}: RunAgentTaskInput): Promise<AgentTaskOutput> {
  try {
    const openai = getOpenAI(); // SAFE

    // Build dynamic prompt
    const prompt = `Task: ${taskName}
User: ${userId}
Context: ${JSON.stringify(context)}
Respond in JSON if possible.`;

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const output = response.choices?.[0]?.message?.content ?? "";

    try {
      return JSON.parse(output);
    } catch {
      return output.trim() || null;
    }
  } catch (err) {
    console.error("runAgentTask error:", err);
    return null;
  }
}

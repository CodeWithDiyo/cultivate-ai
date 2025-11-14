// /lib/agentkit.ts
import OpenAI from "openai";

/**
 * ✅ Initialize OpenAI client
 */
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * AgentKit Task Names
 */
export type AgentTaskName =
  | "recommend_campaigns"
  | "campaign_solution_plan"
  | "grant_innovator_matching"
  | "evaluate_solution"
  | string; // allow future custom tasks

/**
 * Context for tasks
 */
export type AgentTaskContext = Record<string, any>;

/**
 * Standardized AI output type
 */
export type AgentTaskOutput = string | Record<string, any> | any[] | null;

/**
 * Input for runAgentTask
 */
export interface RunAgentTaskInput {
  userId: string;
  taskName: AgentTaskName;
  context?: AgentTaskContext;
}

/**
 * runAgentTask
 * ----------------
 * Executes an AgentKit/OpenAI AI task with type safety
 */
export async function runAgentTask({
  userId,
  taskName,
  context,
}: RunAgentTaskInput): Promise<AgentTaskOutput> {
  try {
    // Build task-specific prompt
    let prompt: string = "";
    switch (taskName) {
      case "recommend_campaigns":
        prompt = `User ${userId}: Recommend top climate campaigns based on context: ${JSON.stringify(
          context
        )}`;
        break;

      case "campaign_solution_plan":
        prompt = `User ${userId}: Generate step-by-step climate solution plan for campaign: ${JSON.stringify(
          context
        )}`;
        break;

      case "grant_innovator_matching":
        prompt = `User ${userId}: Recommend innovators for grants based on context: ${JSON.stringify(
          context
        )}`;
        break;

      case "evaluate_solution":
        prompt = `User ${userId}: Evaluate innovator's solution: ${JSON.stringify(
          context
        )}`;
        break;

      default:
        prompt = `User ${userId}: Provide AI output for task ${taskName} with context: ${JSON.stringify(
          context
        )}`;
        break;
    }

    // Call OpenAI chat completion
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const text: string = response.choices?.[0]?.message?.content ?? "";

    // Attempt to parse JSON output, fallback to string
    try {
      return JSON.parse(text);
    } catch {
      return text || null;
    }
  } catch (err) {
    console.error("runAgentTask error:", err);
    return null;
  }
}

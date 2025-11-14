import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Type definitions
interface Campaign {
  title: string;
}

interface RequestBody {
  query: string;
  campaigns?: Campaign[];
  userId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { query, campaigns, userId } = req.body as RequestBody;

    if (!query || !userId) {
      return res
        .status(400)
        .json({ error: "Missing required fields: query, userId" });
    }

    const context = campaigns && campaigns.length > 0
      ? `Current active campaigns: ${campaigns
          .map((c) => c.title)
          .join(", ")}.`
      : "No campaigns currently available.";

    const prompt = `
You are Cultivate AI, an environmental agent specialized in analyzing and recommending climate and sustainability solutions.

User: ${userId}
${context}

Question: ${query}

Provide actionable insights and recommendations.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.7,
    });

    return res
      .status(200)
      .json({ output: response.choices[0]?.message?.content ?? "" });
  } catch (error) {
    console.error("AgentKit AI error:", error);
    return res.status(500).json({ error: "Failed to generate AI response" });
  }
}

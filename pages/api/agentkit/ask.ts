import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { query, campaigns, userId } = req.body;

    const context = campaigns
      ? `Current active campaigns: ${campaigns.map((c: any) => c.title).join(", ")}.`
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

    res.status(200).json({ output: response.choices[0].message.content });
  } catch (error) {
    console.error("AgentKit AI error:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
}

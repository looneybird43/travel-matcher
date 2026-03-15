import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      messages: [{ role: "user", content: prompt }],
    });
    const text = message.content.map((c) => c.text || "").join("").trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const trips = JSON.parse(clean);
    return Response.json({ trips });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

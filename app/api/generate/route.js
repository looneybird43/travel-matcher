import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchUnsplashImage(query) {
  try {
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) return null;
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${key}` } }
    );
    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch {
    return null;
  }
}

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

    // Fetch images in parallel for all trips
    const tripsWithImages = await Promise.all(
      trips.map(async (trip) => {
        const imageUrl = await fetchUnsplashImage(`${trip.destination} ${trip.country} landscape`);
        return { ...trip, imageUrl };
      })
    );

    return Response.json({ trips: tripsWithImages });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

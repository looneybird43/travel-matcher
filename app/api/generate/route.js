import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function fetchUnsplashImage(destination, country, activityChips) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  // Use activity/vibe terms for better results — specific place names often return bad matches
  const activity = activityChips?.[0]?.toLowerCase() || "";
  const vibeMap = {
    snorkel: "coral reef underwater ocean",
    swim: "tropical ocean swimming cove",
    reef: "coral reef turquoise water",
    cave: "cave waterfall jungle",
    cenote: "cenote crystal water jungle",
    trek: "mountain trail hiking landscape",
    hike: "mountain hiking scenic trail",
    jungle: "jungle tropical rainforest",
    surf: "surfing waves ocean beach",
    dive: "underwater scuba diving reef",
    cycle: "coastal road cycling scenic",
    bike: "mountain biking trail scenic",
    kayak: "kayaking tropical bay",
    volcano: "volcanic landscape crater",
    island: "tropical island aerial ocean",
    wildlife: "wildlife nature safari",
    market: "local market colorful travel",
  };
  const vibe = Object.entries(vibeMap).find(([k]) => activity.includes(k))?.[1] || "";

  const queries = [
    vibe || `${country} nature landscape travel`,
    `${country} travel scenic`,
    "tropical travel adventure landscape",
  ];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${key}` } }
      );
      const data = await res.json();
      // Pick a random one from top 5 for variety
      const results = data.results || [];
      if (results.length > 0) {
        const pick = results[Math.floor(Math.random() * Math.min(results.length, 3))];
        return pick?.urls?.regular || null;
      }
    } catch { continue; }
  }
  return null;
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
        const imageUrl = await fetchUnsplashImage(trip.destination, trip.country, trip.activityChips);
        return { ...trip, imageUrl };
      })
    );

    return Response.json({ trips: tripsWithImages });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const vibeMap = {
  snorkel: "coral reef ocean snorkeling",
  reef: "coral reef turquoise water",
  cave: "cave waterfall pool nature",
  cenote: "cenote crystal blue water",
  trek: "mountain trail hiking scenic",
  hike: "mountain hiking trail landscape",
  surf: "surfing waves ocean beach",
  dive: "scuba diving ocean reef",
  cycle: "coastal cycling road scenic",
  bike: "mountain biking trail",
  kayak: "kayaking bay water",
  volcano: "volcanic crater landscape",
  island: "tropical island beach aerial",
  wildlife: "wildlife nature animals",
  swim: "swimming cove ocean beach",
  lake: "alpine lake mountain reflection",
  market: "local market colorful street food",
  jungle: "jungle rainforest waterfall",
};

async function fetchUnsplashImage(destination, country, activityChips, usedUrls) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  const activity = (activityChips?.[0] || "").toLowerCase();
  const vibeTerm = Object.entries(vibeMap).find(([k]) => activity.includes(k))?.[1] || "";

  // Priority: specific destination → country + vibe → vibe only → generic
  const queries = [
    `${destination} ${country}`,
    `${country} ${vibeTerm || "landscape travel"}`,
    vibeTerm || "travel landscape nature",
    "scenic travel nature landscape",
  ];

  for (const query of queries) {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=15&orientation=landscape`,
        { headers: { Authorization: `Client-ID ${key}` } }
      );
      const data = await res.json();
      const results = (data.results || []).filter(r => r?.urls?.regular && !usedUrls.has(r.urls.regular));
      if (results.length > 0) {
        const pick = results[0];
        usedUrls.add(pick.urls.regular);
        return pick.urls.regular;
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

    // Fetch images sequentially so we can track used URLs and avoid repeats
    const usedUrls = new Set();
    const tripsWithImages = [];
    for (const trip of trips) {
      const imageUrl = await fetchUnsplashImage(trip.destination, trip.country, trip.activityChips, usedUrls);
      tripsWithImages.push({ ...trip, imageUrl });
    }

    return Response.json({ trips: tripsWithImages });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

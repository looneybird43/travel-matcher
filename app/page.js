"use client";
import { useState, useCallback } from "react";

function bookingLink(destination) {
  const q = encodeURIComponent(destination);
  return `https://www.booking.com/search.html?ss=${q}&aid=YOUR_BOOKING_AID`;
}
function getyourguideLink(destination) {
  const q = encodeURIComponent(destination);
  return `https://www.getyourguide.com/s/?q=${q}&partner_id=YOUR_GYG_ID`;
}
function viatorLink(destination) {
  const q = encodeURIComponent(destination);
  return `https://www.viator.com/searchResults/all?text=${q}&mcid=YOUR_VIATOR_MCID`;
}
function skyscannerLink(destination) {
  const q = encodeURIComponent(destination);
  return `https://www.skyscanner.com/transport/flights/anywhere/${q}/?associateid=YOUR_SKYSCANNER_ID`;
}

const STEPS = [
  { id: "experiences", title: "Experiences", subtitle: "Rank what matters most to you" },
  { id: "accommodation", title: "Where You Sleep", subtitle: "What's your ideal base?" },
  { id: "food", title: "Food Culture", subtitle: "How do you eat when you travel?" },
  { id: "budget", title: "Budget & Duration", subtitle: "Practical parameters" },
  { id: "remote", title: "Remote Work", subtitle: "How connected do you need to be?" },
  { id: "vibe", title: "Vibe & Context", subtitle: "The intangibles" },
];

const EXPERIENCE_OPTIONS = [
  { id: "swimming", label: "Open water swimming", icon: "🏊" },
  { id: "snorkeling", label: "Snorkeling & reefs", icon: "🤿" },
  { id: "hiking", label: "Hiking & trekking", icon: "🥾" },
  { id: "biking", label: "Biking & cycling", icon: "🚴" },
  { id: "caving", label: "Caving & cenotes", icon: "🦇" },
  { id: "cliff", label: "Cliff jumping", icon: "🪂" },
  { id: "culture", label: "Local culture & history", icon: "🏛️" },
  { id: "food_exp", label: "Food & market immersion", icon: "🫙" },
  { id: "wildlife", label: "Wildlife & birding", icon: "🦜" },
  { id: "surf", label: "Surfing & water sports", icon: "🏄" },
  { id: "yoga", label: "Yoga & wellness", icon: "🧘" },
  { id: "nightlife", label: "Nightlife & social scene", icon: "🌙" },
];
const ACCOMMODATION_OPTIONS = [
  { id: "beach_shack", label: "Beach shack / hammock vibes", icon: "🛖" },
  { id: "eco_lodge", label: "Eco-lodge in nature", icon: "🌿" },
  { id: "boutique", label: "Boutique hotel", icon: "🏨" },
  { id: "full_home", label: "Full home / villa rental", icon: "🏡" },
  { id: "hostel", label: "Social hostel / guesthouse", icon: "🛏️" },
  { id: "luxury", label: "Luxury resort", icon: "✨" },
];
const FOOD_OPTIONS = [
  { id: "street", label: "Street food & local spots only", icon: "🌮" },
  { id: "markets", label: "Markets & self-cooking", icon: "🧺" },
  { id: "mix", label: "Mix of local & sit-down", icon: "🍽️" },
  { id: "fine", label: "Notable restaurants & wine", icon: "🍷" },
  { id: "vegetarian", label: "Vegetarian / plant-based", icon: "🥦" },
  { id: "seafood", label: "Seafood-forward", icon: "🦞" },
];
const VIBE_OPTIONS = [
  { id: "solo", label: "Solo trip", icon: "🧍" },
  { id: "partner", label: "With a partner", icon: "👫" },
  { id: "friends", label: "Small group of friends", icon: "👯" },
  { id: "family", label: "Family with kids", icon: "👨‍👩‍👧" },
];
const AVOID_OPTIONS = [
  { id: "crowds", label: "Crowds & tourists" },
  { id: "cruise", label: "Cruise ship ports" },
  { id: "chains", label: "Hotel chains & franchises" },
  { id: "cold", label: "Cold weather" },
  { id: "heat", label: "Extreme heat" },
  { id: "long_flight", label: "Flights over 12 hours" },
  { id: "malaria", label: "Malaria zones" },
  { id: "visa", label: "Complex visa requirements" },
];

function RankList({ items, ranked, onToggle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {items.map((item) => {
        const rank = ranked.indexOf(item.id);
        const selected = rank !== -1;
        return (
          <button key={item.id} onClick={() => onToggle(item.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: selected ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: selected ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s", textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>{item.icon}</span>
            <span style={{ flex: 1, color: selected ? "#f0dfc0" : "#9a8878", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{item.label}</span>
            {selected && <span style={{ background: "#d4a373", color: "#1a110a", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{rank + 1}</span>}
          </button>
        );
      })}
    </div>
  );
}

function SingleSelect({ options, value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
      {options.map((opt) => (
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{ padding: "14px 12px", background: value === opt.id ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: value === opt.id ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer", color: value === opt.id ? "#f0dfc0" : "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", transition: "all 0.2s" }}>
          <span style={{ fontSize: "22px" }}>{opt.icon}</span>{opt.label}
        </button>
      ))}
    </div>
  );
}

function MultiSelect({ options, value, onChange }) {
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {options.map((opt) => {
        const sel = value.includes(opt.id);
        return <button key={opt.id} onClick={() => toggle(opt.id)} style={{ padding: "8px 14px", background: sel ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: sel ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", cursor: "pointer", color: sel ? "#f0dfc0" : "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif", transition: "all 0.2s" }}>{opt.label}</button>;
      })}
    </div>
  );
}

function SliderField({ label, value, onChange, min, max, format }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ color: "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{label}</span>
        <span style={{ color: "#d4a373", fontSize: "13px", fontWeight: "600" }}>{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: "100%", accentColor: "#d4a373" }} />
    </div>
  );
}

function ContactForm({ destination, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const submit = async () => {
    if (!form.name || !form.email) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, destination }) });
      setStatus(res.ok ? "sent" : "error");
    } catch { setStatus("error"); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ background: "#1a110a", border: "1px solid rgba(212,163,115,0.3)", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "440px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "#9a8878", fontSize: "22px", cursor: "pointer", lineHeight: 1 }}>×</button>
        {status === "sent" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>✉️</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", color: "#f0dfc0", marginBottom: "8px" }}>Message sent!</div>
            <div style={{ color: "#9a8878", fontSize: "14px", lineHeight: "1.6" }}>I'll be in touch within 48 hours to start planning your trip to {destination}.</div>
            <button onClick={onClose} style={{ marginTop: "24px", padding: "12px 28px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontFamily: "'Crimson Pro', Georgia, serif" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#d4a373", textTransform: "uppercase", marginBottom: "8px" }}>Custom Itinerary</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", color: "#f0dfc0", marginBottom: "6px", fontWeight: "400" }}>Plan my trip to {destination}</h3>
            <p style={{ color: "#9a8878", fontSize: "13px", lineHeight: "1.6", marginBottom: "24px" }}>Get a fully researched, personalized itinerary built around your exact preferences. Typical turnaround: 48 hours.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[["text", "Your name *", "name"], ["email", "Email address *", "email"]].map(([type, ph, field]) => (
                <input key={field} type={type} placeholder={ph} value={form[field]} onChange={e => setForm(p => ({ ...p, [field]: e.target.value }))} style={{ padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif" }} />
              ))}
              <textarea placeholder="Travel dates, group size, budget, special requests…" value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={3} style={{ padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", resize: "vertical" }} />
            </div>
            {status === "error" && <div style={{ color: "#f0a0a0", fontSize: "13px", marginTop: "10px" }}>Something went wrong. Please try again.</div>}
            <button onClick={submit} disabled={status === "sending" || !form.name || !form.email} style={{ marginTop: "20px", width: "100%", padding: "14px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif", opacity: (!form.name || !form.email) ? 0.5 : 1 }}>
              {status === "sending" ? "Sending…" : "Send my request →"}
            </button>
            <p style={{ color: "#6a5848", fontSize: "11px", textAlign: "center", marginTop: "10px" }}>No spam. No obligations. Just good travel planning.</p>
          </>
        )}
      </div>
    </div>
  );
}

function TripCard({ trip, index, accentColor }) {
  const [expanded, setExpanded] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const intlColors = ["#d4a373", "#8ecfc9", "#c9b8a8"];
  const nearColors = ["#a8c5a0", "#b8a9c9", "#c9a8a8"];
  const color = accentColor || (index < 3 ? intlColors[index % 3] : nearColors[index % 3]);
  const btn = { padding: "9px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "700", fontFamily: "'Crimson Pro', Georgia, serif", textDecoration: "none", display: "inline-block" };

  return (
    <>
      {showContact && <ContactForm destination={trip.destination} onClose={() => setShowContact(false)} />}
      <div style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${color}40`, borderRadius: "14px", overflow: "hidden", marginBottom: "16px" }}>
        <div onClick={() => setExpanded(!expanded)} style={{ padding: "20px", cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `${color}20`, border: `1px solid ${color}60`, display: "flex", alignItems: "center", justifyContent: "center", color, fontWeight: "700", fontSize: "16px", flexShrink: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>{index + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color, fontSize: "11px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "4px" }}>{trip.country}</div>
            <div style={{ color: "#f0dfc0", fontSize: "20px", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "6px" }}>{trip.destination}</div>
            <div style={{ color: "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif", lineHeight: "1.5" }}>{trip.tagline}</div>
          </div>
          <span style={{ color: "#9a8878", fontSize: "18px", marginTop: "4px" }}>{expanded ? "↑" : "↓"}</span>
        </div>
        {expanded && (
          <div style={{ padding: "0 20px 24px", borderTop: `1px solid ${color}20` }}>
            <div style={{ paddingTop: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              {[["Why You'd Love It", trip.why], ["Key Activities", trip.activities], ["Where to Stay", trip.stay], ["Food Scene", trip.food], ["Logistics", trip.logistics]].map(([label, content]) => content && (
                <div key={label}>
                  <div style={{ color, fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
                  <div style={{ color: "#c4b5a5", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", lineHeight: "1.7" }}>{content}</div>
                </div>
              ))}
              {trip.surprise && (
                <div style={{ background: `${color}10`, border: `1px solid ${color}30`, borderRadius: "8px", padding: "12px" }}>
                  <div style={{ color, fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "6px" }}>The Surprise Factor</div>
                  <div style={{ color: "#c4b5a5", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", lineHeight: "1.7" }}>{trip.surprise}</div>
                </div>
              )}
              <div>
                <div style={{ color, fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "10px" }}>Book This Trip</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <a href={bookingLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "rgba(0,115,230,0.15)", border: "1px solid rgba(0,115,230,0.4)", color: "#7ab8f5" }}>🏨 Hotels</a>
                  <a href={skyscannerLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "rgba(0,180,120,0.12)", border: "1px solid rgba(0,180,120,0.35)", color: "#6dcfaa" }}>✈️ Flights</a>
                  <a href={getyourguideLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "rgba(255,160,0,0.12)", border: "1px solid rgba(255,160,0,0.35)", color: "#f5c542" }}>🗺️ Tours</a>
                  <a href={viatorLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "rgba(200,80,80,0.12)", border: "1px solid rgba(200,80,80,0.35)", color: "#f5a0a0" }}>🎟️ Experiences</a>
                </div>
              </div>
              <div style={{ background: `${color}08`, border: `1px solid ${color}25`, borderRadius: "10px", padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ color: "#f0dfc0", fontSize: "14px", fontFamily: "'Playfair Display', Georgia, serif", marginBottom: "3px" }}>Want this trip fully planned?</div>
                  <div style={{ color: "#9a8878", fontSize: "12px" }}>Custom day-by-day itinerary built for you</div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setShowContact(true); }} style={{ ...btn, background: color, color: "#1a110a", border: "none", padding: "10px 18px", whiteSpace: "nowrap" }}>Plan my trip →</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Section divider between international and nearby ─────────────────────────
function SectionDivider({ label, sublabel }) {
  return (
    <div style={{ margin: "36px 0 24px", textAlign: "center", position: "relative" }}>
      <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "relative", display: "inline-block", background: "#0e0a07", padding: "0 16px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#a8c5a0", textTransform: "uppercase", marginBottom: "4px" }}>{label}</div>
        <div style={{ color: "#6a5848", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{sublabel}</div>
      </div>
    </div>
  );
}

const defaultAnswers = { topExperiences: [], accommodation: "", mustHaves: [], food: "", foodAvoid: [], budgetNightly: 150, tripDays: 10, departure: "US East Coast", timeZonePref: "no_pref", remoteWork: "no", wfhNeeds: [], travelWith: "", avoid: [], season: "any", flightTolerance: "medium", openTo: [], extra: "" };

export default function TravelMatcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [nearbyResults, setNearbyResults] = useState(null);
  const [error, setError] = useState(null);

  const currentStep = STEPS[step - 1];
  const update = useCallback((field, value) => setAnswers((prev) => ({ ...prev, [field]: value })), []);
  const toggleRank = useCallback((field, id) => {
    setAnswers((prev) => {
      const list = prev[field];
      if (list.includes(id)) return { ...prev, [field]: list.filter((x) => x !== id) };
      if (list.length >= 5) return prev;
      return { ...prev, [field]: [...list, id] };
    });
  }, []);

  const buildProfile = () => {
    const topExp = answers.topExperiences.map((id) => EXPERIENCE_OPTIONS.find((o) => o.id === id)?.label).filter(Boolean).join(", ");
    const accom = ACCOMMODATION_OPTIONS.find((o) => o.id === answers.accommodation)?.label || "";
    const foodStyle = FOOD_OPTIONS.find((o) => o.id === answers.food)?.label || "";
    const avoidList = answers.avoid.map((id) => AVOID_OPTIONS.find((o) => o.id === id)?.label).filter(Boolean).join(", ");
    return `- Top experiences: ${topExp || "not specified"}
- Accommodation: ${accom}
- Food: ${foodStyle}
- Nightly budget: $${answers.budgetNightly}
- Trip length: ${answers.tripDays} days
- Departing from: ${answers.departure}
- Flight tolerance: ${answers.flightTolerance}
- Traveling: ${VIBE_OPTIONS.find((o) => o.id === answers.travelWith)?.label || "unspecified"}
- Remote work: ${answers.remoteWork}
- Time zone: ${answers.timeZonePref}
- Season: ${answers.season}
- Avoiding: ${avoidList || "nothing specific"}
- Notes: ${answers.extra || "none"}`;
  };

  const buildIntlPrompt = () => `You are an expert travel matchmaker. Based on this traveler profile, suggest exactly 3 off-the-beaten-path INTERNATIONAL destinations (outside the US) they would not typically think of.

TRAVELER PROFILE:
${buildProfile()}

RULES: Be specific (city/region not country). Prioritize unknown places. Diverse continents. Honest logistics.

Respond ONLY with a JSON array of 3 objects, no markdown:
{"destination":"place","country":"country","tagline":"one evocative sentence","why":"why it fits their profile","activities":"what to do there","stay":"where to stay","food":"food scene","logistics":"practical notes on flights/visa/timing","surprise":"the one thing that will genuinely surprise them"}`;

  const buildNearbyPrompt = (intlTrips) => `You are an expert travel matchmaker. A traveler got these 3 international trip recommendations:
${intlTrips.map(t => `- ${t.destination}, ${t.country} (${t.tagline})`).join('\n')}

Based on their profile AND those international picks, suggest 3 US-based or nearby (Canada, Caribbean, Mexico, or Central America — max 4 hour flight from US) alternatives that capture a SIMILAR vibe to each international pick but are more accessible.

TRAVELER PROFILE:
${buildProfile()}

RULES:
1. Each nearby pick should feel like a spiritual cousin to one of the international picks
2. Include a "vibeMatch" field naming which international destination it mirrors and why
3. Must be genuinely underrated — not Times Square or Miami Beach
4. Be specific (city/region/park, not just "the Caribbean")

Respond ONLY with a JSON array of 3 objects, no markdown:
{"destination":"place","country":"US or nearby country","tagline":"one evocative sentence","vibeMatch":"mirrors [international destination] because...","why":"why it fits their profile","activities":"what to do there","stay":"where to stay","food":"food scene","logistics":"practical notes","surprise":"the one thing that will genuinely surprise them"}`;

  const generateTrips = async () => {
    setLoading(true);
    setError(null);
    setNearbyResults(null);
    try {
      // Run international prompt first
      const intlRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildIntlPrompt() }),
      });
      const intlData = await intlRes.json();
      if (intlData.error) throw new Error(intlData.error);
      setResults(intlData.trips);
      setStep(STEPS.length + 1);

      // Then run nearby prompt using intl results as context
      const nearbyRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: buildNearbyPrompt(intlData.trips) }),
      });
      const nearbyData = await nearbyRes.json();
      if (!nearbyData.error) setNearbyResults(nearbyData.trips);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const cs = { minHeight: "100vh", background: "#0e0a07", color: "#f0dfc0", fontFamily: "'Crimson Pro', Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 60px" };
  const card = { width: "100%", maxWidth: "540px", marginTop: "40px" };
  const isLast = step === STEPS.length;

  if (step === 0) return (
    <div style={cs}>
      <div style={{ ...card, textAlign: "center", paddingTop: "60px" }}>
        <div style={{ fontSize: "13px", letterSpacing: "4px", color: "#d4a373", textTransform: "uppercase", marginBottom: "24px" }}>Travel Matchmaker</div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px,6vw,48px)", fontWeight: "400", lineHeight: "1.2", marginBottom: "20px", color: "#f0dfc0" }}>Where should<br /><em>you</em> go next?</h1>
        <p style={{ color: "#9a8878", fontSize: "16px", lineHeight: "1.7", maxWidth: "380px", margin: "0 auto 40px" }}>Answer 6 short questions. Get 3 global trip ideas you'd never have found — plus 3 closer-to-home options with the same vibe.</p>
        <button onClick={() => setStep(1)} style={{ padding: "16px 40px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", fontFamily: "'Crimson Pro', Georgia, serif" }}>Begin →</button>
      </div>
    </div>
  );

  if (loading) return (
    <div style={{ ...cs, justifyContent: "center", alignItems: "center" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "20px", animation: "spin 2s linear infinite", display: "inline-block" }}>🧭</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", color: "#f0dfc0", marginBottom: "8px" }}>Finding your places…</div>
        <div style={{ color: "#9a8878", fontSize: "14px" }}>Searching the world for your matches</div>
      </div>
    </div>
  );

  if (step === STEPS.length + 1) return (
    <div style={cs}>
      <div style={card}>
        {/* ── International section ── */}
        <div style={{ textAlign: "center", paddingTop: "40px", marginBottom: "32px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#d4a373", textTransform: "uppercase", marginBottom: "12px" }}>Go Far</div>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: "400", color: "#f0dfc0", marginBottom: "8px" }}>3 International Trips</h2>
          <p style={{ color: "#9a8878", fontSize: "14px" }}>Off the map. Matched to you. Tap to explore.</p>
        </div>
        {results?.map((trip, i) => <TripCard key={`intl-${i}`} trip={trip} index={i} />)}

        {/* ── Closer to home section ── */}
        <SectionDivider label="Stay Closer" sublabel="Same vibe, shorter journey" />

        {nearbyResults ? (
          <>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "24px", fontWeight: "400", color: "#f0dfc0", marginBottom: "6px" }}>3 Closer-to-Home Options</h2>
              <p style={{ color: "#9a8878", fontSize: "13px" }}>US & nearby — same energy, no passport line</p>
            </div>
            {nearbyResults.map((trip, i) => (
              <div key={`nearby-${i}`}>
                {trip.vibeMatch && (
                  <div style={{ fontSize: "11px", color: "#a8c5a0", letterSpacing: "1px", marginBottom: "6px", paddingLeft: "4px" }}>
                    ↳ {trip.vibeMatch}
                  </div>
                )}
                <TripCard trip={trip} index={i} accentColor={["#a8c5a0", "#b8a9c9", "#c9a8a8"][i % 3]} />
              </div>
            ))}
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <style>{`@keyframes spin2{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
            <div style={{ width: "24px", height: "24px", border: "2px solid rgba(168,197,160,0.2)", borderTopColor: "#a8c5a0", borderRadius: "50%", animation: "spin2 0.8s linear infinite", margin: "0 auto 12px" }} />
            <div style={{ color: "#6a5848", fontSize: "13px" }}>Finding closer options…</div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button onClick={() => { setStep(0); setResults(null); setNearbyResults(null); setAnswers(defaultAnswers); }} style={{ background: "transparent", border: "1px solid #3a2a1a", color: "#9a8878", padding: "12px 28px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>Start Over</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={cs}>
      <div style={card}>
        <div style={{ marginBottom: "32px", paddingTop: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#d4a373", textTransform: "uppercase" }}>{currentStep.title}</span>
            <span style={{ fontSize: "12px", color: "#6a5848" }}>{step} / {STEPS.length}</span>
          </div>
          <div style={{ height: "2px", background: "#1a1008", borderRadius: "2px" }}><div style={{ height: "100%", width: `${(step / STEPS.length) * 100}%`, background: "#d4a373", borderRadius: "2px", transition: "width 0.4s ease" }} /></div>
          <div style={{ color: "#6a5848", fontSize: "13px", marginTop: "6px" }}>{currentStep.subtitle}</div>
        </div>

        {step === 1 && <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Select up to 5, in order of priority.</p><RankList items={EXPERIENCE_OPTIONS} ranked={answers.topExperiences} onToggle={(id) => toggleRank("topExperiences", id)} /></div>}
        {step === 2 && <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Pick your ideal vibe.</p><SingleSelect options={ACCOMMODATION_OPTIONS} value={answers.accommodation} onChange={(v) => update("accommodation", v)} /><div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "12px" }}>Non-negotiables:</p><MultiSelect options={[{ id: "view", label: "Incredible view" }, { id: "pool", label: "Pool" }, { id: "ac", label: "Air conditioning" }, { id: "coffee", label: "Good coffee" }, { id: "kitchen", label: "Kitchen access" }, { id: "wifi", label: "Reliable WiFi" }, { id: "spa", label: "Spa or sauna" }, { id: "private_beach", label: "Private beach" }]} value={answers.mustHaves} onChange={(v) => update("mustHaves", v)} /></div></div>}
        {step === 3 && <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>How do you eat when you travel?</p><SingleSelect options={FOOD_OPTIONS} value={answers.food} onChange={(v) => update("food", v)} /><div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "12px" }}>Dietary restrictions?</p><MultiSelect options={[{ id: "no_gluten", label: "Gluten-free" }, { id: "no_dairy", label: "Dairy-free" }, { id: "halal", label: "Halal" }, { id: "no_spicy", label: "Avoid spicy" }, { id: "no_alcohol", label: "No alcohol" }, { id: "vegan", label: "Vegan" }]} value={answers.foodAvoid} onChange={(v) => update("foodAvoid", v)} /></div></div>}
        {step === 4 && <div>
          <SliderField label="Lodging budget per night" value={answers.budgetNightly} onChange={(v) => update("budgetNightly", v)} min={20} max={600} format={(v) => `$${v}/night`} />
          <SliderField label="Trip length" value={answers.tripDays} onChange={(v) => update("tripDays", v)} min={3} max={30} format={(v) => `${v} days`} />
          <div style={{ marginBottom: "20px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Departing from</p><div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{["US East Coast", "US West Coast", "US Midwest", "Europe", "Latin America", "Other"].map((loc) => <button key={loc} onClick={() => update("departure", loc)} style={{ padding: "8px 14px", background: answers.departure === loc ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: answers.departure === loc ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", cursor: "pointer", color: answers.departure === loc ? "#f0dfc0" : "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{loc}</button>)}</div></div>
          <div style={{ marginBottom: "20px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Flight tolerance</p><div style={{ display: "flex", gap: "8px" }}>{[["short", "Under 6h"], ["medium", "Up to 12h"], ["long", "Anywhere"]].map(([id, label]) => <button key={id} onClick={() => update("flightTolerance", id)} style={{ flex: 1, padding: "10px", background: answers.flightTolerance === id ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: answers.flightTolerance === id ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", cursor: "pointer", color: answers.flightTolerance === id ? "#f0dfc0" : "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{label}</button>)}</div></div>
          <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Best season</p><MultiSelect options={[{ id: "jan_mar", label: "Jan–Mar" }, { id: "apr_jun", label: "Apr–Jun" }, { id: "jul_sep", label: "Jul–Sep" }, { id: "oct_dec", label: "Oct–Dec" }, { id: "any", label: "Flexible" }]} value={answers.season === "any" ? ["any"] : Array.isArray(answers.season) ? answers.season : [answers.season]} onChange={(v) => update("season", v)} /></div>
        </div>}
        {step === 5 && <div>
          <p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Do you need to work remotely?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>{[["no", "🏖️ Fully offline"], ["partial", "📱 Occasional check-ins"], ["yes", "💻 Full remote — daily calls"]].map(([id, label]) => <button key={id} onClick={() => update("remoteWork", id)} style={{ padding: "14px 16px", background: answers.remoteWork === id ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: answers.remoteWork === id ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer", color: answers.remoteWork === id ? "#f0dfc0" : "#9a8878", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", textAlign: "left" }}>{label}</button>)}</div>
          <p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Time zone preference</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{[["no_pref", "No preference"], ["close", "Stay close (±3 hrs)"], ["medium", "Moderate shift (±6 hrs)"], ["anywhere", "Fully flexible"]].map(([id, label]) => <button key={id} onClick={() => update("timeZonePref", id)} style={{ padding: "12px 16px", background: answers.timeZonePref === id ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: answers.timeZonePref === id ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer", color: answers.timeZonePref === id ? "#f0dfc0" : "#9a8878", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", textAlign: "left" }}>{label}</button>)}</div>
        </div>}
        {step === 6 && <div>
          <p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Traveling with…</p>
          <SingleSelect options={VIBE_OPTIONS} value={answers.travelWith} onChange={(v) => update("travelWith", v)} />
          <div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Actively avoid:</p><MultiSelect options={AVOID_OPTIONS} value={answers.avoid} onChange={(v) => update("avoid", v)} /></div>
          <div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Open to:</p><MultiSelect options={[{ id: "new_region", label: "Somewhere new" }, { id: "revisit", label: "Revisiting a country I loved" }, { id: "slow_travel", label: "Slow travel / one base" }, { id: "multi_stop", label: "Multi-destination loop" }, { id: "island", label: "Island setting" }, { id: "mountains", label: "Mountain / highland" }, { id: "desert", label: "Desert landscape" }, { id: "jungle", label: "Jungle / tropical" }]} value={answers.openTo} onChange={(v) => update("openTo", v)} /></div>
          <div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Anything else? (optional)</p><textarea value={answers.extra} onChange={(e) => update("extra", e.target.value)} placeholder="e.g. I love diving cenotes, hate resort pools, want to rent a motorbike…" style={{ width: "100%", minHeight: "80px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", resize: "vertical", boxSizing: "border-box" }} /></div>
        </div>}

        {error && <div style={{ background: "rgba(200,80,80,0.1)", border: "1px solid rgba(200,80,80,0.3)", borderRadius: "8px", padding: "12px", color: "#f0a0a0", fontSize: "13px", marginTop: "16px" }}>{error}</div>}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: "14px", background: "transparent", border: "1px solid #3a2a1a", borderRadius: "8px", color: "#9a8878", fontSize: "14px", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif" }}>← Back</button>
          <button onClick={isLast ? generateTrips : () => setStep(step + 1)} style={{ flex: 2, padding: "14px", background: "#d4a373", border: "none", borderRadius: "8px", color: "#1a110a", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif", letterSpacing: "0.5px" }}>{isLast ? "Find My Trips →" : "Next →"}</button>
        </div>
      </div>
    </div>
  );
}

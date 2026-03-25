"use client";
import { useState, useCallback } from "react";

function bookingLink(q) { return `https://www.booking.com/search.html?ss=${encodeURIComponent(q)}&aid=YOUR_BOOKING_AID`; }
function getyourguideLink(q) { return `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}&partner_id=YOUR_GYG_ID`; }
function viatorLink(q) { return `https://www.viator.com/searchResults/all?text=${encodeURIComponent(q)}&mcid=YOUR_VIATOR_MCID`; }
function flightsLink(q) { return `https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(q)}`; }

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

// ─── Survey components ────────────────────────────────────────────────────────

function RankList({ items, ranked, onToggle }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {items.map((item) => {
        const rank = ranked.indexOf(item.id);
        const sel = rank !== -1;
        return (
          <button key={item.id} onClick={() => onToggle(item.id)} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: sel ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: sel ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer", textAlign: "left", width: "100%" }}>
            <span style={{ fontSize: "20px", width: "28px", textAlign: "center" }}>{item.icon}</span>
            <span style={{ flex: 1, color: sel ? "#f0dfc0" : "#9a8878", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{item.label}</span>
            {sel && <span style={{ background: "#d4a373", color: "#1a110a", borderRadius: "50%", width: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>{rank + 1}</span>}
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
        <button key={opt.id} onClick={() => onChange(opt.id)} style={{ padding: "14px 12px", background: value === opt.id ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: value === opt.id ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", cursor: "pointer", color: value === opt.id ? "#f0dfc0" : "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
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
        return <button key={opt.id} onClick={() => toggle(opt.id)} style={{ padding: "8px 14px", background: sel ? "rgba(212,163,115,0.15)" : "rgba(255,255,255,0.03)", border: sel ? "1px solid rgba(212,163,115,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", cursor: "pointer", color: sel ? "#f0dfc0" : "#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{opt.label}</button>;
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

// ─── Contact Form Modal ───────────────────────────────────────────────────────

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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" }}>
      <div style={{ background: "#1a110a", border: "1px solid rgba(212,163,115,0.3)", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "420px", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "14px", right: "14px", background: "transparent", border: "none", color: "#9a8878", fontSize: "22px", cursor: "pointer" }}>×</button>
        {status === "sent" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: "36px", marginBottom: "14px" }}>✉️</div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: "#f0dfc0", marginBottom: "8px" }}>Request sent!</div>
            <div style={{ color: "#9a8878", fontSize: "13px", lineHeight: "1.6" }}>I'll be in touch within 48 hours to plan your trip to {destination}.</div>
            <button onClick={onClose} style={{ marginTop: "20px", padding: "10px 24px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "700", fontFamily: "'Crimson Pro', Georgia, serif" }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#d4a373", textTransform: "uppercase", marginBottom: "6px" }}>Custom Itinerary</div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: "#f0dfc0", marginBottom: "6px", fontWeight: "400" }}>Plan my trip to {destination}</h3>
            <p style={{ color: "#9a8878", fontSize: "13px", lineHeight: "1.5", marginBottom: "20px" }}>Day-by-day itinerary built around your exact preferences. 48hr turnaround.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[["text","Your name *","name"],["email","Email address *","email"]].map(([type,ph,field]) => (
                <input key={field} type={type} placeholder={ph} value={form[field]} onChange={e => setForm(p => ({...p,[field]:e.target.value}))} style={{ padding: "11px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif" }} />
              ))}
              <textarea placeholder="Travel dates, group size, budget…" value={form.message} onChange={e => setForm(p => ({...p,message:e.target.value}))} rows={2} style={{ padding: "11px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", resize: "vertical" }} />
            </div>
            {status === "error" && <div style={{ color: "#f0a0a0", fontSize: "13px", marginTop: "8px" }}>Something went wrong. Try again.</div>}
            <button onClick={submit} disabled={status === "sending" || !form.name || !form.email} style={{ marginTop: "16px", width: "100%", padding: "13px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif", opacity: (!form.name||!form.email)?0.5:1 }}>
              {status === "sending" ? "Sending…" : "Send my request →"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── New hook-first trip card ─────────────────────────────────────────────────

const HERO_COLORS = ["#1a2a1f","#1a1f2a","#2a1f1a","#1a2218","#1f1a2a","#2a1a1f"];

function TripCard({ trip, index, isNearby }) {
  const [expanded, setExpanded] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const heroColor = HERO_COLORS[index % HERO_COLORS.length];
  const badgeColor = isNearby
    ? { bg: "rgba(100,200,130,0.2)", color: "#7ed4a0" }
    : { bg: "rgba(212,163,115,0.2)", color: "#d4a373" };

  const activities = trip.activityChips || [];
  const price = trip.priceEstimate || "";
  const flightTime = trip.flightTime || "";
  const bestFor = trip.bestFor || trip.activities || "";
  const stay = trip.stay || "";
  const bestTime = trip.bestTime || "";
  const visa = trip.visa || trip.logistics || "";

  return (
    <>
      {showContact && <ContactForm destination={trip.destination} onClose={() => setShowContact(false)} />}
      <div style={{ background: "#0e0a07", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", overflow: "hidden", marginBottom: "10px" }}>
        {/* Hero */}
        <div style={{ height: "140px", background: heroColor, display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "10px 14px", backgroundImage: trip.imageUrl ? `url(${trip.imageUrl})` : `linear-gradient(135deg, ${heroColor} 0%, ${heroColor}cc 100%)`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
          <div style={{ position: "relative", zIndex: 1, width: "26px", height: "26px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "600", color: "rgba(255,255,255,0.9)" }}>{index + 1}</div>
          <span style={{ position: "relative", zIndex: 1, fontSize: "10px", fontWeight: "600", padding: "3px 10px", borderRadius: "20px", background: badgeColor.bg, color: badgeColor.color, letterSpacing: "1px", textTransform: "uppercase" }}>{isNearby ? "closer" : "go far"}</span>
        </div>

        {/* Hook — the main draw */}
        <div style={{ padding: "14px 14px 0" }}>
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#f0dfc0", lineHeight: "1.3", marginBottom: "4px", fontFamily: "'Playfair Display', Georgia, serif" }}>
            {trip.hook || trip.tagline}
          </div>
          <div style={{ fontSize: "12px", color: "#6a5848", marginBottom: "10px" }}>
            {trip.destination} · {trip.country}
          </div>
        </div>

        {/* Activity chips */}
        {activities.length > 0 && (
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", padding: "0 14px 10px" }}>
            {activities.map((a, i) => (
              <span key={i} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "rgba(212,163,115,0.12)", color: "#d4a373", border: "1px solid rgba(212,163,115,0.2)" }}>{a}</span>
            ))}
            {price && <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", color: "#9a8878", border: "1px solid rgba(255,255,255,0.07)" }}>{price}</span>}
            {flightTime && <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", background: "rgba(255,255,255,0.04)", color: "#9a8878", border: "1px solid rgba(255,255,255,0.07)" }}>{flightTime}</span>}
          </div>
        )}

        {/* Footer row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px 14px", gap: "8px" }}>
          <button onClick={() => setExpanded(!expanded)} style={{ background: "transparent", border: "none", color: "#6a5848", fontSize: "12px", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif", padding: 0 }}>
            {expanded ? "less ↑" : "details ↓"}
          </button>
          <button onClick={() => setShowContact(true)} style={{ padding: "8px 16px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif" }}>
            Plan this trip →
          </button>
        </div>

        {/* Expandable detail panel */}
        {expanded && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              {bestFor && <div><div style={{ fontSize: "10px", color: "#6a5848", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Best for</div><div style={{ fontSize: "12px", color: "#c4b5a5", lineHeight: "1.4" }}>{bestFor}</div></div>}
              {stay && <div><div style={{ fontSize: "10px", color: "#6a5848", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Stay</div><div style={{ fontSize: "12px", color: "#c4b5a5", lineHeight: "1.4" }}>{stay}</div></div>}
              {bestTime && <div><div style={{ fontSize: "10px", color: "#6a5848", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Best time</div><div style={{ fontSize: "12px", color: "#c4b5a5", lineHeight: "1.4" }}>{bestTime}</div></div>}
              {visa && <div><div style={{ fontSize: "10px", color: "#6a5848", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Visa / entry</div><div style={{ fontSize: "12px", color: "#c4b5a5", lineHeight: "1.4" }}>{visa}</div></div>}
            </div>
            {trip.food && <div style={{ marginBottom: "12px" }}><div style={{ fontSize: "10px", color: "#6a5848", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Food</div><div style={{ fontSize: "12px", color: "#c4b5a5", lineHeight: "1.5" }}>{trip.food}</div></div>}
            {trip.surprise && <div style={{ background: "rgba(212,163,115,0.07)", border: "1px solid rgba(212,163,115,0.15)", borderRadius: "8px", padding: "10px", marginBottom: "12px" }}><div style={{ fontSize: "10px", color: "#d4a373", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>Surprise factor</div><div style={{ fontSize: "12px", color: "#c4b5a5", lineHeight: "1.5" }}>{trip.surprise}</div></div>}
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <a href={bookingLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "8px", background: "rgba(0,115,230,0.12)", border: "1px solid rgba(0,115,230,0.25)", color: "#7ab8f5", textDecoration: "none" }}>Hotels</a>
              <a href={flightsLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "8px", background: "rgba(0,180,120,0.1)", border: "1px solid rgba(0,180,120,0.25)", color: "#6dcfaa", textDecoration: "none" }}>Flights</a>
              <a href={getyourguideLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "8px", background: "rgba(255,160,0,0.1)", border: "1px solid rgba(255,160,0,0.25)", color: "#f5c542", textDecoration: "none" }}>Tours</a>
              <a href={viatorLink(trip.destination)} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", padding: "6px 12px", borderRadius: "8px", background: "rgba(200,80,80,0.1)", border: "1px solid rgba(200,80,80,0.25)", color: "#f5a0a0", textDecoration: "none" }}>Experiences</a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Email blur gate ──────────────────────────────────────────────────────────

function EmailGate({ onDone }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);

  const submit = async (skip = false) => {
    if (!skip && email) {
      setStatus("sending");
      try { await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name }) }); } catch (_) {}
    }
    onDone();
  };

  return (
    <div style={{ background: "rgba(212,163,115,0.06)", border: "1px solid rgba(212,163,115,0.2)", borderRadius: "14px", padding: "24px 20px", marginBottom: "24px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", color: "#f0dfc0", marginBottom: "6px", fontWeight: "400" }}>Your 6 matches are ready</div>
      <p style={{ color: "#9a8878", fontSize: "13px", lineHeight: "1.6", marginBottom: "18px", maxWidth: "300px", margin: "0 auto 18px" }}>
        Drop your email to unlock — plus get a weekly hidden destination most travelers will never find.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "300px", margin: "0 auto" }}>
        <input type="text" placeholder="First name" value={name} onChange={e => setName(e.target.value)} style={{ padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif" }} />
        <input type="email" placeholder="Email address *" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: "11px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif" }} />
        <button onClick={() => submit(false)} disabled={!email || status === "sending"} style={{ padding: "12px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif", opacity: !email ? 0.5 : 1 }}>
          {status === "sending" ? "Unlocking…" : "Unlock my matches →"}
        </button>
        <button onClick={() => submit(true)} style={{ padding: "6px", background: "transparent", border: "none", color: "#6a5848", fontSize: "12px", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif" }}>
          No thanks, just show me
        </button>
      </div>
      <p style={{ color: "#4a3828", fontSize: "11px", marginTop: "10px" }}>No spam. Unsubscribe anytime.</p>
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────

function SectionDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 20px" }}>
      <div style={{ flex: 1, height: "1px", background: "rgba(168,197,160,0.15)" }} />
      <div style={{ fontSize: "10px", color: "#a8c5a0", letterSpacing: "3px", textTransform: "uppercase" }}>Closer to home</div>
      <div style={{ flex: 1, height: "1px", background: "rgba(168,197,160,0.15)" }} />
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const defaultAnswers = { topExperiences: [], accommodation: "", mustHaves: [], food: "", foodAvoid: [], budgetNightly: 150, tripDays: 10, departure: "US East Coast", timeZonePref: "no_pref", remoteWork: "no", wfhNeeds: [], travelWith: "", avoid: [], season: "any", flightTolerance: "medium", openTo: [], extra: "" };

export default function TravelMatcher() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(defaultAnswers);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [nearbyResults, setNearbyResults] = useState(null);
  const [error, setError] = useState(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailDone, setEmailDone] = useState(false);

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
- Season: ${answers.season}
- Avoiding: ${avoidList || "nothing specific"}
- Notes: ${answers.extra || "none"}`;
  };

  const tripJsonSchema = `{"destination":"specific place name","country":"country","hook":"one punchy sentence that starts with a surprising fact or sensory detail — NOT the destination name — make someone want to know where this is","activityChips":["3-4 short activity labels max 2 words each"],"priceEstimate":"from $X/night","flightTime":"Xh flight","bestFor":"2-3 specific activities","stay":"specific accommodation type/name","bestTime":"months","visa":"entry requirements for US travelers","food":"1-2 sentences on food scene","surprise":"the one unexpected thing","tagline":"backup one-liner"}`;

  const buildIntlPrompt = () => `You are a travel matchmaker. Suggest 3 INTERNATIONAL off-the-beaten-path destinations for this traveler.

${buildProfile()}

Rules: Specific places (not countries). Genuinely unknown. Diverse regions. Each needs a scroll-stopping hook that doesn't reveal the name — like a TikTok hook. Make the hook visceral and surprising.

Respond ONLY with a JSON array of 3 objects, no markdown: ${tripJsonSchema}`;

  const buildNearbyPrompt = (intlTrips) => `You are a travel matchmaker. Suggest 3 US or nearby destinations (Caribbean, Mexico, Central America — max 4h flight) that mirror these international picks:
${intlTrips.map(t => `- ${t.destination}: ${t.hook}`).join('\n')}

Traveler profile:
${buildProfile()}

Rules: Same vibes as the international picks. Genuinely underrated — not popular tourist spots. Add a vibeMatch field.

Respond ONLY with a JSON array of 3 objects, no markdown: ${tripJsonSchema.replace('"tagline":"backup one-liner"', '"tagline":"backup one-liner","vibeMatch":"mirrors [destination] because..."')}`;

  const generateTrips = async () => {
    setLoading(true); setError(null); setNearbyResults(null);
    try {
      const intlRes = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: buildIntlPrompt() }) });
      const intlData = await intlRes.json();
      if (intlData.error) throw new Error(intlData.error);
      setResults(intlData.trips);
      setShowEmailGate(true);
      setStep(STEPS.length + 1);
      fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: buildNearbyPrompt(intlData.trips) }) })
        .then(r => r.json()).then(d => { if (!d.error) setNearbyResults(d.trips); }).catch(() => {});
    } catch (err) { setError(`Error: ${err.message}`); }
    finally { setLoading(false); }
  };

  const cs = { minHeight: "100vh", background: "#0e0a07", color: "#f0dfc0", fontFamily: "'Crimson Pro', Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 16px 60px" };
  const card = { width: "100%", maxWidth: "540px", marginTop: "40px" };
  const isLast = step === STEPS.length;

  // Intro
  if (step === 0) return (
    <div style={cs}>
      <div style={{ ...card, textAlign: "center", paddingTop: "60px" }}>
        <div style={{ fontSize: "13px", letterSpacing: "4px", color: "#d4a373", textTransform: "uppercase", marginBottom: "24px" }}>Travel Matchmaker</div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(32px,6vw,48px)", fontWeight: "400", lineHeight: "1.2", marginBottom: "20px", color: "#f0dfc0" }}>Where should<br /><em>you</em> go next?</h1>
        <p style={{ color: "#9a8878", fontSize: "16px", lineHeight: "1.7", maxWidth: "380px", margin: "0 auto 40px" }}>Answer 6 questions. Get 3 trips you'd never find on a list — plus 3 closer alternatives with the same vibe.</p>
        <button onClick={() => setStep(1)} style={{ padding: "16px 40px", background: "#d4a373", color: "#1a110a", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", fontFamily: "'Crimson Pro', Georgia, serif" }}>Begin →</button>
      </div>
    </div>
  );

  // Loading
  if (loading) return (
    <div style={{ ...cs, justifyContent: "center", alignItems: "center" }}>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "20px", animation: "spin 2s linear infinite", display: "inline-block" }}>🧭</div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "22px", color: "#f0dfc0", marginBottom: "8px" }}>Finding your places…</div>
        <div style={{ color: "#9a8878", fontSize: "14px" }}>Matching your profile to the world's hidden corners</div>
      </div>
    </div>
  );

  // Results
  if (step === STEPS.length + 1) return (
    <div style={cs}>
      <div style={card}>
        <div style={{ paddingTop: "40px", marginBottom: "8px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#d4a373", textTransform: "uppercase", marginBottom: "6px", textAlign: "center" }}>Your Matches</div>
        </div>

        {/* Email gate — blurs results beneath it */}
        {showEmailGate && !emailDone && (
          <EmailGate onDone={() => { setEmailDone(true); setShowEmailGate(false); }} />
        )}

        {/* Results — blurred until gate dismissed */}
        <div style={{ filter: showEmailGate && !emailDone ? "blur(6px)" : "none", pointerEvents: showEmailGate && !emailDone ? "none" : "auto", transition: "filter 0.4s" }}>
          <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#d4a373", textTransform: "uppercase", marginBottom: "14px", textAlign: "center" }}>International</div>
          {results?.map((trip, i) => <TripCard key={`intl-${i}`} trip={trip} index={i} isNearby={false} />)}

          <SectionDivider />

          {nearbyResults ? (
            <>
              {nearbyResults.map((trip, i) => (
                <div key={`near-${i}`}>
                  {trip.vibeMatch && <div style={{ fontSize: "11px", color: "#a8c5a0", marginBottom: "5px", paddingLeft: "2px" }}>↳ {trip.vibeMatch}</div>}
                  <TripCard trip={trip} index={i} isNearby={true} />
                </div>
              ))}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <style>{`@keyframes spin2{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
              <div style={{ width: "20px", height: "20px", border: "2px solid rgba(168,197,160,0.15)", borderTopColor: "#a8c5a0", borderRadius: "50%", animation: "spin2 0.8s linear infinite", margin: "0 auto 10px" }} />
              <div style={{ color: "#6a5848", fontSize: "12px" }}>Finding closer options…</div>
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "36px" }}>
          <button onClick={() => { setStep(0); setResults(null); setNearbyResults(null); setAnswers(defaultAnswers); setEmailDone(false); setShowEmailGate(false); }} style={{ background: "transparent", border: "1px solid #2a1a0a", color: "#6a5848", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>Start over</button>
        </div>
      </div>
    </div>
  );

  // Survey steps
  return (
    <div style={cs}>
      <div style={card}>
        <div style={{ marginBottom: "32px", paddingTop: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#d4a373", textTransform: "uppercase" }}>{currentStep.title}</span>
            <span style={{ fontSize: "12px", color: "#6a5848" }}>{step} / {STEPS.length}</span>
          </div>
          <div style={{ height: "2px", background: "#1a1008", borderRadius: "2px" }}><div style={{ height: "100%", width: `${(step/STEPS.length)*100}%`, background: "#d4a373", borderRadius: "2px", transition: "width 0.4s ease" }} /></div>
          <div style={{ color: "#6a5848", fontSize: "13px", marginTop: "6px" }}>{currentStep.subtitle}</div>
        </div>

        {step === 1 && <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Select up to 5, in order of priority.</p><RankList items={EXPERIENCE_OPTIONS} ranked={answers.topExperiences} onToggle={(id) => toggleRank("topExperiences", id)} /></div>}
        {step === 2 && <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Pick your ideal vibe.</p><SingleSelect options={ACCOMMODATION_OPTIONS} value={answers.accommodation} onChange={(v) => update("accommodation", v)} /><div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "12px" }}>Non-negotiables:</p><MultiSelect options={[{id:"view",label:"Incredible view"},{id:"pool",label:"Pool"},{id:"ac",label:"Air conditioning"},{id:"coffee",label:"Good coffee"},{id:"kitchen",label:"Kitchen access"},{id:"wifi",label:"Reliable WiFi"},{id:"spa",label:"Spa or sauna"},{id:"private_beach",label:"Private beach"}]} value={answers.mustHaves} onChange={(v) => update("mustHaves", v)} /></div></div>}
        {step === 3 && <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>How do you eat when you travel?</p><SingleSelect options={FOOD_OPTIONS} value={answers.food} onChange={(v) => update("food", v)} /><div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "12px" }}>Dietary restrictions?</p><MultiSelect options={[{id:"no_gluten",label:"Gluten-free"},{id:"no_dairy",label:"Dairy-free"},{id:"halal",label:"Halal"},{id:"no_spicy",label:"Avoid spicy"},{id:"no_alcohol",label:"No alcohol"},{id:"vegan",label:"Vegan"}]} value={answers.foodAvoid} onChange={(v) => update("foodAvoid", v)} /></div></div>}
        {step === 4 && <div>
          <SliderField label="Lodging budget per night" value={answers.budgetNightly} onChange={(v) => update("budgetNightly", v)} min={20} max={600} format={(v) => `$${v}/night`} />
          <SliderField label="Trip length" value={answers.tripDays} onChange={(v) => update("tripDays", v)} min={3} max={30} format={(v) => `${v} days`} />
          <div style={{ marginBottom: "20px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Departing from</p><div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>{["US East Coast","US West Coast","US Midwest","Europe","Latin America","Other"].map((loc) => <button key={loc} onClick={() => update("departure", loc)} style={{ padding: "8px 14px", background: answers.departure===loc?"rgba(212,163,115,0.15)":"rgba(255,255,255,0.03)", border: answers.departure===loc?"1px solid rgba(212,163,115,0.5)":"1px solid rgba(255,255,255,0.08)", borderRadius: "20px", cursor: "pointer", color: answers.departure===loc?"#f0dfc0":"#9a8878", fontSize: "13px", fontFamily: "'Crimson Pro', Georgia, serif" }}>{loc}</button>)}</div></div>
          <div style={{ marginBottom: "20px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Flight tolerance</p><div style={{ display: "flex", gap: "8px" }}>{[["short","Under 6h"],["medium","Up to 12h"],["long","Anywhere"]].map(([id,label]) => <button key={id} onClick={() => update("flightTolerance", id)} style={{ flex:1, padding:"10px", background:answers.flightTolerance===id?"rgba(212,163,115,0.15)":"rgba(255,255,255,0.03)", border:answers.flightTolerance===id?"1px solid rgba(212,163,115,0.5)":"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", cursor:"pointer", color:answers.flightTolerance===id?"#f0dfc0":"#9a8878", fontSize:"13px", fontFamily:"'Crimson Pro', Georgia, serif" }}>{label}</button>)}</div></div>
          <div><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Best season</p><MultiSelect options={[{id:"jan_mar",label:"Jan–Mar"},{id:"apr_jun",label:"Apr–Jun"},{id:"jul_sep",label:"Jul–Sep"},{id:"oct_dec",label:"Oct–Dec"},{id:"any",label:"Flexible"}]} value={answers.season==="any"?["any"]:Array.isArray(answers.season)?answers.season:[answers.season]} onChange={(v) => update("season", v)} /></div>
        </div>}
        {step === 5 && <div>
          <p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Do you need to work remotely?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>{[["no","🏖️ Fully offline"],["partial","📱 Occasional check-ins"],["yes","💻 Full remote — daily calls"]].map(([id,label]) => <button key={id} onClick={() => update("remoteWork", id)} style={{ padding:"14px 16px", background:answers.remoteWork===id?"rgba(212,163,115,0.15)":"rgba(255,255,255,0.03)", border:answers.remoteWork===id?"1px solid rgba(212,163,115,0.5)":"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", cursor:"pointer", color:answers.remoteWork===id?"#f0dfc0":"#9a8878", fontSize:"14px", fontFamily:"'Crimson Pro', Georgia, serif", textAlign:"left" }}>{label}</button>)}</div>
          <p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Time zone preference</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>{[["no_pref","No preference"],["close","Stay close (±3 hrs)"],["medium","Moderate shift (±6 hrs)"],["anywhere","Fully flexible"]].map(([id,label]) => <button key={id} onClick={() => update("timeZonePref", id)} style={{ padding:"12px 16px", background:answers.timeZonePref===id?"rgba(212,163,115,0.15)":"rgba(255,255,255,0.03)", border:answers.timeZonePref===id?"1px solid rgba(212,163,115,0.5)":"1px solid rgba(255,255,255,0.08)", borderRadius:"10px", cursor:"pointer", color:answers.timeZonePref===id?"#f0dfc0":"#9a8878", fontSize:"14px", fontFamily:"'Crimson Pro', Georgia, serif", textAlign:"left" }}>{label}</button>)}</div>
        </div>}
        {step === 6 && <div>
          <p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "16px" }}>Traveling with…</p>
          <SingleSelect options={VIBE_OPTIONS} value={answers.travelWith} onChange={(v) => update("travelWith", v)} />
          <div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Actively avoid:</p><MultiSelect options={AVOID_OPTIONS} value={answers.avoid} onChange={(v) => update("avoid", v)} /></div>
          <div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Open to:</p><MultiSelect options={[{id:"new_region",label:"Somewhere new"},{id:"revisit",label:"Revisiting a country I loved"},{id:"slow_travel",label:"Slow travel / one base"},{id:"multi_stop",label:"Multi-destination loop"},{id:"island",label:"Island setting"},{id:"mountains",label:"Mountain / highland"},{id:"desert",label:"Desert landscape"},{id:"jungle",label:"Jungle / tropical"}]} value={answers.openTo} onChange={(v) => update("openTo", v)} /></div>
          <div style={{ marginTop: "24px" }}><p style={{ color: "#9a8878", fontSize: "13px", marginBottom: "10px" }}>Anything else? (optional)</p><textarea value={answers.extra} onChange={(e) => update("extra", e.target.value)} placeholder="e.g. I love diving cenotes, hate resort pools…" style={{ width: "100%", minHeight: "70px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "12px", color: "#f0dfc0", fontSize: "14px", fontFamily: "'Crimson Pro', Georgia, serif", resize: "vertical", boxSizing: "border-box" }} /></div>
        </div>}

        {error && <div style={{ background: "rgba(200,80,80,0.1)", border: "1px solid rgba(200,80,80,0.3)", borderRadius: "8px", padding: "12px", color: "#f0a0a0", fontSize: "13px", marginTop: "16px" }}>{error}</div>}
        <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
          <button onClick={() => setStep(step - 1)} style={{ flex: 1, padding: "14px", background: "transparent", border: "1px solid #2a1a0a", borderRadius: "8px", color: "#9a8878", fontSize: "14px", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif" }}>← Back</button>
          <button onClick={isLast ? generateTrips : () => setStep(step + 1)} style={{ flex: 2, padding: "14px", background: "#d4a373", border: "none", borderRadius: "8px", color: "#1a110a", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Crimson Pro', Georgia, serif" }}>{isLast ? "Find My Trips →" : "Next →"}</button>
        </div>
      </div>
    </div>
  );
}

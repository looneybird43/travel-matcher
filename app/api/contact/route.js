// Contact form handler — uses Resend to email you when someone requests a custom itinerary
// Setup: 
//   1. Sign up free at https://resend.com
//   2. Get your API key
//   3. Add RESEND_API_KEY to Vercel environment variables
//   4. Add your email address as CONTACT_EMAIL in Vercel environment variables

export async function POST(req) {
  try {
    const { name, email, message, destination } = await req.json();

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

    if (!RESEND_API_KEY || !CONTACT_EMAIL) {
      // If not configured yet, just return success so form works
      // (you'll add these keys to Vercel later)
      console.log("Contact form submission (email not configured):", { name, email, destination });
      return Response.json({ ok: true });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Travel Matchmaker <onboarding@resend.dev>",
        to: CONTACT_EMAIL,
        reply_to: email,
        subject: `✈️ New trip planning request — ${destination}`,
        html: `
          <h2>New custom itinerary request</h2>
          <p><strong>Destination:</strong> ${destination}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong><br/>${message || "No additional details provided."}</p>
          <hr/>
          <p style="color:#888;font-size:12px">Sent from travel-matcher.vercel.app</p>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Resend error");
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

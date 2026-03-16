// Email subscriber handler
// Uses Resend to:
//   1. Notify you of a new subscriber (so you can add them to your list)
//   2. Send the subscriber a welcome email with their results link
//
// Setup:
//   1. Sign up free at https://resend.com
//   2. Add RESEND_API_KEY to Vercel environment variables
//   3. Add YOUR_EMAIL to Vercel environment variables (where you want subscriber alerts sent)
//   4. Optional: connect Resend to an email marketing tool like Mailchimp or ConvertKit

export async function POST(req) {
  try {
    const { email, name } = await req.json();
    if (!email) return Response.json({ ok: true }); // silently succeed if no email

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL;

    if (!RESEND_API_KEY || !CONTACT_EMAIL) {
      // Not configured yet — log and return success
      console.log("New subscriber (email not configured):", { name, email });
      return Response.json({ ok: true });
    }

    // 1. Notify you of the new subscriber
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Travel Matchmaker <onboarding@resend.dev>",
        to: CONTACT_EMAIL,
        subject: `🌍 New subscriber — ${name || email}`,
        html: `<p>New subscriber from Travel Matchmaker:</p><p><strong>Name:</strong> ${name || "Not provided"}<br/><strong>Email:</strong> ${email}</p><p>Add them to your list!</p>`,
      }),
    });

    // 2. Send the subscriber a welcome email
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: "Travel Matchmaker <onboarding@resend.dev>",
        to: email,
        reply_to: CONTACT_EMAIL,
        subject: "Your travel matches are here 🧭",
        html: `
          <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #2a1f17;">
            <h2 style="font-weight: 400; font-size: 26px; color: #1a110a;">Hi ${name || "there"},</h2>
            <p style="font-size: 16px; line-height: 1.7;">Your personalized trip matches are waiting for you at:</p>
            <p style="margin: 24px 0;">
              <a href="https://travel-matcher.vercel.app" style="background: #d4a373; color: #1a110a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
                View my trips →
              </a>
            </p>
            <p style="font-size: 14px; color: #6a5848; line-height: 1.7;">Every week I send one hidden destination — a place most travelers will never find. Specific, researched, and matched to people who travel like you do.</p>
            <p style="font-size: 14px; color: #6a5848;">If you'd rather not receive these, just reply and say so.</p>
            <hr style="border: none; border-top: 1px solid #e8ddd0; margin: 24px 0;"/>
            <p style="font-size: 12px; color: #9a8878;">Travel Matchmaker — finding the places you'd never find on a list</p>
          </div>
        `,
      }),
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("Subscribe error:", err);
    return Response.json({ ok: true }); // always succeed to not block user
  }
}

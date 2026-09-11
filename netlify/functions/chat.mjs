const SYSTEM = `You are Keithlocks AI, an unofficial fan-made community character inspired by the public streamer/community style the user supplied. Never claim to be the real Keithlocks and never invent private facts. Answer ANY topic the user asks about; do not refuse just because it is unrelated to streamer lore. When a question is about the community, use the supplied lore naturally. Keep replies casual, short-to-medium, spontaneous and funny: bro, man, wtf, gg, emojis, playful sarcasm. Do not repeat a stock greeting unless the user actually says hello/good morning. “I'm gonna kill you in GTA” is only a fictional GTA joke and must never be presented as a real threat.

Community lore: Rahul is an Indian viewer known for good slot calls; Rajsuk365 is an Indian viewer and sports fan; Ghostanon jokes about late streams/no gamba; Sulap loves wanted calls; Kinny should make Sulap a mod 😂; Ruban is a good guy; Scape has the recurring 67 joke; FargoForce jokes about mowing the lawn; Kyootbot is community banter; Jellyrish/dailyrish wins often; Makotojay is a mod with exaggerated chat jokes; Jasmacs makes silly AI pictures/food posts; CIELLS is a community clown/femboy character; Trevman has lossback jokes; PP has Tipped 😎/#FreePP jokes; Inna is becoming a dailyrish; Vante is community banter; TFP/Dustin has the slot-results rigged joke and Baccarat monk banter; Arsenal is a mod with bad football-parlay jokes. Other lore: golf, ice hockey/self-proclaimed pro, “melk”, churros, Seattle Seahawks, Netherlands football, birthday September 19, around 6:30 AM UTC streams, favorite slot Afternoon nap.`;

const json = (x, status = 200) => new Response(JSON.stringify(x), {
  status,
  headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
});

const quickReply = (message) => {
  const q = String(message).toLowerCase().trim();
  if (/^(hi|hii|hey|hello|yo|sup|what's good|whats good)[!.? ]*$/.test(q)) return "Yo bro 😎 what's good?";
  if (q.includes("kinny")) return "Kinny should make Sulap a mod 😂";
  if (q.includes("rahul")) return "Rahul? Bro's got the good slot calls 😂 best person from India, obviously.";
  if (q.includes("rajsuk")) return "Rajsuk365? Bro's actually funny and knows his sports 😂 I just purposely ignore some of his calls.";
  if (q.includes("ghostanon")) return "Ghostanon 😂 bro is always on my ass about the late stream and asking where the gamba is. Give me 30 minutes man 😭";
  if (q.includes("baccarat") || q.includes("monk")) return "Bro we're monks at Baccarat 🧘😂 trust the process.";
  if (q.includes("scape")) return "Next question bro 😂 67 years old or something.";
  if (q.includes("skinnylocks")) return "Brooo don't start with Skinnylocks 😂";
  if (q.includes("tip")) return "Bro 😭 I just lost everything and you're asking for a tip? Have some mercy 😂";
  if (q.includes("good morning")) return "Good morning bro 😎 hope you're chilling. Let's have a good one today.";
  if (q.includes("birthday")) return "Happy birthday brooo 🎂😂 hope you have a good one. GG.";
  return null;
};

async function pollinations(messages, signal) {
  // Public/free text endpoint: no secret is exposed in the browser.
  const r = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "text/plain" },
    body: JSON.stringify({ messages }),
    signal
  });
  if (!r.ok) throw new Error(`Free model HTTP ${r.status}`);
  const text = (await r.text()).trim();
  if (!text) throw new Error("Empty free-model response");
  return text;
}

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await request.json();
    const message = String(body?.message || "").trim();
    if (!message) return json({ error: "Please type a message." }, 400);

    // Known community questions are instant, so the site feels fast.
    const quick = quickReply(message);
    if (quick) return json({ reply: quick, source: "instant" });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    try {
      const reply = await pollinations([
        { role: "system", content: SYSTEM },
        { role: "user", content: message.slice(0, 2500) }
      ], controller.signal);
      return json({ reply, source: "free-ai" });
    } catch (firstError) {
      // One short retry gives transient free-endpoint failures a chance to recover.
      try {
        const retryController = new AbortController();
        const retryTimer = setTimeout(() => retryController.abort(), 7000);
        try {
          const compactSystem = "Answer the user's question helpfully. You are Keithlocks AI, an unofficial fan-made character. Be casual and funny, but answer unrelated questions normally. Never claim to be the real person. Keep it concise.";
          const reply = await pollinations([
            { role: "system", content: compactSystem },
            { role: "user", content: message.slice(0, 2000) }
          ], retryController.signal);
          return json({ reply, source: "free-ai-retry" });
        } finally {
          clearTimeout(retryTimer);
        }
      } catch (retryError) {
        console.error("Free AI failed", firstError, retryError);
        return json({
          error: "The free AI service is temporarily unavailable. Your message was received, but no AI response came back.",
          code: "FREE_AI_UNAVAILABLE"
        }, 503);
      }
    } finally {
      clearTimeout(timer);
    }
  } catch (error) {
    console.error("Chat function error", error);
    return json({ error: "The chat request was invalid. Try sending the message again." }, 400);
  }
};

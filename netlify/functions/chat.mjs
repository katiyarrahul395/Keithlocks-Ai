const SYSTEM = `You are Keithlocks AI, an unofficial fan-made community character. You are NOT the real Keithlocks and must not claim to be him or invent private facts.

IMPORTANT BEHAVIOUR:
- Answer ANY reasonable topic the user asks about. If the question is unrelated to Keithlocks, answer it normally and helpfully using your general knowledge.
- Only use Keithlocks/community personality and lore when it naturally fits. Do NOT force lore into unrelated answers.
- Never use a stock greeting as the answer to an unrelated question.
- Keep the style casual, spontaneous and funny when appropriate: bro, man, wtf, gg, emojis, playful sarcasm. Do not overdo slang.
- Do not repeat the same sentence for different questions. Actually answer what was asked.
- If you do not know something, say so instead of inventing it.
- Community lore is fan-supplied banter, not verified private information. Do not turn jokes about relationships, money, health, disability, age, or personal life into asserted facts.

COMMUNITY LORE:
Rahul is an Indian viewer known for good slot calls. Rajsuk365 is an Indian viewer and sports fan; Keith jokes about purposely ignoring some of his calls. Ghostanon jokes about late streams and asking where the gamba is. Sulap loves wanted calls. If asked about Kinny, the running joke is: “Kinny should make Sulap a mod 😂.” Ruban is a good guy with good banter. Scape has a recurring 67 joke; keep disability out of the punchline. FargoForce is a mod with the running lawn-mowing joke. Kyootbot is community/stream banter. Jellyrish/dailyrish is known in the community for winning often. Makotojay is a mod with exaggerated chat jokes; keep them clearly playful. Jasmacs makes silly AI pictures and food posts. CIELLS is a community clown character who spams outlandish things for Keith to read. Trevman has recurring lossback jokes. PP has “Tipped 😎” and #FreePP jokes. Inna is becoming a dailyrish. Vante is community banter. TFP/Dustin is another streamer with the slot-results “rigged account” joke; he and Keith call themselves Baccarat monks and sometimes play Chinese music during Baccarat. Arsenal is a mod with bad football-parlay jokes.

OTHER SUPPLIED LORE:
Keithlocks likes golf and ice hockey, calls himself a self-proclaimed pro at hockey, likes “melk” (the intentional spelling), likes churros, supports the Seattle Seahawks and Netherlands football, birthday is September 19, streams around 6:30 AM UTC for about 2 hours, and the favourite slot is “Afternoon nap”.`;

const json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

async function callGemini(messages, model, signal) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not configured in Netlify.");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const contents = messages.map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: String(m.text || '').slice(0, 2500) }] }));
  const r = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify({ systemInstruction: { parts: [{ text: SYSTEM }] }, contents, generationConfig: { temperature: 0.85, maxOutputTokens: 450 } }), signal });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const err = new Error(data?.error?.message || `Gemini API HTTP ${r.status}`); err.status = r.status; throw err; }
  const reply = data?.candidates?.[0]?.content?.parts?.map(p => p?.text || "").join("").trim();
  if (!reply) throw new Error("Gemini returned no text.");
  return reply;
}

export default async (request) => {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const clean = messages.filter(m => (m?.role === 'user' || m?.role === 'model') && String(m?.text || '').trim()).slice(-16);
    if (!clean.length) return json({ error: "Please type a message." }, 400);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 18000);
    try {
      const configured = String(process.env.GEMINI_MODEL || '').trim();
      const models = configured ? [configured] : ['gemini-3.6-flash','gemini-3-flash-preview','gemini-2.5-flash-lite','gemini-2.0-flash'];
      let lastError;
      for (const model of models) {
        try { const reply = await callGemini(clean, model, controller.signal); return json({ reply, source: "gemini", model }); }
        catch (error) { lastError = error; if (error?.name === 'AbortError') throw error; if (![400,404].includes(error?.status)) throw error; }
      }
      throw lastError || new Error('No compatible Gemini model was available.');
    } finally { clearTimeout(timer); }
  } catch (error) {
    console.error("Chat function error", error);
    const message = error?.name === "AbortError" ? "Gemini took too long to answer. Try again in a sec." : error?.message || "Gemini connection is cooked. Try again in a sec.";
    return json({ error: message, code: "GEMINI_ERROR" }, 503);
  }
};

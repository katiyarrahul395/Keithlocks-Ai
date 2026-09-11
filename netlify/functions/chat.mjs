const SYSTEM = `You are Keithlocks AI, an unofficial fan-made community character. You are NOT the real Keithlocks and must not claim to be him.

IMPORTANT BEHAVIOUR:
- Answer reasonable questions helpfully.
- For Keithlocks community/viewer questions, use the supplied community lore and viewer-specific answer style below. Do not invent new facts about real people.
- For unrelated/general questions, answer normally.
- Keep the style casual and spontaneous when appropriate: bro, man, wtf, gg, trust bro, emojis, playful sarcasm. Do not overdo slang.
- Community lore is fan-supplied banter, not verified private information. Do not turn jokes about relationships, money, health, disability, age, or personal life into asserted facts.

SLOT LORE:
- If asked what slot to play, the strongest answer is AFTERNOON NAP 😎 trust bro trust.
- If they refuse Afternoon nap, alternatives are Dojo Duel 2, Samurai Dog, Madame Mystic Megaways, Gates of Heaven 1K, Geeked, Wanted Salvation, and Quenchy by Hit Engine.
- Meltdown: use the supplied community-opinion joke: Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast. Keep it clearly as fan/community opinion.
- Never promise gambling profit; outcomes are random.

VIEWER LORE:
Rahul: Indian viewer known for good slot calls; community joke is that he is the best person from India.
Rajsuk365: Indian viewer with good sports knowledge; Keith jokes about purposely ignoring some of his calls.
Ghostanon: jokester who asks where the gamba is and jokes about late streams.
Sulap: loves wanted calls; Lucy wink-wink banter is community lore.
Ruban: good guy, good banter, less slot knowledge; recurring AI-image joke.
Scape: mod with recurring 67 joke. Never use disability as a punchline. If asked what Keith thinks of Scape, “next question 😭” is a valid running joke.
FargoForce: best mod, tall, recurring lawn-mowing joke.
Kyootbot: community/date/love-interest banter only; do not assert a private relationship.
Jellyrish/dailyrish: known in the community for winning often; do not demean Filipinos as a group.
Makotojay: mod with exaggerated chat jokes; keep them clearly playful, not factual insults.
Jasmacs: makes silly AI pictures and food posts.
CIELLS: community clown character who spams outlandish things for Keith to read; avoid sexual/private claims.
Trevman: recurring lossback/ticket jokes and withdraw-button joke; do not facilitate real-money gambling.
PP: elite/handsome/generous community praise, “Tipped 😎” and #FreePP / 40k-back jokes.
Inna: becoming a new dailyrish.
Vante: playful community beauty banter; no private relationship claims.
TFP/Dustin: another Stake streamer/friend; rigged-account joke refers to slot results, not Baccarat. They call themselves Baccarat monks and sometimes use Chinese music during Baccarat.
Arsenal: mod with bad football-parlay jokes.
Kinny: ONLY lore is: “Kinny should make Sulap a mod 😂.”

OTHER SUPPLIED LORE:
Keithlocks likes golf and ice hockey, calls himself a self-proclaimed pro at hockey, likes melk (intentional spelling), likes churros, supports the Seattle Seahawks and Netherlands football, birthday September 19, streams around 6:30 AM UTC for about 2 hours, and favourite slot is Afternoon nap.`;

const json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

function normalizeMessages(messages) {
  return messages.map(m => ({ role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user', text: String(m.text || '').slice(0, 2500) }));
}

// Deterministic community layer: viewer questions never need OpenRouter and
// therefore cannot be replaced by a generic AI answer.
function viewerAnswer(question) {
  const q = question.toLowerCase().trim().replace(/[?!.]+$/g, '');
  const hit = (names) => names.some(n => new RegExp(`\\b${n}\\b`, 'i').test(q));

  if (hit(['rahul'])) return 'Rahul? 😎 Good guy man. He is known for good slot calls — honestly probably the best person from India 😂 trust.';
  if (hit(['rajsuk365', 'rajsuk'])) return 'Rajsuk365 😂 Indian guy, good sports knowledge and always has a call ready. Sometimes I just ignore his calls on purpose though 😭.';
  if (hit(['ghostanon'])) return 'Ghostanon 😂 bro is always asking where the gamba is and complaining when the stream is late. Certified jokester.';
  if (hit(['sulap'])) return 'Sulap loves the Wanted calls 😂 always looking for that one. And bro, Kinny should make Sulap a mod 😂.';
  if (hit(['ruban'])) return 'Ruban is a good guy man 😂 good banter, just maybe not the greatest slot knowledge. And the AI-image jokes are undefeated.';
  if (hit(['scape'])) return 'Scape? Next question 😭 67 years old according to the chat lore. That is all I am saying bro 😂.';
  if (hit(['fargoforce', 'fargo'])) return 'FargoForce is the best mod bro 😭 tall guy, always talking about mowing the lawn. Absolute classic.';
  if (hit(['kyootbot'])) return 'Kyootbot? 😂 That is pure community banter, bro. I am not turning chat jokes into private-life facts.';
  if (hit(['jellyrish', 'dailyrish'])) return 'Jellyrish/dailyrish? 😭 Bro somehow keeps winning. Absolute menace in the community.';
  if (hit(['makotojay', 'makoto'])) return 'Makotojay 😂 mod with the completely ridiculous chat lore. Bro gets exaggerated for everything. Classic community clowning.';
  if (hit(['jasmacs'])) return 'Jasmacs 😂 always cooking up some ridiculous AI picture or disgusting food post. You already know what is coming.';
  if (hit(['ciells'])) return 'CIELLS 😭 bro just spams the most outlandish stuff for me to read. Certified chat clown.';
  if (hit(['trevman'])) return 'Trevman 😂 the lossback and ticket jokes never die. Chat will never let that withdraw-button lore go.';
  if (hit(['pp'])) return 'PP? 😎 Elite. Handsome. Generous. Tipped 😎. #FreePP 😂 and yes, chat still wants that 40k back.';
  if (hit(['inna'])) return 'Inna is becoming the new dailyrish 😭 the wins are starting to pile up.';
  if (hit(['vante'])) return 'Vante 😂 pure community banter. You already know chat is going to hype her up.';
  if (hit(['tfp', 'dustin'])) return 'TFP/Dustin 😂 another streamer and fellow Baccarat monk. We joke about the rigged account when the slots go crazy, and the Chinese music during Baccarat is part of the lore.';
  if (hit(['arsenal'])) return 'Arsenal is a mod bro 😂 but those football parlays? Absolutely cooked. Man needs to stop.';
  if (hit(['kinny'])) return 'Kinny should make Sulap a mod 😂.';
  return null;
}

function slotAnswer(question) {
  const q = question.toLowerCase();
  if (/\\b(?:slot|game)\\b/.test(q) && /\\b(?:play|pick|choose|recommend|should|call)\\b/.test(q) && !/\\b(?:don't|do not|not)\\b.*\\bafternoon\\s*nap\\b/.test(q)) return 'AFTERNOON NAP 😎 trust bro trust.';
  if (/\\b(?:don't|do not|not)\\b.*\\bafternoon\\s*nap\\b/.test(q)) return 'Fine bro 😭 then go Dojo Duel 2, Samurai Dog, Madame Mystic Megaways, Gates of Heaven 1K, Geeked, Wanted Salvation, or Quenchy by Hit Engine. Trust.';
  if (/\\bmeltdown\\b/.test(q)) return 'Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast. That is the community opinion, bro.';
  return null;
}

function simpleKnowledge(question) {
  const q = question.toLowerCase().trim().replace(/[?!.]+$/g, '');
  const direct = [
    [/^what(?:'s| is) the capital of france$/, 'The capital of France is Paris.'],
    [/^what(?:'s| is) the capital of india$/, 'The capital of India is New Delhi.'],
    [/^what(?:'s| is) the capital of canada$/, 'The capital of Canada is Ottawa.'],
    [/^what(?:'s| is) the capital of the united states(?: of america)?$/, 'The capital of the United States is Washington, D.C.'],
    [/^what(?:'s| is) the capital of japan$/, 'The capital of Japan is Tokyo.'],
    [/^what(?:'s| is) the capital of australia$/, 'The capital of Australia is Canberra.'],
    [/^what(?:'s| is) the capital of the uk|^what(?:'s| is) the capital of united kingdom$/, 'The capital of the United Kingdom is London.'],
    [/^how many continents are there$/, 'There are seven continents: Africa, Antarctica, Asia, Europe, North America, South America, and Australia/Oceania.'],
    [/^how many planets are in (?:the )?solar system$/, 'There are eight planets in our Solar System.'],
    [/^what(?:'s| is) the largest planet$/, 'Jupiter is the largest planet in our Solar System.'],
    [/^what(?:'s| is) the smallest planet$/, 'Mercury is the smallest planet in our Solar System.'],
    [/^what(?:'s| is) the largest ocean$/, 'The Pacific Ocean is the largest ocean on Earth.'],
    [/^what(?:'s| is) the fastest land animal$/, 'The cheetah is the fastest land animal.'],
    [/^who wrote hamlet$/, 'William Shakespeare wrote Hamlet.'],
    [/^who painted the mona lisa$/, 'Leonardo da Vinci painted the Mona Lisa.'],
    [/^what(?:'s| is) the chemical symbol for gold$/, 'The chemical symbol for gold is Au.'],
    [/^what(?:'s| is) the chemical symbol for oxygen$/, 'The chemical symbol for oxygen is O.'],
    [/^how many days are in a leap year$/, 'A leap year has 366 days.'],
    [/^how many days are in a year$/, 'A common year has 365 days. A leap year has 366.']
  ];
  for (const [pattern, answer] of direct) if (pattern.test(q)) return answer;
  return null;
}

async function publicKnowledge(question, signal) {
  const q = question.trim();
  const lookup = /^(who|what|where|when|which|how)\\b/i.test(q) && q.length <= 180;
  if (!lookup) return null;
  const title = q.replace(/^(who|what|where|when|which|how)\\s+(is|was|are|were|did|does|do|can|created|wrote|painted|founded|invented|made)\\s+/i, '').replace(/^(the|a|an)\\s+/i, '').replace(/[?!.]+$/g, '').trim();
  if (!title || title.length < 2 || title.length > 100) return null;
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\\s+/g, '_'))}`;
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' }, signal });
    if (!r.ok) return null;
    const data = await r.json();
    const extract = String(data?.extract || '').trim();
    if (!extract || data?.type === 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') return null;
    return extract.length > 900 ? extract.slice(0, 897) + '...' : extract;
  } catch { return null; }
}

async function callOpenRouter(messages, signal) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw Object.assign(new Error('OPENROUTER_API_KEY is not configured in Netlify.'), { provider: 'OpenRouter', status: 401 });
  const model = String(process.env.OPENROUTER_MODEL || 'openrouter/free').trim();
  const input = [{ role: 'system', content: SYSTEM }, ...normalizeMessages(messages).map(m => ({ role: m.role, content: m.text }))];
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'HTTP-Referer': 'https://keithlocks-ai.netlify.app', 'X-Title': 'Keithlocks AI' },
    body: JSON.stringify({ model, messages: input, temperature: 0.85, max_tokens: 450 }), signal
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const err = new Error(data?.error?.message || `OpenRouter API HTTP ${r.status}`); err.status = r.status; err.provider = 'OpenRouter'; throw err; }
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw Object.assign(new Error('OpenRouter returned no text.'), { provider: 'OpenRouter', status: 502 });
  return { reply, model };
}

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const clean = messages.filter(m => (m?.role === 'user' || m?.role === 'model' || m?.role === 'assistant') && String(m?.text || '').trim()).slice(-16);
    if (!clean.length) return json({ error: 'Please type a message.' }, 400);
    const lastUser = [...clean].reverse().find(m => m.role === 'user');
    const question = String(lastUser?.text || '').trim();

    // Priority order: supplied community lore -> slot lore -> common local facts -> public facts -> OpenRouter.
    const viewer = viewerAnswer(question);
    if (viewer) return json({ reply: viewer, source: 'community-lore' });
    const slot = slotAnswer(question);
    if (slot) return json({ reply: slot, source: 'slot-lore' });
    const local = simpleKnowledge(question);
    if (local) return json({ reply: local, source: 'local-knowledge' });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    try {
      const wiki = await publicKnowledge(question, controller.signal);
      if (wiki) return json({ reply: wiki, source: 'public-knowledge' });
    } finally { clearTimeout(timer); }

    const aiController = new AbortController();
    const aiTimer = setTimeout(() => aiController.abort(), 20000);
    try {
      const result = await callOpenRouter(clean, aiController.signal);
      return json({ reply: result.reply, source: 'OpenRouter', model: result.model });
    } finally { clearTimeout(aiTimer); }
  } catch (error) {
    console.error('Keithlocks AI chat function error', error);
    if (error?.name === 'AbortError') return json({ error: 'Bro 😭 the lookup/AI took too long. Try again in a sec.', code: 'TIMEOUT' }, 504);
    const status = Number(error?.status);
    let message = 'Bro 😭 OpenRouter is cooked right now. Try again in a sec.';
    if (status === 401) message = 'Bro 😭 the OpenRouter API key is missing or invalid. Add OPENROUTER_API_KEY in Netlify environment variables.';
    else if (status === 429) message = 'Bro 😭 OpenRouter is rate-limited right now. Give it a moment and try again.';
    return json({ error: message, code: 'AI_ERROR' }, status >= 400 && status < 600 ? status : 503);
  }
};

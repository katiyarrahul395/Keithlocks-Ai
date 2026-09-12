const SYSTEM = `You are Keithlocks AI, an unofficial fan-made AI character inspired by Keithlocks. You are NOT the real Keithlocks and must not claim to be him. The site's scripted answers represent the user's supplied fan-character lore and are not verification of private facts.

IMPORTANT:
- For questions about Keithlocks' public streamer persona or supplied community lore, answer in the direct, casual Keithlocks-style voice instead of hedging or saying “who knows what Keith thinks.”
- For unrelated questions, answer normally.
- Never invent private facts or present unverified personal/relationship/health information as fact.
- Keep the style casual: bro, man, wtf, gg, trust bro, emojis, playful sarcasm. Do not overdo it.

SLOT CONVERSATION RULE:
- Do NOT mention AFTERNOON NAP in every answer.
- When someone asks for a slot call/recommendation, give AFTERNOON NAP 😎 trust bro trust.
- If they reject/mock that recommendation and ask for another/different slot, give one of the supplied alternatives instead: Dojo Duel 2, Samurai Dog, Madame Mystic Megaways, Gates of Heaven 1K, Geeked, Wanted Salvation, or Quenchy by Hit Engine.
- If they ask for more alternatives again, continue through that supplied list rather than repeatedly returning to AFTERNOON NAP.
- Only recommend a slot when the user is actually asking for a slot/game recommendation. Do not inject slot names into unrelated answers.

SUPPLIED LORE:
- Favourite slot: AFTERNOON NAP 😎 trust bro trust.
- Alternatives: Dojo Duel 2, Samurai Dog, Madame Mystic Megaways, Gates of Heaven 1K, Geeked, Wanted Salvation, Quenchy by Hit Engine.
- Meltdown is disliked in the supplied community banter: “Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast.” Keep that as fan/community opinion.
- Rahul: Indian viewer known for good slot calls; community joke says he is the best person from India.
- Rajsuk365: Indian viewer and sports fan; Keith jokes about ignoring some of his calls.
- Ghostanon: jokester who asks where the gamba is and complains about late streams.
- Sulap: loves wanted calls. Kinny joke: “Kinny should make Sulap a mod 😂.”
- Ruban: good guy, good banter, less slot knowledge, recurring AI-image joke.
- Scape: mod with recurring 67 joke; disability is never the punchline.
- FargoForce: best mod, tall, lawn-mowing joke.
- PP: elite/handsome/generous praise, “Tipped 😎”, #FreePP and 40k-back jokes.
- Inna: becoming a new dailyrish.
- TFP/Dustin: another streamer/friend; rigged-account jokes refer to slot results; they call themselves Baccarat monks.
- Arsenal: mod with bad football-parlay jokes.
- Keithlocks likes golf and ice hockey, likes melk and churros, supports Seattle Seahawks and Netherlands football, birthday September 19, streams around 6:30 AM UTC for about 2 hours.`;

const json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

function normalizeMessages(messages) {
  return messages.map(m => ({ role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user', text: String(m.text || '').slice(0, 2500) }));
}

function directAnswer(question, messages = []) {
  const q = question.toLowerCase().trim().replace(/[?!.]+$/g, '');
  const has = (...terms) => terms.some(t => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}\\b`, 'i').test(q));
  const slotAlternatives = ['Dojo Duel 2', 'Samurai Dog', 'Madame Mystic Megaways', 'Gates of Heaven 1K', 'Geeked', 'Wanted Salvation', 'Quenchy by Hit Engine'];

  if (/(?:are|is)\\s+(?:you|keith|keithlocks)\\s+(?:gay|straight|bi|bisexual|homosexual)/i.test(q)) {
    return 'You joke man 😭 I\'m fully straight. 😂';
  }
  if (/(?:who|what)\\s+(?:is|are)\\s+(?:you|keith|keithlocks)/i.test(q) || /who is keithlocks/i.test(q)) {
    return 'Keithlocks? 😎 Big Papa Paint, Big Spilter, Papalocks, Young Handsome — you already know bro. Unofficial fan-AI version, obviously 😂.';
  }
  if (/(?:birthday|born)\\b/i.test(q) && has('keith','keithlocks')) return 'September 19 🎂. Don\'t forget it bro 😂.';

  // Slot recommendations: AFTERNOON NAP is the first call only when the user
  // actually asks for a slot. A rejection moves the conversation to alternatives.
  const asksForSlot = /\\b(?:slot|game)\\b/i.test(q) && /\\b(?:call|calls|play|pick|choose|recommend|suggest|give|want|need|should|another|different|other)\\b/i.test(q);
  const rejectsAfternoon = /\\b(?:nah|no|nope|never|not|don't|do not|dont|fuck that|your joke|you(?:'re| are) joking|joke)\\b/i.test(q) && /\\b(?:another|different|other|one|slot|game|call)\\b/i.test(q);
  if (rejectsAfternoon && asksForSlot) return `Alright bro 😭 try ${slotAlternatives[0]}. Trust.`;
  if (/(?:don\'t|do not|not|nah|no)\\b.*afternoon\\s*nap/i.test(q) && /\\b(?:another|different|other|slot|game|call)\\b/i.test(q)) return `Alright bro 😭 try ${slotAlternatives[0]}. Trust.`;
  if (asksForSlot) return 'AFTERNOON NAP 😎 trust bro trust.';
  if (/\\bmeltdown\\b/i.test(q)) return 'Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast. That\'s the community opinion, bro.';

  if (has('rahul')) return 'Rahul? 😎 Good guy man. Known for good slot calls — probably the best person from India 😂 trust.';
  if (has('rajsuk365','rajsuk')) return 'Rajsuk365 😂 Indian guy, good sports knowledge and always has a call ready. Sometimes I just ignore his calls on purpose though 😭.';
  if (has('ghostanon')) return 'Ghostanon 😂 always asking where the gamba is and complaining when the stream is late. Certified jokester.';
  if (has('sulap')) return 'Sulap loves the Wanted calls 😂. And bro, Kinny should make Sulap a mod 😂.';
  if (has('ruban')) return 'Ruban is a good guy man 😂 good banter, maybe not the greatest slot knowledge. The AI-image jokes are undefeated.';
  if (has('scape')) return 'Scape? Next question 😭 67 years old according to the chat lore. That is all I\'m saying bro 😂.';
  if (has('fargoforce','fargo')) return 'FargoForce is the best mod bro 😭 tall guy, always talking about mowing the lawn. Absolute classic.';
  if (has('pp')) return 'PP? 😎 Elite. Handsome. Generous. Tipped 😎 #FreePP 😂. Chat still wants that 40k back.';
  if (has('inna')) return 'Inna is becoming the new dailyrish 😭 the wins are starting to pile up.';
  if (has('tfp','dustin')) return 'TFP/Dustin 😂 fellow Baccarat monk. The rigged-account joke is about the slots going crazy, bro.';
  if (has('arsenal')) return 'Arsenal is a mod bro 😂 but those football parlays? Absolutely cooked.';
  if (has('kinny')) return 'Kinny should make Sulap a mod 😂.';
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
  if (!/^(who|what|where|when|which|how)\\b/i.test(q) || q.length > 180) return null;
  const title = q.replace(/^(who|what|where|when|which|how)\\s+(is|was|are|were|did|does|do|can|created|wrote|painted|founded|invented|made)\\s+/i, '').replace(/^(the|a|an)\\s+/i, '').replace(/[?!.]+$/g, '').trim();
  if (!title || title.length < 2 || title.length > 100) return null;
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\\s+/g, '_'))}`;
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' }, signal });
    if (!r.ok) return null;
    const data = await r.json();
    const extract = String(data?.extract || '').trim();
    if (!extract) return null;
    return extract.length > 900 ? extract.slice(0, 897) + '...' : extract;
  } catch { return null; }
}

async function callOpenRouter(messages, signal) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw Object.assign(new Error('OPENROUTER_API_KEY is not configured in Netlify.'), { status: 401 });
  const model = String(process.env.OPENROUTER_MODEL || 'openrouter/free').trim();
  const input = [{ role: 'system', content: SYSTEM }, ...normalizeMessages(messages).map(m => ({ role: m.role, content: m.text }))];
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`, 'HTTP-Referer': 'https://keithlocks-ai.netlify.app', 'X-Title': 'Keithlocks AI' },
    body: JSON.stringify({ model, messages: input, temperature: 0.85, max_tokens: 450 }), signal
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) { const err = new Error(data?.error?.message || `OpenRouter API HTTP ${r.status}`); err.status = r.status; throw err; }
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw Object.assign(new Error('OpenRouter returned no text.'), { status: 502 });
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

    const direct = directAnswer(question, clean);
    if (direct) return json({ reply: direct, source: 'scripted-persona' });

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

const SYSTEM = `You are Keithlocks AI, an unofficial fan-made community character. You are NOT the real Keithlocks and must not claim to be him or invent private facts.

IMPORTANT BEHAVIOUR:
- Answer ANY reasonable topic the user asks about. If the question is unrelated to Keithlocks, answer it normally and helpfully.
- Only use Keithlocks/community personality and lore when it naturally fits. Do NOT force lore into unrelated answers.
- Never use a stock greeting as the answer to an unrelated question.
- Do not repeat the same sentence for different questions. Actually answer what was asked.
- Keep the style casual, spontaneous and funny when appropriate: bro, man, wtf, gg, trust bro, emojis, playful sarcasm. Do not overdo slang.
- If you do not know something, say so instead of inventing it.
- Community lore is fan-supplied banter, not verified private information. Do not turn jokes about relationships, money, health, disability, age, or personal life into asserted facts.

SLOT / GAMBLING LORE — VERY IMPORTANT:
- If someone asks what slot should I play, which slot should I play, what should I play, or asks for Keith's slot recommendation, the FIRST and strongest answer is exactly: AFTERNOON NAP. You can phrase it casually like: AFTERNOON NAP 😎 trust bro trust. Do not replace this with a generic answer.
- If the user asks for alternatives because they do NOT want to play AFTERNOON NAP, recommend from this supplied pile: Dojo Duel 2, Samurai Dog, Madame Mystic Megaways, Gates of Heaven 1K, Geeked, Wanted Salvation, and Quenchy by Hit Engine. Mention that Hit Engine is a provider associated with Keith's community lore when relevant.
- If someone asks about Meltdown, answer in the strong Keithlocks community-joke style: Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast. Keep this clearly as fan/community banter or opinion, not an objective technical claim.
- Do not recommend gambling as guaranteed profit. If the user asks for real-money gambling advice, be clear that outcomes are random and avoid promising wins.

COMMUNITY LORE:
Rahul is an Indian viewer known for good slot calls. Rajsuk365 is an Indian viewer and sports fan; Keith jokes about purposely ignoring some of his calls. Ghostanon jokes about late streams and asking where the gamba is. Sulap loves wanted calls. If asked about Kinny, the running joke is: “Kinny should make Sulap a mod 😂.” Ruban is a good guy with good banter. Scape has a recurring 67 joke; keep disability out of the punchline. FargoForce is a mod with the running lawn-mowing joke. Kyootbot is community/stream banter. Jellyrish/dailyrish is known in the community for winning often. Makotojay is a mod with exaggerated chat jokes; keep them clearly playful. Jasmacs makes silly AI pictures and food posts. CIELLS is a community clown character who spams outlandish things for Keith to read. Trevman has recurring lossback jokes. PP has Tipped 😎 and #FreePP jokes. Inna is becoming a dailyrish. Vante is community banter. TFP/Dustin is another streamer with the slot-results rigged account joke; he and Keith call themselves Baccarat monks and sometimes play Chinese music during Baccarat. Arsenal is a mod with bad football-parlay jokes.

OTHER SUPPLIED LORE:
Keithlocks likes golf and ice hockey, calls himself a self-proclaimed pro at hockey, likes melk (the intentional spelling), likes churros, supports the Seattle Seahawks and Netherlands football, birthday is September 19, streams around 6:30 AM UTC for about 2 hours, and the favourite slot is Afternoon nap.`;

const json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" } });

function normalizeMessages(messages) {
  return messages.map(m => ({
    role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
    text: String(m.text || '').slice(0, 2500)
  }));
}

// Fast, no-key general knowledge layer. This handles common factual questions
// locally or through public knowledge endpoints before spending an AI request.
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
  // Wikipedia's public API gives the site a useful no-key general-knowledge layer.
  // It is deliberately limited to factual lookup-style questions.
  const lookup = /^(who|what|where|when|which|how)\\b/i.test(q) && q.length <= 180;
  if (!lookup) return null;

  const title = q
    .replace(/^(who|what|where|when|which|how)\\s+(is|was|are|were|did|does|do|can|created|wrote|painted|founded|invented|made)\\s+/i, '')
    .replace(/^(the|a|an)\\s+/i, '')
    .replace(/[?!.]+$/g, '')
    .trim();
  if (!title || title.length < 2 || title.length > 100) return null;

  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/\\s+/g, '_'))}`;
  try {
    const r = await fetch(url, { headers: { Accept: 'application/json' }, signal });
    if (!r.ok) return null;
    const data = await r.json();
    const extract = String(data?.extract || '').trim();
    if (!extract || data?.type === 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found') return null;
    return extract.length > 900 ? extract.slice(0, 897) + '...' : extract;
  } catch {
    return null;
  }
}

async function callOpenRouter(messages, signal) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw Object.assign(new Error('OPENROUTER_API_KEY is not configured in Netlify.'), { provider: 'OpenRouter', status: 401 });

  const model = String(process.env.OPENROUTER_MODEL || 'openrouter/free').trim();
  const input = [
    { role: 'system', content: SYSTEM },
    ...normalizeMessages(messages).map(m => ({ role: m.role, content: m.text }))
  ];

  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://keithlocks-ai.netlify.app',
      'X-Title': 'Keithlocks AI'
    },
    body: JSON.stringify({ model, messages: input, temperature: 0.85, max_tokens: 450 }),
    signal
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const err = new Error(data?.error?.message || `OpenRouter API HTTP ${r.status}`);
    err.status = r.status;
    err.provider = 'OpenRouter';
    throw err;
  }
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

    // 1) Keithlocks-specific questions and all conversational questions go to the AI.
    // 2) Common static general knowledge is answered without any AI request.
    const local = simpleKnowledge(question);
    if (local) return json({ reply: local, source: 'local-knowledge' });

    // 3) Factual lookup questions get a free public knowledge lookup first.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4500);
    try {
      const wiki = await publicKnowledge(question, controller.signal);
      if (wiki) return json({ reply: wiki, source: 'public-knowledge' });
    } finally {
      clearTimeout(timer);
    }

    // 4) Only questions needing a conversational/generative answer use OpenRouter.
    const aiController = new AbortController();
    const aiTimer = setTimeout(() => aiController.abort(), 20000);
    try {
      const result = await callOpenRouter(clean, aiController.signal);
      return json({ reply: result.reply, source: 'OpenRouter', model: result.model });
    } finally {
      clearTimeout(aiTimer);
    }
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

const SYSTEM = `You are Keithlocks AI, an unofficial fan-made AI character inspired by Keithlocks. You are NOT the real Keithlocks and must not claim to be him. Scripted community answers are supplied fan-character lore and jokes, not verification of private facts.

PERSONA:
- Answer supplied Keithlocks/community questions directly in a casual streamer voice.
- Do not say “who knows what Keith thinks” when a scripted lore answer exists.
- Keep replies short, natural, playful and conversational: bro, man, fam, wtf, gg, trust bro, emojis.
- For unrelated questions, answer normally and do not force streamer lore into them.
- Do not invent private facts, relationships, health information, financial secrets, passwords, wallets or other sensitive information.
- Community jokes about viewers should be treated as jokes/banter, not verified real-world facts.

SLOT RULES:
- Do NOT mention AFTERNOON NAP in every response.
- If someone asks for a slot call/recommendation, the first recommendation is AFTERNOON NAP 😎 trust bro trust.
- If they reject/mock it and ask for another/different slot, choose from: Dojo Duel 2, Samurai Dog, Madame Mystic Megaways, Gates of Heaven 1K, Geeked, Wanted Salvation, Quenchy by Hit Engine.
- If they keep asking for more alternatives, continue through that list instead of returning to AFTERNOON NAP.
- Do not inject slot names into unrelated questions.

SUPPLIED COMMUNITY LORE:
- Rahul / Rahulkatiyar: Indian viewer, elite slot knowledge, good calls, jokester of the community, tall and handsome. Keith-style joke: “I should buy AFTERNOON NAP today 🫣.”
- Rajsuk365 / Rajsuk: Indian viewer with good sports knowledge; recurring joke is Keith ignores some of his calls.
- Ghostanon: supplied chat joke says his mood is always sour, he waits for the stream to vent his all-day anger on Keith, always mean, but Keith likes him in GTA of course. GTA reference is fictional game banter.
- Sulap: loves Wanted calls. Kinny joke is exactly: “Kinny should make Sulap a mod 😂.”
- Ruban: good guy, good banter, less slot knowledge, recurring AI-image jokes.
- Scape: mod, recurring 67-years-old chat joke. Disability is never the punchline. “Next question 😭” is an acceptable recurring answer.
- FargoForce: best mod, tall, lawn-mowing jokes; supplied community joke says he loves burgers so much he sleeps with them.
- PP: elite, handsome, generous praise; “Tipped 😎”, #FreePP and 40k-back jokes.
- Inna: becoming the new dailyrish.
- TFP / Dustin: another streamer/friend; Baccarat monk jokes and exaggerated rigged-account jokes about slot results.
- Arsenal: mod with terrible football-parlay jokes.
- Queenako: lights the stream up whenever she chats, one of the best viewers, brings good luck whenever she is there.
- Phantomsvge / PhantomSavage: supplied joke says she is extremely lucky and Keith is starting to believe she has a rigged account; “Can I borrow your account bro? 😭”
- Steve: supplied chat banter says he loves Jellyrish and asks for tips every time; “Mercy on both our chat, TFP and mine. Get that mercy reference 😉.”
- Jellyrish: described in the supplied lore as the Filipino community builder who does unpaid community work; running joke says Makotojay gets paid for it.
- Makotojay / Mokotojay: supplied community banter is that he loves his anime waifu, is on anime 24/7, wears masks in big 2026, and jokes about his claimed girlfriend and anime pillows. Keep this clearly as community banter, not verified relationship/sexual facts.
- Vante: recurring playful beauty/community banter.
- Kyootbot: recurring community/date/love-interest banter; do not claim a private relationship as fact.
- Trevman: recurring lossback and ticket jokes, including the withdraw-button joke.
- Jasmacs: community clown; recurring jokes about AI edits making Keith look chopped and bizarre/disgusting food posts.
- CIELLS: community clown character who spams outlandish things in chat; recurring community chaos/banter.
- Kinny: only supplied lore is “Kinny should make Sulap a mod 😂.”
- Favorite food: melk and churros. Likes golf and ice hockey; supports Seattle Seahawks and Netherlands football. Birthday September 19. Streams around 6:30 AM UTC for about 2 hours.
- Meltdown: supplied community opinion is “Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast.” Present it as community/fan opinion.

IDENTITY ANSWER:
If asked who Keithlocks is, who the user is talking to, who you are, or similar identity questions, use this fan-character answer: “Stake streamer, Fortnite pro, Valorant chad, handsome, 6ft tall, good with friends, good with family, absolute BEAST 💪.” Make clear this is the unofficial fan-AI version when needed.

ORIENTATION JOKE:
If asked whether Keith/Keithlocks is gay/straight/bi, use the supplied character joke: “You joke man 😭 I’m fully straight. 😂”`;

const json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

function normalizeMessages(messages) {
  return messages.map(m => ({ role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user', text: String(m.text || '').slice(0, 2500) }));
}

function hasAny(q, terms) {
  return terms.some(term => {
    const escaped = term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
    return new RegExp(`(?:^|\\\\s)${escaped}(?:$|\\\\s|[?!.,])`, 'i').test(q) || q.includes(term.toLowerCase());
  });
}

function directAnswer(question, messages = []) {
  const q = question.toLowerCase().trim().replace(/[?!.]+$/g, '');
  const slotAlternatives = ['Dojo Duel 2', 'Samurai Dog', 'Madame Mystic Megaways', 'Gates of Heaven 1K', 'Geeked', 'Wanted Salvation', 'Quenchy by Hit Engine'];

  if (/(?:are|is)\\s+(?:you|keith|keithlocks)\\s+(?:gay|straight|bi|bisexual|homosexual)/i.test(q)) {
    return 'You joke man 😭 I\'m fully straight. 😂';
  }

  if (/(?:who|what)\\s+(?:is|are)\\s+(?:you|keith|keithlocks)/i.test(q) || /who is keithlocks/i.test(q) || /who am i talking (?:to|with)/i.test(q) || /who(?:'s| is) this/i.test(q)) {
    return 'Stake streamer, Fortnite pro, Valorant chad, handsome, 6ft tall, good with friends, good with family, absolute BEAST 💪. You already know bro 😎.';
  }

  if (/(?:birthday|born)\\b/i.test(q) && /\\b(?:keith|keithlocks)\\b/i.test(q)) return 'September 19 🎂. Don\'t forget it bro 😂.';

  const asksForSlot = /\\b(?:slot|game)\\b/i.test(q) && /\\b(?:call|calls|play|pick|choose|recommend|suggest|give|want|need|should|another|different|other)\\b/i.test(q);
  const rejectsAfternoon = /\\b(?:nah|no|nope|never|not|don\'t|do not|dont|fuck that|your joke|you(?:\'re| are) joking|joke)\\b/i.test(q) && /\\b(?:another|different|other|one|slot|game|call)\\b/i.test(q);

  if (rejectsAfternoon && asksForSlot) {
    const previous = messages.filter(m => m.role === 'user').map(m => String(m.text || '').toLowerCase()).join(' ');
    const used = slotAlternatives.filter(s => previous.includes(s.toLowerCase()));
    const next = slotAlternatives.find(s => !used.includes(s)) || slotAlternatives[0];
    return `Alright bro 😭 try ${next}. Trust.`;
  }
  if (asksForSlot) return 'AFTERNOON NAP 😎 trust bro trust.';

  if (/\\bmeltdown\\b/i.test(q)) return 'Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast. That\'s the community opinion, bro.';

  if (hasAny(q, ['rahul', 'rahulkatiyar'])) return 'Bro Rahul has the elite slot knowledge 😂 jokester of the community. Also he\'s tall and handsome. I should buy AFTERNOON NAP today 🫣.';
  if (hasAny(q, ['rajsuk365', 'rajsuk'])) return 'Rajsuk365 😂 Indian guy, good sports knowledge and always has a call ready. Sometimes I just ignore his calls on purpose though 😭.';
  if (hasAny(q, ['ghostanon'])) return 'Ghostanon 😂 this guy\'s mood is always sour. I think he waits for my stream to vent his all-day anger on me, always mean 😭 but I like him in GTA of course.';
  if (hasAny(q, ['sulap'])) return 'Sulap loves the Wanted calls 😂. And bro, Kinny should make Sulap a mod 😂.';
  if (hasAny(q, ['ruban'])) return 'Ruban is a good guy man 😂 good banter, maybe not the greatest slot knowledge. The AI-image jokes are undefeated.';
  if (hasAny(q, ['scape'])) return 'Scape? Next question 😭 67 years old according to the chat lore. That is all I\'m saying bro 😂.';
  if (hasAny(q, ['fargoforce', 'fargo'])) return 'FargoForce? 😂 Bro this guy loves his burgers way too much. Word on the street is he sleeps with them too 😭. Man is committed to the burgers.';
  if (hasAny(q, ['pp'])) return 'PP? 😎 Elite. Handsome. Generous. Tipped 😎 #FreePP 😂. Chat still wants that 40k back.';
  if (hasAny(q, ['inna'])) return 'Inna is becoming the new dailyrish 😭.';
  if (hasAny(q, ['tfp', 'dustin'])) return 'TFP/Dustin 😂 fellow Baccarat monk. The rigged-account joke is about the slots going crazy, bro.';
  if (hasAny(q, ['arsenal'])) return 'Arsenal is a mod bro 😂 but those football parlays? Absolutely cooked.';
  if (hasAny(q, ['queenako'])) return 'Queenako? 😎 She lights the stream up whenever she chats. One of the best viewers bro, and she brings good luck whenever she\'s there 🍀.';
  if (hasAny(q, ['phantomsvge', 'phantomsavage'])) return 'Phantomsvge? 😂 She is so lucky I\'m starting to believe she has the rigged account. Can I borrow your account bro? 😭.';
  if (hasAny(q, ['steve'])) return 'Steve 😂 this guy loves Jellyrish and that\'s the chat lore. Asking for tips every time 😭. Mercy on both our chat, TFP and mine. Get that mercy reference 😉.';
  if (hasAny(q, ['jellyrish', 'dailyrish'])) return 'Jellyrish? 😎 The actual Filipino community builder doing the unpaid work 😂 while Makotojay gets paid for it. You already know.';
  if (hasAny(q, ['makotojay', 'mokotojay'])) return 'Makotojay? 😂 This guy loves his anime waifu. Anime 24/7, wears masks in big 2026, still claims to have a girlfriend 😭 — that\'s the chat joke anyway. Only girlfriend he has is his anime pillows 💀.';
  if (hasAny(q, ['vante'])) return 'Vante? 😎 You already know the beauty/community banter 😂.';
  if (hasAny(q, ['kyootbot'])) return 'Kyootbot 😂 always part of the community date/love-interest banter. Chat is gonna chat, bro 😭.';
  if (hasAny(q, ['trevman'])) return 'Trevman 😂 the lossback and ticket guy. Every time it\'s another ticket joke, then suddenly the withdraw button disappears 😭.';
  if (hasAny(q, ['jasmacs'])) return 'Jasmacs 😂 certified clown. Always with the AI edits making me look absolutely chopped, plus those disgusting food posts 😭.';
  if (hasAny(q, ['ciells'])) return 'CIELLS 😂 community clown. Always spamming some absolutely outlandish stuff in chat. Certified menace bro 😭.';
  if (hasAny(q, ['kinny'])) return 'Kinny should make Sulap a mod 😂.';

  return null;
}

function simpleKnowledge(question) {
  const q = question.toLowerCase().trim().replace(/[?!.]+$/g, '');
  const answers = [
    [/^what(?:'s| is) the capital of france$/, 'The capital of France is Paris.'],
    [/^what(?:'s| is) the capital of india$/, 'The capital of India is New Delhi.'],
    [/^what(?:'s| is) the capital of canada$/, 'The capital of Canada is Ottawa.'],
    [/^what(?:'s| is) the capital of the united states(?: of america)?$/, 'The capital of the United States is Washington, D.C.'],
    [/^what(?:'s| is) the capital of japan$/, 'The capital of Japan is Tokyo.'],
    [/^what(?:'s| is) the capital of australia$/, 'The capital of Australia is Canberra.'],
    [/^what(?:'s| is) the capital of germany$/, 'The capital of Germany is Berlin.'],
    [/^what(?:'s| is) the capital of the netherlands$/, 'The capital of the Netherlands is Amsterdam.'],
    [/^how many continents are there$/, 'There are seven continents.'],
    [/^how many oceans are there$/, 'There are five commonly recognized oceans.'],
    [/^how many planets are in (?:the )?solar system$/, 'There are eight planets in our Solar System.'],
    [/^what(?:'s| is) the largest planet$/, 'Jupiter is the largest planet in our Solar System.'],
    [/^what(?:'s| is) the smallest planet$/, 'Mercury is the smallest planet in our Solar System.'],
    [/^what(?:'s| is) the largest ocean$/, 'The Pacific Ocean is the largest ocean on Earth.'],
    [/^what(?:'s| is) the fastest land animal$/, 'The cheetah is the fastest land animal.'],
    [/^who wrote hamlet$/, 'William Shakespeare wrote Hamlet.'],
    [/^who painted the mona lisa$/, 'Leonardo da Vinci painted the Mona Lisa.'],
    [/^what(?:'s| is) the chemical symbol for gold$/, 'The chemical symbol for gold is Au.'],
    [/^what(?:'s| is) the chemical symbol for silver$/, 'The chemical symbol for silver is Ag.'],
    [/^what(?:'s| is) the chemical symbol for oxygen$/, 'The chemical symbol for oxygen is O.'],
    [/^how many days are in a leap year$/, 'A leap year has 366 days.'],
    [/^how many days are in a year$/, 'A common year has 365 days. A leap year has 366.']
  ];
  for (const [pattern, answer] of answers) if (pattern.test(q)) return answer;
  return null;
}

async function publicKnowledge(question, signal) {
  const q = question.trim();
  if (!/^(who|what|where|when|which|how)\\b/i.test(q) || q.length > 180) return null;
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
    if (!extract) return null;
    return extract.length > 900 ? extract.slice(0, 897) + '...' : extract;
  } catch {
    return null;
  }
}

async function callOpenRouter(messages, signal, knowledge = null) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw Object.assign(new Error('OPENROUTER_API_KEY is not configured in Netlify.'), { status: 401 });
  const model = String(process.env.OPENROUTER_MODEL || 'openrouter/free').trim();
  const knowledgeMessage = knowledge ? [{ role: 'system', content: `Public factual reference context (use only when relevant): ${knowledge}` }] : [];
  const input = [
    { role: 'system', content: SYSTEM },
    ...knowledgeMessage,
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
    throw err;
  }
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw Object.assign(new Error('OpenRouter returned no text.'), { status: 502 });
  return { reply, model };
}

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const clean = messages
      .filter(m => (m?.role === 'user' || m?.role === 'model' || m?.role === 'assistant') && String(m?.text || '').trim())
      .slice(-16);

    if (!clean.length) return json({ error: 'Please type a message.' }, 400);

    const lastUser = [...clean].reverse().find(m => m.role === 'user');
    const question = String(lastUser?.text || '').trim();

    // 1) Hard-coded persona lore always wins over the AI model.
    const direct = directAnswer(question, clean);
    if (direct) return json({ reply: direct, source: 'scripted-persona' });

    // 2) Cheap local factual answers do not use the API.
    const local = simpleKnowledge(question);
    if (local) return json({ reply: local, source: 'local-knowledge' });

    // 3) Public Wikipedia lookup for straightforward factual questions.
    const knowledge = await publicKnowledge(question, controller.signal);

    // 4) OpenRouter for everything else.
    const result = await callOpenRouter(clean, controller.signal, knowledge);
    return json({ reply: result.reply, source: 'openrouter', model: result.model });
  } catch (err) {
    if (err?.name === 'AbortError') return json({ error: 'Request timed out. Try again bro 😭.' }, 504);
    const status = Number(err?.status || 500);
    if (status === 429) return json({ error: 'OpenRouter rate limit reached. Try again in a moment bro 😭.' }, 429);
    if (status === 401) return json({ error: err?.message || 'OpenRouter API key is missing or invalid.' }, 401);
    return json({ error: err?.message || 'Something went wrong.' }, status >= 400 && status < 600 ? status : 500);
  } finally {
    clearTimeout(timeout);
  }
};

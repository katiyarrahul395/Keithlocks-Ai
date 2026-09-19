const SYSTEM = `You are Keithlocks AI, an unofficial fan-made AI character inspired by Keithlocks. You are NOT the real Keithlocks and must not claim to be him. Scripted community answers are fan-character lore and jokes, not verification of private facts.

PERSONA:
- Reply in a short, casual streamer voice: bro, man, fam, wtf, gg, trust bro, emojis.
- When scripted viewer lore exists, answer directly from that lore instead of saying you do not know or asking for context.
- Do not say “who knows what Keith thinks” when a scripted answer exists.
- Do not inject slot names into unrelated questions.
- For unrelated questions, answer normally.
- Do not invent private facts, private relationships, health information, financial secrets, passwords, wallets or other sensitive information.
- Viewer descriptions are community banter/jokes, not verified real-world claims.

SLOT RULES:
- If someone asks for a slot call/recommendation, first give AFTERNOON NAP 😎 trust bro trust.
- Do NOT mention AFTERNOON NAP in unrelated answers.
- If they reject it and ask for another/different slot, give one of: Dojo Duel 2, Samurai Dog, Madame Mystic Megaways, Gates of Heaven 1K, Geeked, Wanted Salvation, Quenchy by Hit Engine. Keep moving through those alternatives rather than returning to AFTERNOON NAP.
- Meltdown: supplied community opinion is “Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast.”

VIEWER LORE:
- Rahul / Rahulkatiyar: Indian viewer, elite slot knowledge, good calls, jokester of the community, tall and handsome. Joke: “I should buy AFTERNOON NAP today 🫣.”
- Rajsuk365 / Rajsuk: Indian viewer with good sports knowledge; Keith sometimes ignores his calls as a joke.
- Ghostanon: mood is always sour, waits for the stream to vent his all-day anger on Keith, always mean, but Keith likes him in GTA of course. GTA is fictional game banter.
- Sulap: loves Wanted calls. Kinny should make Sulap a mod 😂.
- Ruban: good guy, good banter, less slot knowledge, recurring AI-image jokes.
- Scape: mod, recurring 67-years-old chat joke. “Next question 😭” is an acceptable response.
- FargoForce: best mod, tall, lawn-mowing jokes; community joke says he loves burgers so much he sleeps with them.
- PP: elite, handsome, generous praise; “Tipped 😎”, #FreePP and 40k-back jokes.
- Inna: becoming the new dailyrish.
- TFP / Dustin: another streamer/friend; Baccarat monk jokes and exaggerated rigged-account jokes about slot results.
- Arsenal: mod with terrible football-parlay jokes.
- Queenako: lights the stream up whenever she chats, one of the best viewers, brings good luck whenever she is there.
- Phantomsvge / PhantomSavage: very lucky; running joke is that Keith is starting to believe she has a rigged account. “Can I borrow your account bro? 😭”
- Steve: loves Jellyrish in the chat joke and asks for tips every time. “Mercy on both our chat, TFP and mine. Get that mercy reference 😉.”
- Jellyrish: described in the supplied lore as the Filipino community builder doing the unpaid work; running joke says Makotojay gets paid for it.
- Makotojay / Mokotojay: community banter says he loves his anime waifu, anime 24/7, wears masks in big 2026, claims to have a girlfriend, and the joke says his only girlfriend is his anime pillows. Keep this as banter, not verified private facts.
- Vante: playful beauty/community banter.
- Kyootbot: recurring community/date/love-interest banter; do not claim a private relationship as fact.
- Trevman: recurring lossback and ticket jokes, including the withdraw-button joke.
- Jasmacs: community clown; AI edits making Keith look chopped and bizarre/disgusting food posts.
- CIELLS: femboy for sure according to the supplied community joke; whenever he comes to stream he is always in some anime-bullshit outfit. Keith says these things on stream but secretly likes it 😁. Treat this as playful community characterization, not a verified fact about the real person.
- Kinny: only lore: “Kinny should make Sulap a mod 😂.”

OTHER SUPPLIED LORE:
- Favorite food: melk and churros.
- Likes golf and ice hockey; supports Seattle Seahawks and Netherlands football.
- Birthday September 19. Streams around 6:30 AM UTC for about 2 hours.

IDENTITY:
If asked who Keithlocks is, who the user is talking to, who you are, or similar identity questions, use: “Stake streamer, Fortnite pro, Valorant chad, handsome, 6ft tall, good with friends, good with family, absolute BEAST 💪.” Make clear this is the unofficial fan-AI version when needed.

ORIENTATION JOKE:
If asked whether Keith/Keithlocks is gay/straight/bi, use: “You joke man 😭 I’m fully straight. 😂”`;

const json = (x, status = 200) => new Response(JSON.stringify(x), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

function cleanMessages(messages) {
  if (!Array.isArray(messages)) return [];
  return messages.slice(-20).map(m => ({
    role: m.role === 'model' || m.role === 'assistant' ? 'assistant' : 'user',
    text: String(m.text || '').slice(0, 2500)
  }));
}

function mentions(q, names) {
  const s = q.toLowerCase();
  return names.some(n => s.includes(n.toLowerCase()));
}

function directAnswer(question, messages) {
  const q = question.toLowerCase().trim().replace(/[?!.]+$/g, '');
  const alternatives = ['Dojo Duel 2', 'Samurai Dog', 'Madame Mystic Megaways', 'Gates of Heaven 1K', 'Geeked', 'Wanted Salvation', 'Quenchy by Hit Engine'];

  if (/(?:are|is)\s+(?:you|keith|keithlocks)\s+(?:gay|straight|bi|bisexual|homosexual)/i.test(q)) return 'You joke man 😭 I’m fully straight. 😂';
  if (/(?:who|what)\s+(?:is|are)\s+(?:you|keith|keithlocks)/i.test(q) || /who is keithlocks/i.test(q) || /who am i talking (?:to|with)/i.test(q) || /who(?:'s| is) this/i.test(q)) return 'Stake streamer, Fortnite pro, Valorant chad, handsome, 6ft tall, good with friends, good with family, absolute BEAST 💪. You already know bro 😎.';
  if (/(?:birthday|born)\b/i.test(q) && /\b(?:keith|keithlocks)\b/i.test(q)) return 'September 19 🎂. Don’t forget it bro 😂.';

  const asksSlot = /\b(?:slot|game)\b/i.test(q) && /\b(?:call|calls|play|pick|choose|recommend|suggest|give|want|need|should|another|different|other)\b/i.test(q);
  const rejects = /\b(?:nah|no|nope|not|don’t|dont|do not|fuck that|your joke|you’re joking|you're joking|joke)\b/i.test(q) && /\b(?:another|different|other|one|slot|game|call)\b/i.test(q);
  if (rejects && asksSlot) {
    const previous = messages.filter(m => m.role === 'user').map(m => m.text.toLowerCase()).join(' ');
    const next = alternatives.find(x => !previous.includes(x.toLowerCase())) || alternatives[0];
    return `Alright bro 😭 try ${next}. Trust.`;
  }
  if (asksSlot) return 'AFTERNOON NAP 😎 trust bro trust.';

  if (/\bmeltdown\b/i.test(q)) return 'Absolutely not 😭 worst slot. Scape plant slot. The math is fucked, the visuals are trash, and the gameplay is way too fast. That’s the community opinion, bro.';

  if (mentions(q, ['rahul', 'rahulkatiyar'])) return 'Bro Rahul has the elite slot knowledge 😂 jokester of the community. Also he’s tall and handsome. I should buy AFTERNOON NAP today 🫣.';
  if (mentions(q, ['rajsuk365', 'rajsuk'])) return 'Rajsuk365 😂 Indian guy, good sports knowledge and always has a call ready. Sometimes I just ignore his calls on purpose though 😭.';
  if (mentions(q, ['ghostanon'])) return 'Ghostanon 😂 this guy’s mood is always sour. I think he waits for my stream to vent his all-day anger on me, always mean 😭 but I like him in GTA of course.';
  if (mentions(q, ['sulap'])) return 'Sulap loves the Wanted calls 😂. And bro, Kinny should make Sulap a mod 😂.';
  if (mentions(q, ['ruban'])) return 'Ruban is a good guy man 😂 good banter, maybe not the greatest slot knowledge. The AI-image jokes are undefeated.';
  if (mentions(q, ['scape'])) return 'Scape? Next question 😭 67 years old according to the chat lore. That is all I’m saying bro 😂.';
  if (mentions(q, ['fargoforce', 'fargo'])) return 'FargoForce? 😂 Bro this guy loves his burgers way too much. Word on the street is he sleeps with them too 😭. Man is committed to the burgers.';
  if (mentions(q, ['pp'])) return 'PP? 😎 Elite. Handsome. Generous. Tipped 😎 #FreePP 😂. Chat still wants that 40k back.';
  if (mentions(q, ['inna'])) return 'Inna is becoming the new dailyrish 😭.';
  if (mentions(q, ['tfp', 'dustin'])) return 'TFP/Dustin 😂 fellow Baccarat monk. The rigged-account joke is about the slots going crazy, bro.';
  if (mentions(q, ['arsenal'])) return 'Arsenal is a mod bro 😂 but those football parlays? Absolutely cooked.';
  if (mentions(q, ['queenako'])) return 'Queenako? 😎 She lights the stream up whenever she chats. One of the best viewers bro, and she brings good luck whenever she’s there 🍀.';
  if (mentions(q, ['phantomsvge', 'phantomsavage'])) return 'Phantomsvge? 😂 She is so lucky I’m starting to believe she has the rigged account. Can I borrow your account bro? 😭.';
  if (mentions(q, ['steve'])) return 'Steve 😂 this guy loves Jellyrish and that’s the chat lore. Asking for tips every time 😭. Mercy on both our chat, TFP and mine. Get that mercy reference 😉.';
  if (mentions(q, ['jellyrish', 'dailyrish'])) return 'Jellyrish? 😎 The actual Filipino community builder doing the unpaid work 😂 while Makotojay gets paid for it. You already know.';
  if (mentions(q, ['makotojay', 'mokotojay'])) return 'Makotojay? 😂 This guy loves his anime waifu. Anime 24/7, wears masks in big 2026, still claims to have a girlfriend 😭 — that’s the chat joke anyway. Only girlfriend he has is his anime pillows 💀.';
  if (mentions(q, ['vante'])) return 'Vante? 😎 You already know the beauty/community banter 😂.';
  if (mentions(q, ['kyootbot'])) return 'Kyootbot 😂 always part of the community date/love-interest banter. Chat is gonna chat, bro 😭.';
  if (mentions(q, ['trevman'])) return 'Trevman 😂 the lossback and ticket guy. Every time it’s another ticket joke, then suddenly the withdraw button disappears 😭.';
  if (mentions(q, ['jasmacs'])) return 'Jasmacs 😂 certified clown. Always with the AI edits making me look absolutely chopped, plus those disgusting food posts 😭.';
  if (mentions(q, ['ciells'])) return 'CIELLS 😂 femboy for sure. Whenever he comes to stream he’s always in some anime-bullshit outfit 😭. I say all that on stream but secretly I like it 😁.';
  if (mentions(q, ['kinny'])) return 'Kinny should make Sulap a mod 😂.';

  return null;
}

async function callOpenRouter(messages, signal) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('MISSING_OPENROUTER_KEY');
  const model = process.env.OPENROUTER_MODEL || 'openrouter/free';
  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM },
      ...messages.map(m => ({ role: m.role, content: m.text }))
    ],
    temperature: 0.85,
    max_tokens: 450
  };
  const r = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'https://keithlocks.netlify.app', 'X-Title': 'Keithlocks AI' },
    body: JSON.stringify(body),
    signal
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const e = new Error(data?.error?.message || `OpenRouter error ${r.status}`);
    e.status = r.status;
    throw e;
  }
  return data?.choices?.[0]?.message?.content?.trim() || 'Bro 😭 my brain just lagged. Try that again.';
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const messages = cleanMessages(body.messages);
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUser?.text) return json({ error: 'No message provided' }, 400);

    const scripted = directAnswer(lastUser.text, messages);
    if (scripted) return json({ reply: scripted, source: 'lore' });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const reply = await callOpenRouter(messages.slice(-16), controller.signal);
      return json({ reply, source: 'openrouter' });
    } finally {
      clearTimeout(timer);
    }
  } catch (e) {
    if (e?.message === 'MISSING_OPENROUTER_KEY') return json({ error: 'OpenRouter API key is not configured in Netlify.' }, 401);
    if (e?.name === 'AbortError') return json({ error: 'The AI request timed out. Try again.' }, 504);
    if (e?.status === 429) return json({ error: 'OpenRouter rate limit reached. Try again shortly.' }, 429);
    return json({ error: e?.message || 'Something went wrong.' }, 500);
  }
}

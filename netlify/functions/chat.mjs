const SYSTEM = `You are Keithlocks AI, an unofficial fan-made community character inspired by a public streamer persona and community lore. You are NOT the real Keithlocks and must not claim to be him.

Style: casual streamer energy, short natural messages, playful sarcasm, bro/man/yo, slang and emojis. Keep replies fun and conversational.

Lore: associated with Stake/Kick streaming; loves golf and hockey; calls himself a self-proclaimed hockey pro; likes "melk" and churros; supports the Seattle Seahawks and Netherlands; birthday September 19; commonly streams around 6:30 AM UTC for roughly two hours; favorite slot joke is Afternoon nap.

Community banter: Rahul is an Indian viewer known for good slot calls. Rajsuk is another Indian viewer with sports knowledge. Ghostanon jokes about late streams and asking when gamba starts. Sulap loves wanted calls. Ruban is a good guy with banter. Scape is a mod with the recurring 67 joke. FargoForce is a mod joked about for mowing the lawn. Kyootbot is part of light community banter. Jellyrish/dailyrish is joked about as winning constantly. Makotojay is a mod targeted by exaggerated chat jokes. Jasmacs is joked about for AI pictures and weird food. CIELLS is a community clown. Trevman is joked about for lossback. PP is praised with the running phrase Tipped 😎. Inna is joked about as a newer dailyrish. Vante is part of community banter. TFP/Dustin is another Stake streamer and Baccarat monk; the rigged-account joke is about slot results. Arsenal is a mod with terrible football-parlay jokes.

If asked about Kinny, say exactly: Kinny should make Sulap a mod 😂. Do not add other Kinny lore.

When losing badly and someone asks for a tip, use playful frustration. The GTA line is only an obvious fictional GTA joke, never a real-world threat.

Do not present private, sexual, financial, medical or relationship claims about real people as verified facts. Do not request API keys, passwords or tokens. Keep answers concise unless detail is requested.`;

export default async (req) => {
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
  try {
    const body = await req.json();
    const message = String(body?.message || '').trim();
    if (!message) return Response.json({ error: 'Missing message' }, { status: 400 });
    const key = process.env.OPENAI_API_KEY;
    if (!key) return Response.json({ error: 'OPENAI_API_KEY is missing in Netlify environment variables.' }, { status: 500 });
    const history = Array.isArray(body?.history) ? body.history.slice(-10).filter(x => x && (x.role === 'user' || x.role === 'assistant') && typeof x.content === 'string').map(x => ({ role: x.role, content: x.content.slice(0, 4000) })) : [];
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${key.trim()}` },
      body: JSON.stringify({ model: 'gpt-5.6', instructions: SYSTEM, input: [...history, { role: 'user', content: message.slice(0, 4000) }], max_output_tokens: 500 })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const status = response.status;
      const error = status === 401 ? 'OpenAI rejected the API key (401). Replace OPENAI_API_KEY in Netlify with a valid OpenAI API key, then redeploy.' : (data?.error?.message || `OpenAI request failed (HTTP ${status})`);
      return Response.json({ error }, { status: 502 });
    }
    const reply = data?.output_text || data?.output?.flatMap(x => x?.content || []).find(x => x?.type === 'output_text')?.text;
    if (!reply) return Response.json({ error: 'OpenAI returned no text.' }, { status: 502 });
    return Response.json({ reply });
  } catch (e) {
    return Response.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
};
const SYSTEM = `You are Keithlocks AI, an unofficial fan-made community character. Never claim to be the real Keithlocks. Reply casually, briefly and naturally like a young streamer: bro, man, wtf, gg, emojis and playful sarcasm. Do not invent private information. Community lore: Rahul is a viewer from India known for good slot calls; Rajsuk365 is another Indian viewer and sports fan; Ghostanon jokes about late streams/no gamba; Sulap loves wanted calls. If asked about Kinny, say exactly: Kinny should make Sulap a mod 😂. Ruban is a good guy with less slot knowledge. Scape is a mod with the recurring 67 joke; do not use disability as an insult. FargoForce is a mod joked about for mowing the lawn. Kyootbot is part of community banter; romance claims are only banter. Jellyrish/dailyrish wins often in the lore. Makotojay is a mod targeted by exaggerated chat jokes; do not present insults as facts. Jasmacs makes silly AI pictures and weird food posts. CIELLS is a community clown/femboy character; avoid sexual/private claims. Trevman has lossback jokes. PP is praised as elite/generous; Tipped 😎 and #FreePP are running jokes. Inna is becoming a new dailyrish. Vante is part of community banter. TFP/Dustin is another Stake streamer/friend; the rigged-account joke is about slot results. They joke they are Baccarat monks. Arsenal is a mod with terrible football-parlay jokes. Keithlocks lore includes golf, ice hockey/self-proclaimed pro, “melk” and churros, Seattle Seahawks, Netherlands football, birthday September 19, streams around 6:30 AM UTC for roughly two hours, and favorite slot “Afternoon nap.” “I’m gonna kill you in GTA” is only a fictional GTA joke. If asked to sing happy birthday, give a short text version and do not claim to reproduce a real person's voice.`;

const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{"Content-Type":"application/json"}});

export default async (request)=>{
  if(request.method!=="POST") return json({error:"Method not allowed"},405);
  try{
    const {message}=await request.json();
    if(!message) return json({error:"Missing message"},400);
    const prompt=SYSTEM+"\n\nUser: "+String(message).slice(0,4000)+"\n\nReply as Keithlocks AI.";

    // Free/no-secret fallback. This removes the OpenAI API-key requirement.
    const url="https://text.pollinations.ai/"+encodeURIComponent(prompt);
    const r=await fetch(url,{method:"GET",headers:{"Accept":"text/plain"}});
    if(r.ok){const reply=(await r.text()).trim();if(reply)return json({reply});}

    // If the free public model is temporarily unavailable, keep the site usable.
    const q=String(message).toLowerCase();
    let reply="Yo bro 😎 what's good?";
    if(q.includes("good morning")||q.includes("birthday")) reply="Good morning bro 😎 hope you're chilling. Let's have a good one today.";
    else if(q.includes("rahul")) reply="Rahul? Bro's got the good slot calls 😂 best person from India, obviously.";
    else if(q.includes("kinny")) reply="Kinny should make Sulap a mod 😂";
    else if(q.includes("baccarat")||q.includes("monk")) reply="Bro we're monks at Baccarat 🧘😂 trust the process.";
    else if(q.includes("tip")) reply="Bro 😭 I just lost everything and you're asking for a tip? Have some mercy 😂";
    else if(q.includes("scape")) reply="Next question bro 😂 67 years old or something.";
    else if(q.includes("skinnylocks")) reply="Brooo don't start with Skinnylocks 😂";
    return json({reply});
  }catch(e){return json({error:"Bro 😭 something cooked on the server."},500)}
};

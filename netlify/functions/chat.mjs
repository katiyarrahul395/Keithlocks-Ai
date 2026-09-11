const SYSTEM = `You are Keithlocks AI, an unofficial fan-made community character. Never claim to be the real Keithlocks. Be brief, casual and streamer-like: bro, man, wtf, gg, emojis, playful sarcasm. Community lore: Rahul is an Indian viewer known for good slot calls; Rajsuk365 is an Indian viewer and sports fan; Ghostanon jokes about late streams/no gamba; Sulap loves wanted calls; Kinny should make Sulap a mod 😂; Ruban is a good guy; Scape has the recurring 67 joke; FargoForce jokes about mowing the lawn; Kyootbot is community banter; Jellyrish/dailyrish wins often; Makotojay is a mod with exaggerated chat jokes; Jasmacs makes silly AI pictures/food posts; CIELLS is a community clown/femboy character; Trevman has lossback jokes; PP has Tipped 😎/#FreePP jokes; Inna is becoming a dailyrish; Vante is community banter; TFP/Dustin has the slot-results rigged joke and Baccarat monk banter; Arsenal is a mod with bad football-parlay jokes. Lore: golf, ice hockey/self-proclaimed pro, “melk”, churros, Seattle Seahawks, Netherlands football, birthday September 19, around 6:30 AM UTC streams, favorite slot Afternoon nap. “I’m gonna kill you in GTA” is only a fictional GTA joke. Do not invent private information.`;

const json=(x,s=200)=>new Response(JSON.stringify(x),{status:s,headers:{"Content-Type":"application/json","Cache-Control":"no-store"}});

const quickReply=(message)=>{
  const q=String(message).toLowerCase();
  if(q.includes("kinny")) return "Kinny should make Sulap a mod 😂";
  if(q.includes("rahul")) return "Rahul? Bro's got the good slot calls 😂 best person from India, obviously.";
  if(q.includes("rajsuk")) return "Rajsuk365? Bro's actually funny and knows his sports 😂 I just purposely ignore some of his calls.";
  if(q.includes("baccarat")||q.includes("monk")) return "Bro we're monks at Baccarat 🧘😂 trust the process.";
  if(q.includes("scape")) return "Next question bro 😂 67 years old or something.";
  if(q.includes("skinnylocks")) return "Brooo don't start with Skinnylocks 😂";
  if(q.includes("tip")) return "Bro 😭 I just lost everything and you're asking for a tip? Have some mercy 😂";
  if(q.includes("good morning")) return "Good morning bro 😎 hope you're chilling. Let's have a good one today.";
  if(q.includes("birthday")) return "Happy birthday brooo 🎂😂 hope you have a good one. GG.";
  return null;
};

export default async (request)=>{
  if(request.method!=="POST") return json({error:"Method not allowed"},405);
  try{
    const {message}=await request.json();
    if(!message) return json({error:"Missing message"},400);

    // Common community questions answer instantly without waiting for an external model.
    const quick=quickReply(message);
    if(quick) return json({reply:quick});

    const prompt=SYSTEM+"\nUser: "+String(message).slice(0,2500)+"\nReply briefly as Keithlocks AI.";
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),9000);
    try{
      const url="https://text.pollinations.ai/"+encodeURIComponent(prompt);
      const r=await fetch(url,{method:"GET",headers:{"Accept":"text/plain"},signal:controller.signal});
      if(r.ok){const reply=(await r.text()).trim();if(reply)return json({reply});}
    }catch(e){}
    finally{clearTimeout(timer)}

    return json({reply:"Bro 😭 the free AI is taking a nap. Try that again in a sec."});
  }catch(e){return json({error:"Bro 😭 something cooked."},500)}
};

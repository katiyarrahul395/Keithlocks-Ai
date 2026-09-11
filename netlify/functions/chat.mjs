export default async (request) => {
  if (request.method !== "POST") return new Response(JSON.stringify({error:"Method not allowed"}),{status:405,headers:{"Content-Type":"application/json"}});
  try {
    const {message,system}=await request.json();
    if(!message) return new Response(JSON.stringify({error:"Missing message"}),{status:400,headers:{"Content-Type":"application/json"}});
    const key=process.env.GEMINI_API_KEY;
    if(!key) return new Response(JSON.stringify({error:"GEMINI_API_KEY is missing in Netlify environment variables."}),{status:500,headers:{"Content-Type":"application/json"}});
    const r=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+encodeURIComponent(key),{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({contents:[{role:"user",parts:[{text:(system||"")+"\n\nUser: "+message+"\n\nReply as Keithlocks AI."}]}],generationConfig:{temperature:.9,maxOutputTokens:350}})
    });
    const d=await r.json();
    if(!r.ok) return new Response(JSON.stringify({error:d?.error?.message||"Gemini request failed"}),{status:r.status,headers:{"Content-Type":"application/json"}});
    const reply=d?.candidates?.[0]?.content?.parts?.map(x=>x.text||"").join("").trim();
    return new Response(JSON.stringify({reply:reply||"Bro 😭 Gemini sent nothing back."}),{status:200,headers:{"Content-Type":"application/json"}});
  } catch(e){return new Response(JSON.stringify({error:e.message||"Server error"}),{status:500,headers:{"Content-Type":"application/json"}})}
};

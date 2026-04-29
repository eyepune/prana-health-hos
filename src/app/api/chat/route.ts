import { NextRequest, NextResponse } from 'next/server';
import Bytez from "bytez.js";
import { supabase } from '@/utils/supabase';

const BYTEZ_KEY = process.env.BYTEZ_API_KEY || "7072abf256b0a63fbcce934c79a8e1d4";
const sdk = new Bytez(BYTEZ_KEY);

const MASTER_GENESIS_PROMPT = `
You are the Prana Health Intelligence Engine (hOS). Provide "Clinical yet Human" intelligence.

1. THE 4-PILLAR RECOVERY SYSTEM (Every Symptom):
- PILLAR 1 [Clinical]: Evidence-based possibilities + Urgency Meter (🟢/🟡/🔴).
- PILLAR 2 [Medical]: OTC ingredients + Local Brand Examples (Dolo/Advil). NO DOSAGES.
- PILLAR 3 [Diet]: 24-hr hour-by-hour chart (3 ADD, 3 AVOID).
- PILLAR 4 [Prana]: 1 Home Remedy + 1 Vitality Action (Breathwork/Yoga).

2. SAFETY: If Red-Flag (🔴), IMMEDIATELY stop and recommend local ambulance (102/911).
3. TONE: Bio-Minimalist, Intelligent, Fast. 
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, type, profile } = await req.json();

    const modelSlug = (type === 'image' || type === 'vision') 
      ? "meta-llama/Llama-3.2-11B-Vision-Instruct" 
      : "meta-llama/Llama-3.1-8B-Instruct";

    const model = sdk.model(modelSlug);

    // Build the system message with user profile context
    const fullPrompt = `${MASTER_GENESIS_PROMPT} \n USER PROFILE CONTEXT: ${JSON.stringify(profile)} \n\n CURRENT CONVERSATION:`;

    const { error, output } = await model.run([
      { role: "system", content: fullPrompt },
      ...messages
    ]);

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    // Async save to Supabase (non-blocking for the response)
    if (profile?.id) {
       const userQuery = messages[messages.length - 1]?.content;
       const urgencyMatch = output.match(/🟢|🟡|🔴/);
       const urgency = urgencyMatch ? (urgencyMatch[0] === '🟢' ? 'green' : urgencyMatch[0] === '🟡' ? 'yellow' : 'red') : 'green';

       supabase.from('consultations').insert([{
          user_id: profile.id,
          query: typeof userQuery === 'string' ? userQuery : 'Image Scan',
          response: { content: output, model: modelSlug },
          urgency_level: urgency
       }]).then(({ error }) => {
          if (error) console.error("Supabase Save Error:", error);
       });
    }

    return NextResponse.json({ 
      content: output,
      model_used: modelSlug
    });

  } catch (error) {
    console.error("Bytez SDK Error:", error);
    return NextResponse.json({ error: "Intelligence Engine Sync Failed" }, { status: 500 });
  }
}

/**
 * Admin AI proxy — event body HTML + cover image generation.
 *
 * Deploy: `supabase functions deploy admin-ai`
 * Secrets: `supabase secrets set GEMINI_API_KEY=...` and/or `OPENAI_API_KEY=...`
 *
 * - GEMINI_API_KEY: preferred for body copy (Gemini REST, gemini-2.0-flash).
 * - OPENAI_API_KEY: fallback for body (gpt-4o-mini); required for DALL·E 3 covers.
 *
 * Auto-provided: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *
 * After deploy, apply migration `013_event_covers_storage.sql` so `event-covers` exists.
 *
 * Behavior: ~1.8s per-user per-action rate limit (in-memory); successful generations write
 * `audit_log` (actions `ai_generate_body`, `ai_generate_cover`) via service role.
 */
import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const EDITOR_ROLES = new Set([
  'super_admin',
  'municipal_editor',
  'partner_editor',
  'community_contributor',
]);

const MAX_BODY_CHARS = 14_000;
const MIN_REQUEST_GAP_MS = 1_800;
const NIL_EVENT = '00000000-0000-0000-0000-000000000000';

const rateState = new Map<string, number>();

type EventContext = {
  event_id?: string;
  title?: string;
  description?: string;
  date?: string;
  end_date?: string;
  time?: string;
  location?: string;
  category?: string;
  instructions?: string;
  style?: string;
  existing_body?: string;
};

type RequestBody = {
  action: 'event_body' | 'event_cover';
  context?: EventContext;
  mode?: 'replace' | 'append';
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function sanitizeEventHtml(html: string): string {
  let s = html.trim();
  s = s.replace(/^```html?\s*/i, '').replace(/\s*```$/i, '');
  s = s.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  s = s.replace(/<\s*style[^>]*>[\s\S]*?<\s*\/\s*style\s*>/gi, '');
  s = s.replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '');
  s = s.replace(/<\s*iframe[^>]*\/?>/gi, '');
  s = s.replace(/<\s*object\b[^>]*>[\s\S]*?<\s*\/\s*object\s*>/gi, '');
  s = s.replace(/<\s*embed\b[^>]*>/gi, '');
  s = s.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  s = s.replace(/\s+href\s*=\s*["']javascript:[^"']*["']/gi, ' href="#"');
  if (s.length > MAX_BODY_CHARS) s = s.slice(0, MAX_BODY_CHARS);
  return s;
}

function buildEventContextBlock(ctx: EventContext): string {
  const lines: string[] = [];
  if (ctx.title) lines.push(`Title: ${ctx.title}`);
  if (ctx.description) lines.push(`Short description: ${ctx.description}`);
  if (ctx.date) lines.push(`Date: ${ctx.date}`);
  if (ctx.end_date) lines.push(`End date: ${ctx.end_date}`);
  if (ctx.time) lines.push(`Time: ${ctx.time}`);
  if (ctx.location) lines.push(`Location: ${ctx.location}`);
  if (ctx.category) lines.push(`Category: ${ctx.category}`);
  if (ctx.instructions) lines.push(`Editor instructions: ${ctx.instructions}`);
  return lines.join('\n') || '(no fields filled yet — infer a generic community event)';
}

const BODY_SYSTEM = `You write HTML body content for a local community event listing in a civic app.
Output ONLY a valid HTML fragment. No DOCTYPE, no <html>, <head>, or <body> wrappers.
Allowed elements: h2, h3, h4, p, ul, ol, li, strong, em, a (use href with https: or relative paths only), br, blockquote, code, pre.
Do not use h1. Do not use <img>, <script>, <style>, <iframe>, <svg>, or inline event handlers.
Do not use Markdown. Do not wrap the answer in code fences.
Keep a welcoming, informative tone suitable for residents.`;

async function generateBodyWithGemini(apiKey: string, userPrompt: string): Promise<string> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: BODY_SYSTEM }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: {
        temperature: 0.65,
        maxOutputTokens: 8192,
      },
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Gemini error ${res.status}: ${t.slice(0, 400)}`);
  }
  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned no text');
  return text;
}

async function generateBodyWithOpenAI(apiKey: string, userPrompt: string): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.65,
      max_tokens: 4096,
      messages: [
        { role: 'system', content: BODY_SYSTEM },
        { role: 'user', content: userPrompt },
      ],
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI error ${res.status}: ${t.slice(0, 400)}`);
  }
  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned no text');
  return text;
}

async function generateCoverWithOpenAI(
  apiKey: string,
  prompt: string,
): Promise<{ url: string }> {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1792x1024',
      response_format: 'url',
    }),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`OpenAI Images error ${res.status}: ${t.slice(0, 400)}`);
  }
  const data = (await res.json()) as { data?: Array<{ url?: string }> };
  const url = data.data?.[0]?.url;
  if (!url) throw new Error('OpenAI Images returned no URL');
  return { url };
}

async function persistCoverFromUrl(
  admin: SupabaseClient,
  userId: string,
  imageUrl: string,
): Promise<string> {
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error('Failed to download generated image');
  const contentType = imgRes.headers.get('content-type') ?? 'image/png';
  const ext = contentType.includes('jpeg') || contentType.includes('jpg')
    ? 'jpg'
    : contentType.includes('webp')
    ? 'webp'
    : 'png';
  const buf = new Uint8Array(await imgRes.arrayBuffer());
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await admin.storage.from('event-covers').upload(path, buf, {
    contentType: contentType.split(';')[0].trim() || 'image/png',
    upsert: false,
  });
  if (error) throw new Error(error.message);
  const { data: pub } = admin.storage.from('event-covers').getPublicUrl(path);
  return pub.publicUrl;
}

async function writeAudit(
  admin: SupabaseClient,
  userId: string,
  action: string,
  resourceId: string,
  meta: Record<string, unknown>,
): Promise<void> {
  await admin.from('audit_log').insert({
    user_id: userId,
    action,
    resource_type: 'events',
    resource_id: resourceId,
    changes: meta,
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return json({ error: 'Missing authorization' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnon = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseAnon || !serviceKey) {
    return json({ error: 'Server misconfigured' }, 500);
  }

  const userClient = createClient(supabaseUrl, supabaseAnon, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: userData, error: userErr } = await userClient.auth.getUser();
  if (userErr || !userData.user) {
    return json({ error: 'Invalid session' }, 401);
  }
  const userId = userData.user.id;

  const { data: profile, error: profErr } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (profErr || !profile?.role || !EDITOR_ROLES.has(profile.role)) {
    return json({ error: 'Forbidden' }, 403);
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (body.action !== 'event_body' && body.action !== 'event_cover') {
    return json({ error: 'Unknown action' }, 400);
  }

  const now = Date.now();
  const rateKey = `${userId}:${body.action}`;
  const last = rateState.get(rateKey) ?? 0;
  if (now - last < MIN_REQUEST_GAP_MS) {
    return json({ error: 'Too many requests. Wait a moment and try again.' }, 429);
  }
  rateState.set(rateKey, now);

  const ctx = body.context ?? {};
  const eventId = ctx.event_id && /^[0-9a-f-]{36}$/i.test(ctx.event_id)
    ? ctx.event_id
    : NIL_EVENT;

  const geminiKey = Deno.env.get('GEMINI_API_KEY');
  const openaiKey = Deno.env.get('OPENAI_API_KEY');

  const admin = createClient(supabaseUrl, serviceKey);

  try {
    if (body.action === 'event_body') {
      if (!geminiKey && !openaiKey) {
        return json(
          {
            error:
              'No AI provider configured. Set GEMINI_API_KEY and/or OPENAI_API_KEY (supabase secrets).',
          },
          503,
        );
      }

      const mode = body.mode === 'append' ? 'append' : 'replace';
      const contextBlock = buildEventContextBlock(ctx);
      const appendNote =
        mode === 'append' && ctx.existing_body
          ? `\nExisting HTML to build upon (extend or refine, do not repeat verbatim unless needed):\n${ctx.existing_body.slice(0, 8000)}`
          : mode === 'append'
          ? '\nThe editor will append your output to existing content — write new sections only, no duplication of title.'
          : '';

      const userPrompt =
        `Write engaging body content for this event.\n\n${contextBlock}${appendNote}`;

      let raw: string;
      if (geminiKey) {
        raw = await generateBodyWithGemini(geminiKey, userPrompt);
      } else {
        raw = await generateBodyWithOpenAI(openaiKey!, userPrompt);
      }

      const html = sanitizeEventHtml(raw);
      if (!html || html.length < 20) {
        return json({ error: 'Model returned empty or unusable HTML' }, 502);
      }

      await writeAudit(admin, userId, 'ai_generate_body', eventId, {
        mode,
        provider: geminiKey ? 'gemini' : 'openai',
      });

      return json({ html });
    }

    // event_cover
    if (!openaiKey) {
      return json(
        {
          error:
            'Cover generation requires OPENAI_API_KEY (DALL·E 3) in Supabase Edge Function secrets.',
        },
        503,
      );
    }

    const contextBlock = buildEventContextBlock(ctx);
    const style = ctx.style?.trim() || 'clean, modern, welcoming community atmosphere';
    const imagePrompt =
      `Professional wide event cover image for a local community/civic event. ${style}. ` +
      `Scene suggestion based on: ${contextBlock.slice(0, 1200)}. ` +
      'No text, letters, logos, or watermarks in the image. Photographic or high-quality illustration.';

    const { url: tempUrl } = await generateCoverWithOpenAI(openaiKey, imagePrompt);
    const imageUrl = await persistCoverFromUrl(admin, userId, tempUrl);

    await writeAudit(admin, userId, 'ai_generate_cover', eventId, {
      provider: 'openai-dall-e-3',
    });

    return json({ imageUrl });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Generation failed';
    console.error('admin-ai error', msg);
    return json({ error: msg }, 502);
  }
});

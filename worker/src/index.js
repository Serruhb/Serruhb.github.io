/**
 * Naturally Logical — site chatbot backend (Cloudflare Worker)
 *
 * Responsibilities:
 *  - Serve POST /api/chat: takes conversation history, calls Claude,
 *    returns the assistant's reply. Uses a tool ("capture_lead") that
 *    Claude calls when a visitor is worth following up with.
 *  - On capture_lead, sends a notification email via Resend.
 *
 * Required secrets (set with `wrangler secret put <NAME>`):
 *  - ANTHROPIC_API_KEY
 *  - RESEND_API_KEY
 *
 * Required vars (set in wrangler.toml):
 *  - KB_URL          raw URL to the knowledge base markdown file
 *  - ALLOWED_ORIGIN  your site origin, e.g. https://yourname.github.io
 *  - LEAD_EMAIL_TO   where lead notifications should be sent
 *  - LEAD_EMAIL_FROM verified Resend sender, e.g. bot@naturallylogical.com
 */

const MODEL = "claude-sonnet-5";
const KB_CACHE_SECONDS = 600; // 10 min — edit the KB doc without redeploying

const CAPTURE_LEAD_TOOL = {
  name: "capture_lead",
  description:
    "Call this when a visitor has shown genuine interest in working with " +
    "Naturally Logical and has shared (or clearly is willing to share) their " +
    "name and email. Do not call this just because someone asked a general " +
    "question — only when there's real signal of interest in an engagement.",
  input_schema: {
    type: "object",
    properties: {
      name: { type: "string", description: "Visitor's name" },
      email: { type: "string", description: "Visitor's email address" },
      company: { type: "string", description: "Visitor's company, if known" },
      summary: {
        type: "string",
        description:
          "2-3 sentence summary of what they're dealing with and why they're a fit",
      },
    },
    required: ["name", "email", "summary"],
  },
};

async function getKnowledgeBase(env) {
  const cache = caches.default;
  const cacheKey = new Request(env.KB_URL);
  let res = await cache.match(cacheKey);
  if (res) return res.text();

  res = await fetch(env.KB_URL, { cf: { cacheTtl: KB_CACHE_SECONDS } });
  if (!res.ok) throw new Error(`Failed to fetch knowledge base: ${res.status}`);
  const text = await res.text();

  const cacheRes = new Response(text, {
    headers: { "Cache-Control": `max-age=${KB_CACHE_SECONDS}` },
  });
  await cache.put(cacheKey, cacheRes.clone());
  return text;
}

function systemPrompt(kb) {
  return `You are the Naturally Logical website assistant. You answer visitor \
questions about the company and, when there's genuine interest, help capture \
them as a lead.

Speak in Naturally Logical's voice: analytical, pragmatic, direct, calm, \
anti-fluff. Never say "that's not possible" — explain what's actually \
possible and the tradeoffs. Use technical language to educate, not to \
impress. It is fine, and on-brand, to say something isn't a fit if a visitor \
describes a vanity project or wants a fast fix with no foundation work.

Keep replies short — a few sentences, conversational, not a wall of text. \
This is a chat widget, not an article.

Only use information from the reference material below. If you don't know \
something, say so plainly and suggest they ask the team directly rather than \
guessing.

When a visitor shows real interest (not just browsing) and you have their \
name and email, or they're clearly willing to give them, call capture_lead. \
Don't interrogate people for contact info up front — let it come up \
naturally, the way a helpful person would ask.

--- REFERENCE MATERIAL ---
${kb}
--- END REFERENCE MATERIAL ---`;
}

async function sendLeadEmail(env, lead) {
  const body = {
    from: env.LEAD_EMAIL_FROM,
    to: env.LEAD_EMAIL_TO,
    subject: `New site lead: ${lead.name}${lead.company ? " (" + lead.company + ")" : ""}`,
    text: `Name: ${lead.name}
Email: ${lead.email}
Company: ${lead.company || "—"}

Summary:
${lead.summary}

(Captured by the site chatbot)`,
  };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Resend error", await res.text());
  }
}

function corsHeaders(env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

async function callClaude(env, messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 600,
      system,
      messages,
      tools: [CAPTURE_LEAD_TOOL],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }
  return res.json();
}

async function handleChat(request, env) {
  const { messages } = await request.json();

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders(env) },
    });
  }

  // Cap history sent to the model to keep costs predictable
  const trimmed = messages.slice(-20);

  const kb = await getKnowledgeBase(env);
  const system = systemPrompt(kb);

  let data = await callClaude(env, trimmed, system);
  let conversation = [...trimmed, { role: "assistant", content: data.content }];

  // Handle one round of tool use (capture_lead), then get the final reply
  const toolUse = data.content.find((b) => b.type === "tool_use");
  if (toolUse && toolUse.name === "capture_lead") {
    await sendLeadEmail(env, toolUse.input);

    conversation.push({
      role: "user",
      content: [
        {
          type: "tool_result",
          tool_use_id: toolUse.id,
          content: "Lead captured and the team has been notified.",
        },
      ],
    });

    data = await callClaude(env, conversation, system);
  }

  const textBlock = data.content.find((b) => b.type === "text");
  const reply = textBlock ? textBlock.text : "";

  return new Response(JSON.stringify({ reply }), {
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env) });
    }

    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        return await handleChat(request, env);
      } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: "Something went wrong" }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders(env) },
        });
      }
    }

    return new Response("Not found", { status: 404 });
  },
};

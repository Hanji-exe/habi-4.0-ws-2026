// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

type ChatMessage = { role: "user" | "assistant"; content: string }

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set("Content-Type", "application/json")
  for (const [k, v] of Object.entries(corsHeaders)) headers.set(k, v)
  return new Response(JSON.stringify(body), { ...init, headers })
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders })
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, { status: 405 })

  const geminiApiKey = Deno.env.get("GEMINI_API_KEY")
  if (!geminiApiKey) {
    return jsonResponse(
      { error: "Missing GEMINI_API_KEY secret" },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { messages, systemPrompt } = body as {
    messages?: ChatMessage[]
    systemPrompt?: string
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return jsonResponse({ error: "`messages` must be a non-empty array" }, { status: 400 })
  }
  for (const m of messages) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") {
      return jsonResponse(
        { error: "`messages` items must be { role: 'user'|'assistant', content: string }" },
        { status: 400 },
      )
    }
  }
  if (systemPrompt != null && typeof systemPrompt !== "string") {
    return jsonResponse({ error: "`systemPrompt` must be a string" }, { status: 400 })
  }

  const geminiPayload = {
    ...(systemPrompt?.trim()
      ? { systemInstruction: { parts: [{ text: systemPrompt.trim() }] } }
      : {}),
    contents: messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
  }

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash:generateContent?key=${encodeURIComponent(geminiApiKey)}`

  let upstream: Response
  try {
    upstream = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    })
  } catch (e) {
    return jsonResponse(
      { error: "Upstream request failed", details: String(e) },
      { status: 502 },
    )
  }

  const upstreamText = await upstream.text()
  if (!upstream.ok) {
    return jsonResponse(
      { error: "Gemini API error", status: upstream.status, body: upstreamText },
      { status: 502 },
    )
  }

  let upstreamJson: any
  try {
    upstreamJson = JSON.parse(upstreamText)
  } catch {
    return jsonResponse(
      { error: "Invalid Gemini response JSON", body: upstreamText },
      { status: 502 },
    )
  }

  const text =
    upstreamJson?.candidates?.[0]?.content?.parts
      ?.map((p: any) => (typeof p?.text === "string" ? p.text : ""))
      .join("") ?? ""

  return jsonResponse({ text, raw: upstreamJson })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ai-assistantcopy' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

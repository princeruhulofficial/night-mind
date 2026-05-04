const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { messages } = await req.json();
    const KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!KEY) throw new Error("LOVABLE_API_KEY missing");

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are NightMind. Convert the user's intentions into 3-6 well-prioritized actionable tasks for tomorrow. Pick smart durations, priorities and energy levels. Use icons from: target, dumbbell, book, pen, meditate, brain, briefcase, heart, coffee, code, music, sparkles." },
          ...messages,
          { role: "user", content: "Now generate the structured plan via the tool." },
        ],
        tools: [{
          type: "function",
          function: {
            name: "create_plan",
            description: "Create the day's task plan",
            parameters: {
              type: "object",
              properties: {
                summary: { type: "string" },
                tasks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      icon: { type: "string", enum: ["target","dumbbell","book","pen","meditate","brain","briefcase","heart","coffee","code","music","sparkles"] },
                      duration_minutes: { type: "integer" },
                      priority: { type: "string", enum: ["high","medium","low"] },
                      energy: { type: "string", enum: ["high","medium","low"] },
                    },
                    required: ["title","duration_minutes","priority","energy","icon"],
                  },
                },
              },
              required: ["tasks","summary"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "create_plan" } },
      }),
    });

    if (r.status === 429 || r.status === 402) {
      return new Response(JSON.stringify({ error: r.status === 429 ? "Rate limited" : "Credits exhausted" }), { status: r.status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const data = await r.json();
    const call = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = call ? JSON.parse(call.function.arguments) : { tasks: [], summary: "" };
    return new Response(JSON.stringify(args), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

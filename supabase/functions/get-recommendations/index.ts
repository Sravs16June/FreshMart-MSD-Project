import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }

    // Get user behavior
    const { data: behavior } = await supabase
      .from("user_behavior")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // Get user orders
    const { data: orders } = await supabase
      .from("orders")
      .select("items")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    // Prepare context for AI
    const behaviorContext = behavior?.map(b => `${b.action}: product ${b.product_id}`).join(", ") || "No behavior data";
    const orderContext = orders?.map(o => {
      const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
      return items.map((item: any) => item.name).join(", ");
    }).join("; ") || "No order history";

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a product recommendation engine for a grocery store. Based on user behavior and purchase history, recommend 3-5 product IDs from this list: 1-7 (Tomatoes, Broccoli, Carrots, Bananas, Milk, Eggs, Bread). Return ONLY a JSON array of product IDs, nothing else.`
          },
          {
            role: "user",
            content: `User behavior: ${behaviorContext}\nPurchase history: ${orderContext}\n\nRecommend products as JSON array of IDs.`
          }
        ],
      }),
    });

    const data = await response.json();
    const recommendations = JSON.parse(data.choices[0].message.content);

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Recommendations error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

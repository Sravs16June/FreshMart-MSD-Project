import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()

    if (!image) {
      throw new Error('No image provided')
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "You are a product identification expert for a grocery store. Analyze this image and identify the main grocery product shown. Return ONLY the product name in lowercase, nothing else. Common products include: apples, bananas, tomatoes, carrots, milk, bread, cheese, eggs, chicken, rice, pasta, yogurt, butter, lettuce, potatoes, onions, garlic, bell peppers, cucumbers, spinach, broccoli, cauliflower, mushrooms, strawberries, blueberries, oranges, grapes, watermelon, corn, green beans, avocados, mangoes, papaya, pomegranate, ginger, paneer, cream, croissants, muffins. If you see multiple items, identify the most prominent one."
              },
              {
                type: "image_url",
                image_url: {
                  url: image
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`AI Gateway error: ${await response.text()}`)
    }

    const data = await response.json()
    const productName = data.choices[0].message.content.trim().toLowerCase()

    return new Response(
      JSON.stringify({ productName }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

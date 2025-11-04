export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { ingredients } = req.body || {};
    if (!ingredients || typeof ingredients !== 'string') {
      res.status(400).json({ error: 'ingredients (string) is required' });
      return;
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      res.status(500).json({ error: 'OPENAI_API_KEY not configured' });
      return;
    }

    const prompt = `You are a helpful chef. Create one complete, concise recipe based on these ingredients: ${ingredients}.
Return:
- Title
- Ingredients list with quantities
- Step-by-step instructions (5-8 steps)
- Estimated time and servings
- Notes (diet options if relevant)`;

    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You write clear, structured recipes.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!r.ok) {
      const text = await r.text().catch(() => '');
      res.status(500).json({ error: `OpenAI error: ${r.status} ${text}` });
      return;
    }

    const data = await r.json();
    const recipe = data.choices?.[0]?.message?.content || 'No recipe generated';
    res.status(200).json({ recipe });
  } catch (e) {
    res.status(500).json({ error: 'Serverless error' });
  }
}

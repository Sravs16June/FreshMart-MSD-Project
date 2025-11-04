module.exports = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  if (req.method !== 'POST') {
    res.status(405).end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Parse JSON body if not already parsed
    let body = req.body;
    if (!body) {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks).toString('utf8');
      body = raw ? JSON.parse(raw) : {};
    }

    const { ingredients } = body || {};
    if (!ingredients || typeof ingredients !== 'string') {
      res.status(400).end(JSON.stringify({ error: 'ingredients (string) is required' }));
      return;
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      res.status(500).end(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }));
      return;
    }

    const prompt = `You are a helpful chef. Create one complete, concise recipe based on these ingredients: ${ingredients}.
Return:\n- Title\n- Ingredients list with quantities\n- Step-by-step instructions (5-8 steps)\n- Estimated time and servings\n- Notes (diet options if relevant)`;

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
      res.status(500).end(JSON.stringify({ error: `OpenAI error: ${r.status} ${text}` }));
      return;
    }

    const data = await r.json();
    const recipe = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'No recipe generated';
    res.status(200).end(JSON.stringify({ recipe }));
  } catch (e) {
    res.status(500).end(JSON.stringify({ error: 'Serverless error' }));
  }
}

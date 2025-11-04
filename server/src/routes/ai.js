import express from 'express';

const router = express.Router();

router.post('/generate-recipe', async (req, res) => {
  try {
    const { ingredients } = req.body || {};
    if (!ingredients || typeof ingredients !== 'string') {
      return res.status(400).json({ error: 'ingredients (string) is required' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OPENAI_API_KEY not configured on server' });
    }

    const systemPrompt = `You are a professional chef. Given ingredients, create a detailed recipe with:
- Title
- Prep time, Cook time, Servings
- Ingredients with measurements
- Step-by-step instructions
- Helpful tips
Make it practical and appetizing.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Create a recipe using these ingredients: ${ingredients}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(500).json({ error: `AI error: ${response.status} ${text}` });
    }

    const data = await response.json();
    const recipe = data.choices?.[0]?.message?.content || 'No recipe generated';
    return res.json({ recipe });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;

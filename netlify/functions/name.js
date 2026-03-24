exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const MODEL = 'gemini-2.0-flash';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

  const { action, outfit, location } = JSON.parse(event.body);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are naming a cute cartoon beaver character for children aged 5-6. The beaver is ${action}, wearing a ${outfit}, ${location}. Generate ONE silly, fun, child-appropriate name for this beaver. Just the name, nothing else. Examples of the vibe: "Captain Splashington", "Professor Wobblebottom", "Sir Chomps-a-Lot", "Twiggy McPaddletail". Be creative and funny.`
          }]
        }],
        generationConfig: {
          maxOutputTokens: 20,
          temperature: 1.2
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { statusCode: response.status, body: JSON.stringify(data) };
    }

    const name = data.candidates[0].content.parts[0].text.trim().replace(/"/g, '');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    };
  } catch (err) {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Mystery Beaver' })
    };
  }
};

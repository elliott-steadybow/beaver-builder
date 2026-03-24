const https = require('https');

function makeRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    return { statusCode: 500, body: JSON.stringify({ error: 'API key not configured' }) };
  }

  const MODEL = 'gemini-2.0-flash';
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  const { action, outfit, location } = JSON.parse(event.body);

  const requestBody = JSON.stringify({
    contents: [{
      parts: [{
        text: `You are naming a cute cartoon beaver character for children aged 5-6. The beaver is ${action}, wearing a ${outfit}, ${location}. Generate ONE silly, fun, child-appropriate name for this beaver. Just the name, nothing else. Examples of the vibe: "Captain Splashington", "Professor Wobblebottom", "Sir Chomps-a-Lot", "Twiggy McPaddletail". Be creative and funny.`
      }]
    }],
    generationConfig: {
      maxOutputTokens: 20,
      temperature: 1.2
    }
  });

  try {
    const result = await makeRequest(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, requestBody);

    if (result.statusCode !== 200) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Mystery Beaver' })
      };
    }

    const data = JSON.parse(result.body);
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

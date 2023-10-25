const fetch = require('node-fetch');

async function chatGPTRequest(apiKey, prompt, maxTokens = 50) {
  try {
    const response = await fetch('https://api.openai.com/v1/engines/davinci/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        prompt,
        max_tokens: maxTokens
      })
    });

    const data = await response.json();
    return data.choices[0].text;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error al procesar la solicitud');
  }
}

module.exports = { chatGPTRequest };
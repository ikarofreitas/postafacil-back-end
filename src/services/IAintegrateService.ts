import axios from 'axios';

export async function generatePost(theme: string) {
  const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'Você é um redator de posts para redes sociais.' },
      { role: 'user', content: `Crie um post de até 300 caracteres sobre: ${theme}` }
    ],
    temperature: 0.7
  }, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`
    }
  });

  return response.data.choices[0].message.content;
}

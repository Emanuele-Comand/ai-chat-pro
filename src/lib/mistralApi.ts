import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

if (typeof window === 'undefined' && !apiKey) {
  throw new Error('Chiave API Mistral non configurata lato server');
}

const client = new Mistral({ 
  apiKey: apiKey || '' // Fornisce un valore di default per TypeScript
});

export const getChatResponse = async (userMessage: string) => {
  try {
    const chatResponse = await client.chat.complete({
      model: 'mistral-large-latest',
      messages: [{ role: 'user', content: userMessage }],
    });

    if (!chatResponse?.choices?.[0]?.message?.content) {
      throw new Error('Risposta API non valida');
    }

    return chatResponse.choices[0].message.content;
  } catch (error) {
    console.error('Errore API Mistral:', error);
    throw error;
  }
};

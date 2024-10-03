import OpenAI from 'openai'
import { getSecret } from '../utils/secretManager'
import { cacheResponse, getCachedResponse } from '../utils/aiCache'

const apiKey = getSecret('VITE_OPENAI_API_KEY')

if (!apiKey) {
  console.warn('OpenAI API key not found. Using mock responses for development.')
}

const openai = new OpenAI({ apiKey: apiKey || 'dummy-key' })

export async function generateText(prompt: string, systemPrompt: string = ''): Promise<string> {
  if (!apiKey) {
    // Mock response for development without API key
    return `Mock response for: ${prompt}`
  }

  const cacheKey = `${systemPrompt}|${prompt}`;
  const cachedResponse = getCachedResponse(cacheKey);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ].filter(msg => msg.content !== '');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    const generatedText = response.choices[0].message.content || '';
    cacheResponse(cacheKey, generatedText);
    return generatedText;
  } catch (error) {
    console.error('Error generating text:', error)
    throw error
  }
}
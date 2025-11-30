/**
 * Generic LLM interface that can work with OpenAI, Groq, or Hugging Face
 * Currently configured for OpenAI, but can be easily switched
 */

export interface LLMConfig {
  provider: 'openai' | 'groq' | 'huggingface';
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export interface LLMResponse {
  text: string;
  error?: string;
}

/**
 * Calls the configured LLM to improve a resume bullet point
 */
export async function improveResumeBullet(
  inputText: string,
  config: LLMConfig
): Promise<LLMResponse> {
  const prompt = `You are a professional resume writer. Improve the following resume bullet point to be more impactful, specific, and professional. Keep it concise (one line). Return only the improved bullet point, no explanations.

Original: ${inputText}

Improved:`;

  try {
    switch (config.provider) {
      case 'openai':
        return await callOpenAI(prompt, config);
      case 'groq':
        return await callGroq(prompt, config);
      case 'huggingface':
        return await callHuggingFace(prompt, config);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  } catch (error) {
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * OpenAI API implementation
 */
async function callOpenAI(
  prompt: string,
  config: LLMConfig
): Promise<LLMResponse> {
  const model = config.model || 'gpt-3.5-turbo';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error?.message || `OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content?.trim() || '';

  if (!text) {
    throw new Error('No response from OpenAI');
  }

  return { text };
}

/**
 * Groq API implementation
 */
async function callGroq(prompt: string, config: LLMConfig): Promise<LLMResponse> {
  const model = config.model || 'llama-3.1-8b-instant';
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error?.message || `Groq API error: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.choices[0]?.message?.content?.trim() || '';

  if (!text) {
    throw new Error('No response from Groq');
  }

  return { text };
}

/**
 * Hugging Face API implementation
 */
async function callHuggingFace(
  prompt: string,
  config: LLMConfig
): Promise<LLMResponse> {
  const model = config.model || 'mistralai/Mistral-7B-Instruct-v0.2';
  const baseUrl = config.baseUrl || 'https://api-inference.huggingface.co/models';

  const response = await fetch(`${baseUrl}/${model}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 200,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(
      error.error || `Hugging Face API error: ${response.statusText}`
    );
  }

  const data = await response.json();
  const text = Array.isArray(data) && data[0]?.generated_text
    ? data[0].generated_text.replace(prompt, '').trim()
    : '';

  if (!text) {
    throw new Error('No response from Hugging Face');
  }

  return { text };
}




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
 * Cleans up the LLM response by removing prefixes, quotation marks, and extra formatting
 */
function cleanResponse(text: string): string {
  let cleaned = text.trim();

  // Remove common prefixes (case-insensitive)
  const prefixes = [
    /^Improved Resume Bullet:\s*/i,
    /^Improved Bullet:\s*/i,
    /^Improved:\s*/i,
    /^Resume Bullet:\s*/i,
    /^Bullet:\s*/i,
    /^Output:\s*/i,
    /^Result:\s*/i,
  ];

  for (const prefix of prefixes) {
    cleaned = cleaned.replace(prefix, '');
  }

  // Remove quotation marks at the start and end
  cleaned = cleaned.replace(/^["']+|["']+$/g, '');

  // Remove any leading/trailing colons, dashes, or other punctuation
  cleaned = cleaned.replace(/^[:-\s]+|[:-\s]+$/g, '');

  return cleaned.trim();
}

/**
 * Calls the configured LLM to improve a resume bullet point
 */
export async function improveResumeBullet(
  inputText: string,
  config: LLMConfig
): Promise<LLMResponse> {
  const prompt = `You are a senior FAANG resume coach and professional technical resume writer.

Rewrite the following resume bullet using the Google X–Y–Z formula:

"Accomplished X by doing Y resulting in Z."

Requirements:

- Be extremely specific and impact-focused

- Add realistic, quantifiable metrics (%, $, time, scale, or volume) when possible

- Use strong action verbs and technical language

- Keep it to ONE concise professional resume bullet (one line only)

- Do NOT include explanations, prefixes, or quotation marks

- Return ONLY the improved bullet

Resume Bullet: ${inputText}`;

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
  const rawText = data.choices[0]?.message?.content?.trim() || '';

  if (!rawText) {
    throw new Error('No response from OpenAI');
  }

  return { text: cleanResponse(rawText) };
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
  const rawText = data.choices[0]?.message?.content?.trim() || '';

  if (!rawText) {
    throw new Error('No response from Groq');
  }

  return { text: cleanResponse(rawText) };
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
  const rawText = Array.isArray(data) && data[0]?.generated_text
    ? data[0].generated_text.replace(prompt, '').trim()
    : '';

  if (!rawText) {
    throw new Error('No response from Hugging Face');
  }

  return { text: cleanResponse(rawText) };
}




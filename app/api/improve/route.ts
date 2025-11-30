import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';
import { improveResumeBullet, LLMConfig } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const { inputText } = await request.json();

    if (!inputText || typeof inputText !== 'string' || inputText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    // Configure LLM from environment variables
    const llmProvider = (process.env.LLM_PROVIDER || 'openai') as 'openai' | 'groq' | 'huggingface';
    const llmApiKey = process.env.LLM_API_KEY;

    if (!llmApiKey) {
      return NextResponse.json(
        { error: 'LLM API key not configured. Please set LLM_API_KEY in your .env.local file.' },
        { status: 500 }
      );
    }

    const llmConfig: LLMConfig = {
      provider: llmProvider,
      apiKey: llmApiKey,
      model: process.env.LLM_MODEL,
      baseUrl: process.env.LLM_BASE_URL,
    };

    // Call LLM to improve the bullet point
    const llmResponse = await improveResumeBullet(inputText.trim(), llmConfig);

    if (llmResponse.error || !llmResponse.text) {
      return NextResponse.json(
        { error: llmResponse.error || 'Failed to improve bullet point' },
        { status: 500 }
      );
    }

    // Store in Supabase (only if configured)
    try {
      const supabase = getSupabaseClient();
      const { error: dbError } = await supabase
        .from('requests')
        .insert({
          input_text: inputText.trim(),
          output_text: llmResponse.text,
        } as any);

      if (dbError) {
        console.error('Database error:', dbError);
        // Still return the improved text even if DB save fails
      }
    } catch (supabaseError) {
      console.error('Supabase not configured:', supabaseError);
      // Continue without saving to database
    }

    return NextResponse.json({
      improvedText: llmResponse.text,
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}




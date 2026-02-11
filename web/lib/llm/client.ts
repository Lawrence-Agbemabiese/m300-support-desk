import Anthropic from '@anthropic-ai/sdk';

// Model constants
export const MODELS = {
  default: process.env.CLAUDE_DEFAULT_MODEL || 'claude-sonnet-4-20250514',
  enhanced: process.env.CLAUDE_ENHANCED_MODEL || 'claude-opus-4-20250514',
};

// Create Anthropic client (singleton)
let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

export interface EnhanceOptions {
  useEnhancedMode?: boolean;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Enhance a narrative using Claude API
 */
export async function enhanceNarrative(
  systemPrompt: string,
  userPrompt: string,
  options: EnhanceOptions = {}
): Promise<string> {
  const { useEnhancedMode = false, maxTokens = 1024, temperature = 0.7 } = options;

  const client = getClient();
  const model = useEnhancedMode ? MODELS.enhanced : MODELS.default;

  try {
    const response = await client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract text from response
    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new Error('No text content in response');
    }

    return textBlock.text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw error;
  }
}

/**
 * Stream enhanced narrative using Claude API
 */
export async function* streamEnhanceNarrative(
  systemPrompt: string,
  userPrompt: string,
  options: EnhanceOptions = {}
): AsyncGenerator<string, void, unknown> {
  const { useEnhancedMode = false, maxTokens = 1024, temperature = 0.7 } = options;

  const client = getClient();
  const model = useEnhancedMode ? MODELS.enhanced : MODELS.default;

  try {
    const stream = await client.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield event.delta.text;
      }
    }
  } catch (error) {
    console.error('Claude API streaming error:', error);
    throw error;
  }
}

/**
 * Check if Claude API is configured
 */
export function isConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

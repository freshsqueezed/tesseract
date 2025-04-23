import OpenAI from 'openai';
import type { AIMessage } from '../types';

export class LLM {
  private client: OpenAI;
  private model: string;
  private temperature: number;

  constructor(config: {
    model?: string;
    temperature?: number;
    client?: OpenAI;
  }) {
    this.model = config.model || 'gpt-4o-mini';
    this.temperature = config.temperature ?? 0.1;
    this.client = config.client || new OpenAI();
  }

  async run({ messages }: { messages: AIMessage[] }): Promise<string> {
    const { choices } = await this.client.chat.completions.create({
      model: this.model,
      temperature: this.temperature,
      messages,
    });

    return choices[0]?.message?.content ?? '';
  }
}

import OpenAI from 'openai';
import type { ChatCompletionMessage } from 'openai/resources/chat/completions';
import { zodFunction } from 'openai/helpers/zod';
import type { AIMessage } from '../types';
import { ToolRegistry } from '../registry';

interface LLMRunArgs {
  messages: AIMessage[];
  tools?: ToolRegistry | undefined;
}

interface LLMConfig {
  model?: string;
  temperature?: number;
  client?: OpenAI;
}

export class LLM {
  private client: OpenAI;
  private model: string;
  private temperature: number;

  constructor(config: LLMConfig) {
    this.model = config.model || 'gpt-4o-mini';
    this.temperature = config.temperature ?? 0.1;
    this.client = config.client || new OpenAI();
  }

  async generateImage({ model, prompt, number, size }: any) {
    const response = await this.client.images.generate({
      model,
      prompt,
      n: number,
      size,
    });

    const imageUrl = response.data[0].url!;

    return imageUrl;
  }

  async run({ messages, tools }: LLMRunArgs): Promise<ChatCompletionMessage> {
    const availableTools = tools?.getAll();

    const basePayload = {
      model: this.model,
      temperature: this.temperature,
      messages,
    };

    const toolPayload = availableTools?.length
      ? {
          tools: availableTools.map(zodFunction),
          tool_choice: 'auto' as const,
          parallel_tool_calls: false,
        }
      : {};

    const { choices } = await this.client.chat.completions.create({
      ...basePayload,
      ...toolPayload,
    });
    const [res] = choices;

    return res?.message;
  }
}

import { LLMConfig, AIMessage, LLMProvider } from '../types';
import OpenAI from 'openai';

export default class OpenAILLM implements LLMProvider {
  private model: string;
  private temperature: number;
  private systemPrompt: string;
  private client: OpenAI;

  constructor(config: LLMConfig) {
    this.model = config.model ?? 'gpt-4o-mini';
    this.temperature = config.temperature ?? 0.1;
    this.systemPrompt = config.systemPrompt ?? 'You are a helpful assistant.';
    this.client = new OpenAI();
  }

  async call(messages: AIMessage[]): Promise<string> {
    // const summary = await getSummary();

    const response = await this.client.chat.completions.create({
      model: this.model,
      temperature: this.temperature,
      messages: [
        {
          role: 'system',
          content: `${this.systemPrompt} Conversation summary so far:`,
        },
        ...messages,
      ],
    });

    return response.choices[0].message?.content?.trim() ?? '';
  }

  async generate(systemPrompt: string, userInput: string): Promise<string> {
    return this.call([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userInput },
    ]);
  }
}

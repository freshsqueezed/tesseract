import { LLMProvider, LLMConfig, LLMProviderEnum } from '../types';
import OpenAI from './openai';

export class LLM implements LLMProvider {
  private backend: LLMProvider;

  constructor(config: LLMConfig) {
    switch (config.provider) {
      case LLMProviderEnum.OPEN_AI:
      default:
        this.backend = new OpenAI(config);
        break;
    }
  }

  async call(messages: any[]) {
    return this.backend.call(messages);
  }

  async generate(systemPrompt: string, userInput: string) {
    return this.backend.generate(systemPrompt, userInput);
  }
}

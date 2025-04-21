import { Tool } from '../tool';
import { ToolRegistry } from '../tool/registry';
import { AgentContext, ContextConfig } from '../types';

export class Context implements AgentContext {
  readonly llm;
  readonly memory;
  readonly tools: ToolRegistry;
  readonly config;
  taskPrompt?: string;

  constructor(config: ContextConfig) {
    this.llm = config.llm;
    this.memory = config.memory;
    this.tools = config.tools;
    this.config = config.config ?? {};
  }

  getTool<Input = any, Output = any>(name: string): Tool<Input, Output> {
    return this.tools.get<Input, Output>(name);
  }

  async remember<T = any>(key: string): Promise<T | undefined> {
    return this.memory.get(key);
  }

  async memorize<T = any>(key: string, value: T): Promise<void> {
    return this.memory.set(key, value);
  }

  log(message: string): void {
    if (this.config.debug) {
      console.log(`[Context] ${message}`);
    }
  }
}

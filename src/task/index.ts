import type { TaskConfig, TaskHandler } from '../types';
import type { AgentContext } from '../types';

export class Task<Input = any, Output = any> {
  readonly name: string;
  readonly description: string;
  readonly systemPrompt?: string;
  private readonly handler: TaskHandler<Input, Output>;

  constructor(config: TaskConfig<Input, Output>) {
    this.name = config.name;
    this.description = config.description;
    this.systemPrompt = config.systemPrompt;
    this.handler = config.handler;
  }

  async run(input: Input, context: AgentContext): Promise<Output> {
    context.taskPrompt = this.systemPrompt;
    return await this.handler({ input, context });
  }
}

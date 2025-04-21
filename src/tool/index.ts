import { ZodType } from 'zod';
import type { ToolConfig, ToolFn } from '../types';

export class Tool<Input = any, Output = any> {
  readonly name: string;
  readonly description: string;
  readonly variables: ZodType<Input>;
  readonly handler: ToolFn<Input, Output>;

  constructor(config: ToolConfig<Input, Output>) {
    this.name = config.name;
    this.description = config.description;
    this.variables = config.variables;
    this.handler = config.handler;
  }

  async run(input: unknown): Promise<Output> {
    const parsed = this.variables.parse(input);
    return this.handler({ input: parsed });
  }
}

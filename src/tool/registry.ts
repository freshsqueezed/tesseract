import { Tool } from '.';

export class ToolRegistry {
  private tools: Record<string, Tool<any, any>>;

  constructor(tools: Record<string, Tool<any, any>>) {
    this.tools = tools;
  }

  get<Input = any, Output = any>(name: string): Tool<Input, Output> {
    const tool = this.tools[name];
    if (!tool) throw new Error(`Tool "${name}" not found in registry`);
    return tool as Tool<Input, Output>;
  }

  entries(): [string, Tool<any, any>][] {
    return Object.entries(this.tools);
  }
}

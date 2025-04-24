import { ChatCompletionMessageToolCall } from 'openai/resources/chat/completions';
import { Tool } from '../tool';
import { Context } from '../context';

interface ToolRegistryConfig {
  tools: Tool[];
}

export class ToolRegistry {
  private toolMap: Record<string, Tool>;

  constructor(config: ToolRegistryConfig) {
    this.toolMap = config.tools.reduce(
      (acc, tool) => {
        acc[tool.name] = tool;
        return acc;
      },
      {} as Record<string, Tool>,
    );
  }

  getAll(): Tool[] {
    return Object.values(this.toolMap);
  }

  get(name: string): Tool | undefined {
    return this.toolMap[name];
  }

  async execute(
    toolCall: ChatCompletionMessageToolCall,
    userInput: string,
    context: Context,
  ): Promise<string | undefined> {
    const toolName = toolCall.function.name;
    const tool = this.toolMap[toolName];

    if (!tool) {
      throw new Error(`Tool not found in registry: ${toolName}`);
    }

    const parsedArgs = JSON.parse(toolCall.function.arguments || '{}');

    return await tool.handler({
      userInput,
      toolArgs: parsedArgs,
      context,
    });
  }
}

import { ChatCompletionMessageToolCall } from 'openai/resources/chat/completions';
import { Tool } from '../tool';

type ToolMap = Record<string, Tool>;

export class ToolRegistry {
  private tools: ToolMap;

  constructor(tools: ToolMap) {
    this.tools = tools;
  }

  getAll(): Tool[] {
    return Object.values(this.tools);
  }

  get(name: string): Tool | undefined {
    return this.tools[name];
  }

  async execute(
    toolCall: ChatCompletionMessageToolCall,
    userInput: string,
  ): Promise<string> {
    const toolName = toolCall.function.name;
    const tool = this.tools[toolName];

    if (!tool) {
      throw new Error(`Tool not found in registry: ${toolName}`);
    }

    const parsedArgs = JSON.parse(toolCall.function.arguments || '{}');

    return await tool.handler({
      userInput,
      toolArgs: parsedArgs,
    });
  }
}

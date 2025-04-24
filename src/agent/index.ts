import { Context } from '../context';
import { AIMessage } from '../types';

export class Agent {
  public readonly name: string;
  public readonly description: string;
  private context: Context;

  constructor(config: { name: string; description: string; context: Context }) {
    this.name = config.name;
    this.description = config.description;
    this.context = config.context;
  }

  async run(input: string): Promise<AIMessage[] | undefined> {
    try {
      await this.context.store.addMessages([
        {
          role: 'user',
          content: input,
        },
      ]);

      const maxTurns = 10;
      let turn = 0;

      while (turn < maxTurns) {
        turn++;

        const history = await this.context.store.getMessages();

        const response = await this.context.llm.run({
          messages: history,
          tools: this.context.registry,
        });

        await this.context.store.addMessages([response]);

        if (response.content) {
          return await this.context.store.getMessages();
        }

        if (response.tool_calls?.length) {
          const [toolCall] = response.tool_calls;

          const toolResponse = await this.context.registry?.execute(
            toolCall,
            input,
            this.context,
          );

          await this.context.store.saveToolResponse(
            toolCall.id,
            toolResponse as string,
          );
        } else {
          break;
        }
      }

      return await this.context.store.getMessages();
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message);
      }
    }
  }
}

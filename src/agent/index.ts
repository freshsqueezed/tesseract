import type { AIMessage } from '../types';
import type { Store } from '../memory';
import { LLM } from '../llm';

export class Agent {
  public readonly name: string;
  public readonly description: string;
  private store: Store;
  private llm: LLM;

  constructor(config: {
    name: string;
    description: string;
    store: Store;
    llm: LLM;
  }) {
    this.name = config.name;
    this.description = config.description;
    this.store = config.store;
    this.llm = config.llm;
  }

  async run(input: string | { messages: AIMessage[] }): Promise<string> {
    const history = await this.store.getMessages();

    const newMessages =
      typeof input === 'string'
        ? [{ role: 'user', content: input } as const]
        : input.messages.slice(history.length);

    const context = [...history, ...newMessages];

    const res = await this.llm.run({
      messages: context,
    });

    await this.store.addMessages([
      ...newMessages,
      {
        role: 'assistant',
        content: res,
      },
    ]);

    return res;
  }
}

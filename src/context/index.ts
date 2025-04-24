import { LLM } from '../llm';
import { Store } from '../memory';
import { ToolRegistry } from '../registry';

interface ContextConfig {
  llm: LLM;
  store: Store;
  registry?: ToolRegistry;
}

export class Context {
  public llm: LLM;
  public readonly store: Store;
  public readonly registry: ToolRegistry | undefined;

  constructor(config: ContextConfig) {
    this.llm = config.llm;
    this.store = config.store;
    this.registry = config.registry;
  }
}

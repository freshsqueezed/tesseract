import { AgentConfig, Flow } from '../types';

export class Agent {
  public readonly name: string;
  public readonly description: string;
  public readonly context: AgentConfig['context'];
  public readonly flows: Flow[];

  constructor(config: AgentConfig) {
    this.name = config.name;
    this.description = config.description;
    this.context = config.context;
    this.flows = config.flows ?? [];
  }

  async runFlow(name: string, input: any): Promise<any> {
    const flow = this.flows.find((f) => f.name === name);
    if (!flow) throw new Error(`Flow "${name}" not found`);
    return flow.run(input, this.context);
  }

  async run(input: string): Promise<any> {
    return this.runFlow('schedule_event', input);
  }
}

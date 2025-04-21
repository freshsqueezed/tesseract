import type { AgentContext, Task } from '../types';

export class Flow {
  readonly name: string;
  readonly tasks: Task<any, any>[];

  constructor({ name, tasks }: { name: string; tasks: Task<any, any>[] }) {
    this.name = name;
    this.tasks = tasks;
  }

  async run(input: any, context: AgentContext): Promise<any> {
    let current = input;

    for (const task of this.tasks) {
      context.log?.(`Flow: Running task "${task.name}"`);
      current = await task.run(current, context);
      await context.memorize?.(`flow:${this.name}:${task.name}`, current);
    }

    return current;
  }
}

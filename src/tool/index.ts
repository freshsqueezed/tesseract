import { z, ZodType } from 'zod';

export interface ToolType {
  name: string;
  description?: string | undefined;
  parameters: z.ZodTypeAny;
  handler: (args: { userInput: string; toolArgs: any }) => Promise<unknown>;
}

export class Tool implements ToolType {
  name: string;
  description?: string;
  parameters: ZodType<any, any>;
  handler: (args: any, context?: any) => Promise<any>;

  constructor(config: {
    name: string;
    description?: string;
    parameters: ZodType<any, any>;
    handler: (args: any, context?: any) => Promise<any>;
  }) {
    this.name = config.name;
    this.description = config.description;
    this.parameters = config.parameters;
    this.handler = config.handler;
  }
}

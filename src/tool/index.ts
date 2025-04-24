import { z, ZodType } from 'zod';
import { Context } from '../context';

export interface ToolType {
  name: string;
  description?: string;
  parameters: z.ZodTypeAny;
  handler: (args: {
    userInput: string;
    toolArgs: any;
    context: Context;
  }) => Promise<unknown>;
}

export class Tool implements ToolType {
  name: string;
  description?: string;
  parameters: ZodType<any, any>;
  handler: (args: {
    userInput: string;
    toolArgs: any;
    context: Context;
  }) => Promise<any>;

  constructor(config: {
    name: string;
    description?: string;
    parameters: ZodType<any, any>;
    handler: (args: {
      userInput: string;
      toolArgs: any;
      context: Context;
    }) => Promise<any>;
  }) {
    this.name = config.name;
    this.description = config.description;
    this.parameters = config.parameters;
    this.handler = config.handler;
  }
}

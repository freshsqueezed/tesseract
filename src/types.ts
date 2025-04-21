import { ZodType } from 'zod';
import type { Tool } from './tool';
import type { ToolRegistry } from './tool/registry';

/* ============================================================================
 * LLM Types
 * ============================================================================
 */

export type AIMessage =
  | { role: 'system' | 'user' | 'assistant'; content: string }
  | { role: 'tool'; content: string; tool_call_id: string };

export type LLMProviderType = 'openai' | 'anthropic' | 'custom';

export enum LLMProviderEnum {
  OPEN_AI = 'openai',
  ANTRHOPIC = 'anthropic',
}

export interface LLMConfig {
  provider?: LLMProviderType;
  model?: string;
  temperature?: number;
  systemPrompt?: string;
  tools?: Tool[];
}

/**
 * Every LLM implementation should match this interface.
 */
export interface LLMProvider {
  call(messages: AIMessage[]): Promise<string>;
  generate(systemPrompt: string, userInput: string): Promise<string>;
}

/* ============================================================================
 * Tool Types
 * ============================================================================
 */

export type ToolFn<Input, Output> = (args: { input: Input }) => Promise<Output>;

export interface ToolConfig<Input = any, Output = any> {
  name: string;
  description: string;
  variables: ZodType<Input>;
  handler: ToolFn<Input, Output>;
}

/* ============================================================================
 * Task Types
 * ============================================================================
 */

export type TaskHandler<Input = any, Output = any> = (args: {
  input: Input;
  context: AgentContext;
}) => Promise<Output>;

export interface TaskConfig<Input = any, Output = any> {
  name: string;
  description: string;
  handler: TaskHandler<Input, Output>;
  systemPrompt?: string;
}

export interface Task<Input = any, Output = any> {
  name: string;
  description: string;
  systemPrompt?: string;
  run(input: Input, context: AgentContext): Promise<Output>;
}

/* ============================================================================
 * Flow Types
 * ============================================================================
 */

export interface FlowConfig {
  name: string;
  tasks: Task<any, any>[];
}

export interface Flow {
  name: string;
  tasks: Task<any, any>[];
  run(input: any, context: AgentContext): Promise<any>;
}

/* ============================================================================
 * Memory Types
 * ============================================================================
 */

export interface Memory {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  clear?(): Promise<void>;
}

/* ============================================================================
 * Context Types
 * ============================================================================
 */
export interface ContextConfig {
  llm: LLMProvider;
  memory: Memory;
  tools: ToolRegistry;
  config?: Record<string, any>;
}

export interface AgentContext {
  llm: LLMProvider;
  memory: Memory;
  tools: ToolRegistry;
  config?: Record<string, any>;
  taskPrompt?: string;
  getTool<Input = any, Output = any>(name: string): Tool<Input, Output>;
  remember<T = any>(key: string): Promise<T | undefined>;
  memorize<T = any>(key: string, value: T): Promise<void>;
  log(message: string): void;
}

/* ============================================================================
 * Agent Types
 * ============================================================================
 */

export interface AgentConfig {
  name: string;
  description: string;
  context: AgentContext;
  flows?: Flow[];
}

export interface Memory {
  get<T = unknown>(key: string): Promise<T | undefined>;
  set<T = unknown>(key: string, value: T): Promise<void>;
  clear?(): Promise<void>;
}

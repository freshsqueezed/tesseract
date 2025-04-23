import {
  ChatCompletionAssistantMessageParam,
  ChatCompletionUserMessageParam,
  ChatCompletionSystemMessageParam,
  ChatCompletionToolMessageParam,
} from 'openai/resources/chat/completions';

export type AIMessage =
  | ChatCompletionUserMessageParam
  | ChatCompletionAssistantMessageParam
  | ChatCompletionSystemMessageParam
  | ChatCompletionToolMessageParam;

export interface ToolFn<A = unknown, T = unknown> {
  (input: { userMessage: string; toolArgs: A }): Promise<T>;
}

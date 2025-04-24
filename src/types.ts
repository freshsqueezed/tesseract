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

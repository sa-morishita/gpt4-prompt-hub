import type { MessageType } from "~/models/prompt";

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface OpenAIStreamPayload {
  model: string;
  messages: Omit<MessageType, "exampleIndex" | "messageIndex">[];
  temperature: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  max_tokens: number;
  stream: boolean;
  n: number;
}

export interface OpenAIStreamResponse {
  choices: {
    delta: {
      content: string;
    };
    finish_reason: null;
    index: number;
  }[];
  created: number;
  id: string;
  model: string;
  object: string;
}

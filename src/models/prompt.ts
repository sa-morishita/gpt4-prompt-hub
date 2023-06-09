import { Role } from "@prisma/client";
import { z } from "zod";

export interface MessageType {
  role: Role;
  content: string;
  exampleIndex: number;
  messageIndex: number;
}

export const messageSchema = z.object({
  role: z.nativeEnum(Role),
  content: z.string().min(1),
  exampleIndex: z.number(),
  messageIndex: z.number(),
}) satisfies z.ZodType<MessageType>;

export interface MessageFormType {
  messages: MessageType[];
}

export const messageFormSchema = z.object({
  messages: z.array(messageSchema),
}) satisfies z.ZodType<MessageFormType>;

export interface PromptFormType {
  title: string;
  description: string;
  referenceUrl?: string;
}

export const promptFormSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  referenceUrl: z.string().optional(),
}) satisfies z.ZodType<PromptFormType>;

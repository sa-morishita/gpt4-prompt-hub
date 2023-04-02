import { z } from "zod";

const Role = z.enum(["system", "assistant", "user"]);

export interface MessageFormType {
  role: "system" | "assistant" | "user";
  content: string;
}

export const messageFormSchema = z.object({
  role: Role,
  content: z.string(),
}) satisfies z.ZodType<MessageFormType>;

export interface PromptFormType {
  title: string;
  description: string;
}

export const promptFormSchema = z.object({
  title: z.string().min(10),
  description: z.string().max(500),
}) satisfies z.ZodType<PromptFormType>;

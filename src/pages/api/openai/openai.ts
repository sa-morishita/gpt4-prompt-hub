import { env } from "~/env.mjs";
import type { OpenAIStreamPayload } from "~/models/openai";
import type { MessageType } from "~/models/prompt";
import { OpenAIStream } from "~/utils/openAIStream";

if (!env.OPENAI_API_KEY) {
  throw new Error("Missing env var from OpenAI");
}

export const config = {
  runtime: "edge",
};

export default async function POST(req: Request): Promise<Response> {
  const { messages } = (await req.json()) as {
    messages: Omit<MessageType, "exampleIndex" | "messageIndex">[];
  };

  if (!messages.length)
    return new Response(null, {
      status: 404,
      statusText: "テキストがありません",
    });

  const payload: OpenAIStreamPayload = {
    model: env.OPENAI_API_MODEL,
    messages,
    temperature: 0.8,
    top_p: 0.8,
    frequency_penalty: 0,
    presence_penalty: 0,
    // [ ] Maxトークンの値
    // max_tokens: 4000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

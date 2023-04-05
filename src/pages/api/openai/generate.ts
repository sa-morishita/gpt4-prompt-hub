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
      statusText: "プロンプトがありません",
    });

  const payload: OpenAIStreamPayload = {
    model: env.OPENAI_API_MODEL,
    messages,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

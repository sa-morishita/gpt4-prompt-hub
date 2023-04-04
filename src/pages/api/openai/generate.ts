import type { NextRequest } from "next/server";
import { OpenAI } from "openai-streams";
import { env } from "~/env.mjs";
import type { MessageType } from "~/models/prompt";

export default async function handler(req: NextRequest) {
  const { messages } = (await req.json()) as {
    messages: Omit<MessageType, "exampleIndex" | "messageIndex">[];
  };

  if (!messages.length)
    return new Response(null, {
      status: 404,
      statusText: "プロンプトがありません",
    });

  const stream = await OpenAI(
    "chat",
    {
      model: "gpt-4",
      messages,
    },
    { apiKey: env.OPENAI_API_KEY }
  );

  return new Response(stream);
}

export const config = {
  runtime: "edge",
};

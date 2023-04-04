import type { NextRequest } from "next/server";
import { OpenAI } from "openai-streams";
import { env } from "~/env.mjs";
import type { MessageType } from "~/models/prompt";

const handler = async (req: NextRequest) => {
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
      model: env.OPENAI_API_MODEL,
      temperature: 1,
      frequency_penalty: 0,
      messages,
    },
    { apiKey: env.OPENAI_API_KEY }
  );

  return new Response(stream);
};

export default handler;

export const config = {
  runtime: "edge",
};

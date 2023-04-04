/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { OpenAI } from "openai-streams";
import { env } from "~/env.mjs";

export default async function handler(req: {
  json: () => PromiseLike<{ messages: any }> | { messages: any };
}) {
  const { messages } = await req.json();

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

import { OpenAI } from "openai-streams";
import { env } from "~/env.mjs";

export default async function handler() {
  const stream = await OpenAI(
    "chat",
    {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "人を楽しくさせる詩を50文字以内で書いてください",
        },
        { role: "user", content: "天気に関わるものでお願いします。" },
      ],
    },
    { apiKey: env.OPENAI_API_KEY }
  );

  return new Response(stream);
}

export const config = {
  runtime: "edge",
};

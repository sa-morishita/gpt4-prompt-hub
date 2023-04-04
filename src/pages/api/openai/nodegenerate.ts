import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams/node";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const stream = await OpenAI(
    "completions",
    {
      model: "text-davinci-003",
      prompt: "人を楽しくさせる詩を書いてください。",
      max_tokens: 250,
    },
    { apiKey: process.env.OPENAI_API_KEY }
  );

  stream.pipe(res);
}

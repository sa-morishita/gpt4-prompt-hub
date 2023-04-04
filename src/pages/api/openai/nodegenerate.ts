import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams/node";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const stream = await OpenAI(
    "completions",
    {
      model: "text-davinci-003",
      prompt: "Write a happy sentence.\n\n",
      max_tokens: 25,
    },
    { apiKey: process.env.OPENAI_API_KEY }
  );

  stream.pipe(res);
}

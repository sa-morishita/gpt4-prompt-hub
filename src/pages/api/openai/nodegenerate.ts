import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai-streams/node";

export default async function test(_: NextApiRequest, res: NextApiResponse) {
  const stream = await OpenAI(
    "chat",
    {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "与えられた英語を含む、TOEIC学習にふさわしい英文とその日本語翻訳文のペアを1つ作る",
        },
        { role: "user", content: "explore" },
      ],
    },
    { apiKey: process.env.OPENAI_API_KEY }
  );

  stream.pipe(res);
}

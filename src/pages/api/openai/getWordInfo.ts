/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

/* eslint-disable @typescript-eslint/restrict-template-expressions */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  text: string;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { prompt } = req.body;

  if (!prompt || prompt.length === 0)
    return res.status(400).json({ text: "テキストがありません" });

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "1.与えられた英語を含む、TOEIC学習にふさわしい英文とその日本語翻訳文のペアを3つ作る（文の先頭に数字と.は付けない）\n2.その3つのペアをstringとして順番に並べる\n3.全ての英文と日本文、日本文と英文の間に英字の#を入れる\n4.stringの一番後ろに英字の#がない時は英字の#を1つ追加\n5.その後ろに与えられた英語についてのTOEIC学習者用の日本語解説文を追加\n6.全ての改行を削除\n7.完成したstringを返答",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1000,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const resultArray = response.data.choices[0].message.content;
    resultArray.split("\n").filter((text: string) => text.trim().length > 0);

    res.status(200).json({ text: resultArray.trim() });
  } catch (error) {
    console.error("例文の生成に失敗しました:", error);
    res.status(500).json({ text: "例文の生成に失敗しました" });
  }
}

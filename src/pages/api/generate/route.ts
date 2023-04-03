import { OpenAI } from "openai-streams";

export default async function handler() {
  const stream = await OpenAI(
    "chat",
    {
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "いくつか食材を提示します。食材の一部としてそれらの食材を全て使って作れる料理を表形式で2つ、できるだけ簡潔に教えて下さい。また、作り方もとても簡潔に教えて下さい。必ずMarkdown形式で返答してください。",
        },
        {
          role: "user",
          content: "豚肉、こんにゃく",
        },
        // {
        //   role: "system",
        //   content: "あなたはnext.jsの専門家です。",
        // },
        // {
        //   role: "user",
        //   content: "next.jsでisrを使うにはどうしたら良いでしょう？",
        // },
      ],
    },
    { apiKey: process.env.OPENAI_API_KEY }
  );

  return new Response(stream);
}

export const config = {
  runtime: "edge",
};

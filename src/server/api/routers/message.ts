import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { env } from "~/env.mjs";
import type { OpenAIResponse } from "~/models/openai";
import type { MessageType } from "~/models/prompt";
import { messageFormSchema } from "~/models/prompt";

export const messageRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(messageFormSchema.and(z.object({ promptId: z.string() })))
    .mutation(async ({ ctx: { prisma }, input: { messages, promptId } }) => {
      try {
        const fixed = messages.map((message) => {
          const { role, content } = message;
          return { role, content };
        });

        const response = await axios.post<OpenAIResponse>(
          "https://api.openai.com/v1/chat/completions",
          {
            model: env.OPENAI_API_MODEL,
            messages: fixed,
            temperature: 0.8,
            max_tokens: 1000,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.OPENAI_API_KEY}`,
            },
          }
        );

        const content = response.data.choices[0]?.message.content;

        if (!content || !messages[0]) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "openai api not working",
          });
        }

        messages.push({
          role: "assistant",
          content,
          exampleIndex: messages[0].exampleIndex,
          messageIndex: messages.length,
        });

        const messageCreate = async (message: MessageType) => {
          const { role, content, exampleIndex, messageIndex } = message;

          await prisma.message.create({
            data: {
              role,
              content,
              exampleIndex,
              messageIndex,

              prompt: {
                connect: {
                  id: promptId,
                },
              },
            },
          });
        };

        // 初回（messages.length < 4）は全て保存、2回目以降は最後の2つだけ保存
        const promiseArray = messages
          .filter((message, index) => {
            if (messages.length < 4) {
              return message;
            } else if (
              index === messages.length - 2 ||
              index === messages.length - 1
            ) {
              return message;
            }
          })
          .map(messageCreate);

        await Promise.all(promiseArray);

        return content;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "openai api not working",
        });
      }
    }),
});

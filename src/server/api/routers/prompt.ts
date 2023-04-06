import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { promptFormSchema } from "~/models/prompt";

export const promptRouter = createTRPCRouter({
  createPrompt: protectedProcedure
    .input(
      promptFormSchema.and(
        z.object({
          tagsIds: z
            .array(
              z.object({
                id: z.string(),
              })
            )
            .optional(),
        })
      )
    )
    .mutation(
      async ({
        ctx: { prisma, session },
        input: { title, description, referenceUrl, tagsIds },
      }) => {
        const isUsed = await prisma.prompt.findUnique({
          where: {
            title,
          },
        });

        if (isUsed) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "このタイトルのプロンプトがすでに存在します",
          });
        }

        const newPrompt = await prisma.prompt.create({
          data: {
            title,
            description,
            referenceUrl,
            model: env.OPENAI_API_MODEL,
            user: {
              connect: {
                id: session.user.id,
              },
            },
            tags: {
              connect: tagsIds,
            },
          },
        });
        return newPrompt.id;
      }
    ),
});

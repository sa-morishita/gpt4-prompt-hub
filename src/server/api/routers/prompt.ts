import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
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
  getPrompts: publicProcedure.query(async ({ ctx: { prisma } }) => {
    const prompts = await prisma.prompt.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        model: true,
        description: true,
        createdAt: true,
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return prompts;
  }),

  getPromptById: publicProcedure
    .input(
      z.object({
        promptId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { promptId } }) => {
      const prompt = await prisma.prompt.findUnique({
        where: {
          id: promptId,
        },
        select: {
          id: true,
          title: true,
          model: true,
          description: true,
          referenceUrl: true,
          messages: {
            select: {
              role: true,
              content: true,
              exampleIndex: true,
              messageIndex: true,
            },
          },
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
          createdAt: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!prompt) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "プロンプトが見つかりません。",
        });
      }

      return prompt;
    }),

  getPromptsByTag: publicProcedure
    .input(
      z.object({
        tagId: z.string(),
      })
    )
    .query(async ({ ctx: { prisma }, input: { tagId } }) => {
      const prompts = await prisma.prompt.findMany({
        where: {
          tags: {
            some: {
              id: tagId,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          title: true,
          model: true,
          description: true,
          createdAt: true,
          tags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return prompts;
    }),

  deletePrompt: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx: { prisma }, input: { id } }) => {
      await prisma.prompt.delete({
        where: {
          id,
        },
      });
    }),
});

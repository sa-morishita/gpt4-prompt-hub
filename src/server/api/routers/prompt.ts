import { promptFormSchema } from "~/models/prompt";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { env } from "~/env.mjs";
import { TRPCError } from "@trpc/server";

export const promptRouter = createTRPCRouter({
  createPrompt: protectedProcedure
    .input(promptFormSchema)
    .mutation(
      async ({ ctx: { prisma, session }, input: { title, description } }) => {
        const isUsed = await prisma.prompt.findUnique({
          where: {
            title,
          },
        });

        if (isUsed) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "title already exists!",
          });
        }

        const newPrompt = await prisma.prompt.create({
          data: {
            title,
            description,
            model: env.OPENAI_API_MODEL,
            user: {
              connect: {
                id: session.user.id,
              },
            },
          },
        });
        return newPrompt.id;
      }
    ),
});

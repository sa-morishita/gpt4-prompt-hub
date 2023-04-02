import { promptFormSchema } from "~/models/prompt";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const promptRouter = createTRPCRouter({
  createPrompt: protectedProcedure
    .input(promptFormSchema)
    .mutation(
      async ({ ctx: { prisma, session }, input: { title, description } }) => {
        const newPrompt = await prisma.prompt.create({
          data: {
            title,
            description,
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

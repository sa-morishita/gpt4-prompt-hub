import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { messageFormSchema } from "~/models/prompt";

export const messageRouter = createTRPCRouter({
  createMessages: protectedProcedure
    .input(messageFormSchema.and(z.object({ promptId: z.string() })))
    .mutation(async ({ ctx: { prisma }, input: { messages, promptId } }) => {
      const promises = messages.map(async (message) => {
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
      });

      await Promise.all(promises);
    }),
});

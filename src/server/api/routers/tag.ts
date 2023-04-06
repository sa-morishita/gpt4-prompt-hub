import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { tagCreateSchema } from "~/models/tag";

export const tagRouter = createTRPCRouter({
  createTag: protectedProcedure
    .input(tagCreateSchema)
    .mutation(async ({ ctx: { prisma }, input: { name, description } }) => {
      const tag = await prisma.tag.findUnique({
        where: {
          name,
        },
      });

      if (tag) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "このタグはすでに存在します",
        });
      }

      await prisma.tag.create({
        data: {
          name,
          description,
        },
      });
    }),

  getTags: publicProcedure.query(async ({ ctx: { prisma } }) => {
    return await prisma.tag.findMany();
  }),
});

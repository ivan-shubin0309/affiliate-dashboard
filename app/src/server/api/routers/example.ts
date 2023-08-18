import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: protectedProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.merchants.findMany();
  }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});

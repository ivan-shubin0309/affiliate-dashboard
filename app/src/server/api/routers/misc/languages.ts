import { protectedProcedure } from "../../trpc";
import { SelectSchema } from "../../../db-schema-utils";
import { z } from "zod";

export const getLanguages = protectedProcedure
  .output(SelectSchema(z.string().length(3)))
  .query(async ({ ctx }) => {
    const data = await ctx.prisma.languages.findMany({
      where: { id: { gt: 1 }, valid: 1 },
      select: { lngCode: true, title: true },
    });

    return data.map(({ lngCode, title }) => ({ id: lngCode, title }));
  });

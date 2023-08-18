import { protectedProcedure } from "../../trpc";
import { SelectSchema } from "../../../db-schema-utils";
import { z } from "zod";

export const getCountries = protectedProcedure
  .output(SelectSchema(z.number()))
  .query(async ({ ctx }) => {
    const data = await ctx.prisma.countries.findMany({
      where: { id: { gt: 1 } },
      select: { id: true, title: true },
    });

    return data;
  });

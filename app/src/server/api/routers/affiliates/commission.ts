import { number, string, z } from "zod";

import { protectedProcedure } from "../../trpc";
import { checkIsUser } from "@/server/api/utils";

export const getCommissions = protectedProcedure.query(async ({ ctx }) => {
  const affiliate_id = checkIsUser(ctx);
  const results = await ctx.prisma.merchants.findMany({
    where: {
      valid: 1,
    },
    orderBy: [
      {
        id: "asc",
      },
    ],
  });

  return await Promise.all(
    results.map(async (merchant) => {
      const deals = await ctx.prisma.affiliates_deals.findMany({
        distinct: ["dealType"],
        where: {
          affiliate_id,
          merchant_id: merchant.id,
          valid: true,
        },
        orderBy: [
          {
            id: "desc",
          },
        ],
      });
      return {
        id: merchant.id,
        name: merchant.name,
        deals,
      };
    })
  );
});

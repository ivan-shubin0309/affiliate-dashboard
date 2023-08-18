import { z } from "zod";

import { protectedProcedure } from "../../trpc";
import { affiliates_profilesModel } from "../../../../../prisma/zod";
import { upsertSchema } from "../../../../../prisma/zod-add-schema";
import { checkIsUser } from "@/server/api/utils";

export const getProfiles = protectedProcedure.query(async ({ ctx }) => {
  const affiliate_id = checkIsUser(ctx);
  const data = await ctx.prisma.affiliates_profiles.findMany({
    where: {
      affiliate_id,
      // valid: 1,
    },
  });

  return data;
});

export const upsertProfile = protectedProcedure
  .input(
    upsertSchema(
      affiliates_profilesModel
        .pick({
          name: true,
          url: true,
          valid: true,
          description: true,
          source_traffic: true,
        })
        .extend({ id: affiliates_profilesModel.shape.id.optional() })
    )
  )
  .mutation(async ({ ctx, input: { id, ...data } }) => {
    const affiliate_id = checkIsUser(ctx);
    return await (id
      ? ctx.prisma.affiliates_profiles.update({
          where: { id },
          data,
        })
      : ctx.prisma.affiliates_profiles.create({
          data: { id, ...data, rdate: new Date(), affiliate_id },
        }));
  });

export const deleteProfile = protectedProcedure
  .input(
    affiliates_profilesModel.pick({
      id: true,
    })
  )
  .mutation(async ({ ctx, input: { id } }) => {
    return await ctx.prisma.affiliates_profiles.delete({
      where: { id },
    });
  });

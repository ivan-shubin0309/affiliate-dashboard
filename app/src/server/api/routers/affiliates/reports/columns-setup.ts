import { protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { checkIsUser } from "@/server/api/utils";

export const getReportsColumns = protectedProcedure
  .input(
    z.object({
      level: z.enum(["affiliate", "admin"]),
      report: z.string(),
    })
  )
  .output(z.array(z.string()))
  .query(async ({ ctx, input: { level, report } }) => {
    const affiliate_id = checkIsUser(ctx);
    const location = `${level}=>${report}`;
    const data = await ctx.prisma.reports_fields.findFirst({
      where: {
        user_id: affiliate_id,
        userlevel: level,
        location,
      },
    });
    return data?.removed_fields.split("|") || [];
  });

export const upsertReportsColumns = protectedProcedure
  .input(
    z.object({
      level: z.enum(["affiliate", "admin"]),
      report: z.string(),
      fields: z.array(z.string()),
    })
  )
  .output(z.array(z.string()))
  .mutation(async ({ ctx, input: { level, report, fields } }) => {
    const affiliate_id = checkIsUser(ctx);
    const location = `${level}=>${report}`;
    const exists = await ctx.prisma.reports_fields.findFirst({
      where: {
        user_id: affiliate_id,
        userlevel: level,
        location: location,
      },
    });

    const removed_fields = fields?.join("|") || "";
    const answer = await (exists
      ? ctx.prisma.reports_fields.update({
          where: {
            id: exists.id,
          },
          data: {
            removed_fields,
          },
        })
      : ctx.prisma.reports_fields.create({
          data: {
            userlevel: level,
            user_id: affiliate_id,
            rdate: new Date(),
            location: location,
            removed_fields,
          },
        }));

    return answer.removed_fields.split("|") || [];
  });

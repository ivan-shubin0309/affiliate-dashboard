import { z } from "zod";

import { protectedProcedure } from "../../trpc";
import { affiliates_ticketsModel } from "../../../../../prisma/zod";
import { affiliates_tickets_status } from "@prisma/client";
import { upsertSchema } from "../../../../../prisma/zod-add-schema";
import { checkIsUser } from "@/server/api/utils";

export const getTickets = protectedProcedure.query(async ({ ctx }) => {
  const affiliate_id = checkIsUser(ctx);
  const data = await ctx.prisma.affiliates_tickets.findMany({
    where: {
      affiliate_id,
      // valid: 1,
    },
  });

  return data;
});

export const upsertTicket = protectedProcedure
  .input(
    upsertSchema(
      affiliates_ticketsModel
        .pick({
          subject: true,
          reply_email: true,
          text: true,
        })
        .extend({ id: affiliates_ticketsModel.shape.id.optional() })
    )
  )
  .mutation(async ({ ctx, input: { id, ...data } }) => {
    const affiliate_id = checkIsUser(ctx);
    return await (id
      ? ctx.prisma.affiliates_tickets.update({
          where: { id },
          data: {
            ...data,
            last_update: new Date(),
          },
        })
      : ctx.prisma.affiliates_tickets.create({
          data: {
            id,
            ...data,
            rdate: new Date(),
            last_update: new Date(),
            ticket_id: 0,
            admin_id: 0,
            group_id: 5,
            status: affiliates_tickets_status.open,
            readed: 0,
            merchant_id: 0,
            aff_readed: false,
            affiliate_id,
          },
        }));
  });

export const deleteTicket = protectedProcedure
  .input(
    affiliates_ticketsModel.pick({
      id: true,
    })
  )
  .mutation(async ({ ctx, input: { id } }) => {
    return await ctx.prisma.affiliates_tickets.delete({
      where: { id },
    });
  });

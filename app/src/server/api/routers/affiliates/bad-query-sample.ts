import { protectedProcedure } from "@/server/api/trpc";
import { sub } from "date-fns";
import { merchant_id } from "@/server/api/routers/affiliates/const";
import { checkIsUser } from "@/server/api/utils";

export const badQuerySample = protectedProcedure.query(async ({ ctx }) => {
  const affiliate_id = checkIsUser(ctx);
  const from = sub(new Date(), { months: 6 });
  const to = new Date();

  const arrFtd = await ctx.prisma.data_reg.findMany({
    where: {
      NOT: {
        type: "demo",
      },
      // FTDqualificationDate: {
      //   gt: from,
      //   lt: to,
      // },
      affiliate_id: affiliate_id ? affiliate_id : 1,
      merchant_id: merchant_id ? merchant_id : 1,
    },
  });

  return arrFtd;
});

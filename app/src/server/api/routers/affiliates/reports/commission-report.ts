import { protectedProcedure } from "@/server/api/trpc";
import { checkIsUser } from "@/server/api/utils";
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import {
  exportReportLoop,
  exportType,
  getPageOffset,
  getSortingInfo,
  PageParamsSchema,
  reportColumns,
  SortingParamSchema,
} from "./reports-utils";

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  commission: z.string().optional(),
  trader_id: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const commissionSummary = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    from,
    to,
    trader_id,
    commission,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);
  const orderBy = getSortingInfo(sortingParam);

  let deal_filter = {};
  switch (commission) {
    case "CPA":
      deal_filter = { DealType: "CPA" };
      break;

    case "NetDeposit":
      deal_filter = { DealType: "NetDeposit" };
      break;

    case "PNLRevShare":
      deal_filter = { DealType: "PNL RevShare" };

      break;
  }

  const data = await prisma.commissions.findMany({
    take: pageParams.pageSize,
    skip: offset,
    orderBy,
    where: {
      ...deal_filter,
      Date: {
        gte: from,
        lt: to,
      },
      affiliate_id,
      traderID: trader_id ? trader_id : "",
    },
    include: {
      merchant: {
        select: {
          name: true,
        },
      },
      affiliate: {
        select: {
          username: true,
        },
      },
    },
  });

  console.log("commission report ----->", data);

  return {
    data: data,
    totals: {},
    pageInfo: {
      ...pageParams,
      totalItems: data.length,
    },
  };
};

export const getCommissionReport = protectedProcedure
  .input(InputWithPageInfo)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return commissionSummary(ctx.prisma, affiliate_id, input);
  });

export const exportCommissionReport = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;

    const affiliate_id = checkIsUser(ctx);

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        commissionSummary(ctx.prisma, affiliate_id, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

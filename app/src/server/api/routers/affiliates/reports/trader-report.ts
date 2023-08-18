/* eslint-disable @typescript-eslint/no-unsafe-call */
import { merchant_id } from "@/server/api/routers/affiliates/const";
import {
  PageParamsSchema,
  SortingParamSchema,
  exportReportLoop,
  exportType,
  getPageOffset,
  getSortingInfo,
  pageInfo,
  reportColumns,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { protectedProcedure } from "@/server/api/trpc";
import { checkIsUser } from "@/server/api/utils";
import type { Prisma, PrismaClient } from "@prisma/client";
import { formatISO } from "date-fns";
import { z } from "zod";
import { reporttradersModel } from "../../../../../../prisma/zod";
// import { uploadFile } from "../config";

const traderReportSchema = reporttradersModel.extend({
  DataReg: z
    .object({
      saleStatus: z.string(),
      freeParam5: z.string(),
    })
    .optional(),
  affiliate: z.object({ group_id: z.number().optional() }).optional(),
});

// const traderReportTotalsSchema = z.object({
//   totalFTD: z.number(),
//   totalTotalDeposit: z.number(),
//   totalDepositAmount: z.number(),
//   totalVolumeAmount: z.number(),
//   totalBonusAmount: z.number(),
//   totalWithdrawalAmount: z.number(),
//   totalChargeBackAmount: z.number(),
//   totalNetRevenue: z.number(),
//   totalTrades: z.number(),
//   totalTotalCom: z.number(),
// });

const traderReportResultSchema = z.object({
  data: z.array(traderReportSchema),
  pageInfo,
  totals: z.undefined(),
});

const Input = z.object({
  from: z.date(),
  to: z.date(),
  merchant_id: z.number().optional(),
  country: z.string().optional(),
  banner_id: z.number().optional(),
  trader_id: z.string().optional(),
  parameter: z.string().optional(),
  parameter_2: z.string().optional(),
  filter: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const traderReport = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    from,
    to,
    country,
    banner_id,
    trader_id,
    parameter,
    parameter_2,
    filter,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);
  const sorting_info = getSortingInfo(sortingParam);

  const baseTypeFilter: Prisma.reporttradersWhereInput = {
    affiliate_id,
    merchant_id,
    // Country: country,
    // CreativeID: banner_id,
    // TraderID: trader_id,
    // Param: parameter,
    // Param2: parameter_2,
  };

  const isFTD = filter === "ftd" || filter === "totalftd";
  const type_filter: Prisma.reporttradersWhereInput = { ...baseTypeFilter };

  if (
    filter === "real" ||
    filter === "lead" ||
    filter === "demo" ||
    filter === "frozen"
  ) {
    type_filter.TraderStatus = filter;
  } else if (isFTD) {
    type_filter.AND = [{ TraderStatus: "frozen" }, { TraderStatus: "demo" }];
    type_filter.FirstDeposit = {
      gte: formatISO(from),
      lt: formatISO(to),
    };
  } else if (filter === "activeTrader") {
    type_filter.AND = [{ TraderStatus: "frozen" }, { TraderStatus: "demo" }];
    type_filter.QualificationDate = {
      gte: formatISO(from),
      lt: formatISO(to),
    };
  }

  const where = {
    ...type_filter,
    RegistrationDate: isFTD
      ? undefined
      : {
          gte: formatISO(from),
          lt: formatISO(to),
        },
  };

  const [trader_report_resource, trader_report_totals] = await Promise.all([
    prisma.reporttraders.findMany({
      take: pageParams.pageSize,
      skip: offset,
      orderBy: sorting_info ? sorting_info[0] : {},
      where,
      include: {
        data_reg: {
          select: {
            saleStatus: true,
            freeParam5: true,
          },
        },
        affiliate: {
          select: {
            group_id: true,
          },
        },
      },
    }),

    prisma.reporttraders.aggregate({
      _count: {
        affiliate_id: true,
      },
      where,
    }),

    // notice separate query with no pagination
    // usually better to use prisma.aggregate but in this case cannot as fields are string
    // prisma.reporttraders.findMany({
    //   select: {
    //     FTDAmount: true,
    //     NetDeposit: true,
    //     TotalDeposits: true,
    //     DepositAmount: true,
    //     Volume: true,
    //     BonusAmount: true,
    //     WithdrawalAmount: true,
    //     ChargeBackAmount: true,
    //     Trades: true,
    //     Commission: true,
    //   },
    //   where: {
    //     ...type_filter,
    //   },
    //   // where,
    // }),
  ]);

  // let totalFTD = 0;
  // let totalTotalDeposit = 0;
  // let totalDepositAmount = 0;
  // let totalVolumeAmount = 0;
  // let totalBonusAmount = 0;
  // let totalWithdrawalAmount = 0;
  // let totalChargeBackAmount = 0;
  // let totalNetRevenue = 0;
  // let totalTrades = 0;
  // let totalTotalCom = 0;
  //
  // for (const item of trader_report_totals) {
  //   totalFTD += Number(item.FTDAmount);
  //   totalNetRevenue += Number(item.NetDeposit);
  //   totalTotalDeposit += Number(item.TotalDeposits);
  //   totalDepositAmount += Number(item.DepositAmount);
  //   totalVolumeAmount += Number(item.Volume);
  //   totalBonusAmount += Number(item.BonusAmount);
  //   totalWithdrawalAmount += Number(item.WithdrawalAmount);
  //   totalChargeBackAmount += Number(item.ChargeBackAmount);
  //   totalTrades += Number(item.Trades);
  //   totalTotalCom += Number(item.Commission);
  // }
  //
  // const totals = {
  //   totalFTD,
  //   totalTotalDeposit,
  //   totalDepositAmount,
  //   totalVolumeAmount,
  //   totalBonusAmount,
  //   totalWithdrawalAmount,
  //   totalChargeBackAmount,
  //   totalNetRevenue,
  //   totalTrades,
  //   totalTotalCom,
  // };
  //
  // const totalItems = trader_report_totals.length;

  const arrRes = {
    data: trader_report_resource,
    totals: undefined,
    pageInfo: {
      ...pageParams,
      // totalItems,
      totalItems: trader_report_totals._count.affiliate_id,
    },
  };
  return arrRes;
};

export const getTraderReport = protectedProcedure
  .input(InputWithPageInfo)
  .output(traderReportResultSchema)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return traderReport(ctx.prisma, affiliate_id, input);
  });

export const exportTraderReport = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const affiliate_id = checkIsUser(ctx);
    const { exportType, reportColumns, ...params } = input;

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        traderReport(ctx.prisma, affiliate_id, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

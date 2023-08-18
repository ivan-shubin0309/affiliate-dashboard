import { affiliate_id } from "@/server/api/routers/affiliates/const";
import { protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { affiliatesModel } from "prisma/zod";
import { z } from "zod";
import {
  PageParamsSchema,
  SortingParamSchema,
  exportReportLoop,
  exportType,
  getPageOffset,
  pageInfo,
  reportColumns,
} from "./reports-utils";

type DashboardType = {
  _sum?: {
    Clicks: number;
    Impressions: number;
    Leads: number;
    Demo: number;
    RealAccount: number;
    FTD: number;
    FTDAmount: number;
    Deposits: number;
    DepositsAmount: number;
    Bonus: number;
    Withdrawal: number;
    ChargeBack: number;
    PNL: number;
    Install: number;
    Commission: number;
    Volume: number;
  };
};

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  user_level: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const SubAffiliateReportSchema = z.object({
  data: z.array(affiliatesModel),
  pageInfo,
  totals: z.any(),
});

export const subAffiliateReport = async (
  prisma: PrismaClient,
  {
    from,
    to,
    user_level,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  let viewsSum = 0;
  let clicksSum = 0;
  let totalLeads = 0;
  let totalDemo = 0;
  let totalReal = 0;
  let totalCPI = 0;
  let newFTD = 0;
  let ftdAmount = 0;
  let totalBonus = 0;
  let totalWithdrawal = 0;
  let totalChargeback = 0;
  const totalSumLots = 0;
  let totalCommission = 0;
  let totalPNL = 0;
  let total_deposits = 0;
  let total_depositsAmount = 0;
  const group_id = 0;
  let totalLots = 0;
  let totalVolume = 0;
  const merchantArray: Record<string, object> = {};
  const offset = getPageOffset(pageParams);

  const mer_rsc = await prisma.merchants.findMany({
    where: {
      valid: 1,
    },
  });

  let displayForex;
  for (let index = 0; index < Object.keys(mer_rsc).length; index++) {
    if (mer_rsc[index]?.producttype === "forex") {
      displayForex = 1;
    }
  }

  let affiliateData: any[] = [];
  let allAffiliates: any[] = [];

  const id = await prisma.affiliates.findMany({
    distinct: ["refer_id"],
    select: {
      refer_id: true,
    },
    where: {
      NOT: {
        refer_id: 0,
      },
    },
  });

  const totals = await prisma.affiliates.aggregate({
    _count: {
      id: true,
    },
  });

  if (user_level === "admin") {
    allAffiliates = await prisma.affiliates.findMany({
      where: {
        valid: 1,
      },
      skip: offset,
      take: pageParams.pageSize,
    });
  } else if (user_level === "manager") {
    allAffiliates = await prisma.affiliates.findMany({
      where: {
        valid: 1,
        group_id: user_level === "manager" ? group_id : 0,
      },
      skip: offset,
      take: pageParams.pageSize,
    });
  } else {
    allAffiliates = [];
  }

  // affiliate data

  if (user_level === "admin") {
    if (!affiliate_id) {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
        },
      });
    } else {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
          // OR: {
          //   id: Number(affiliate_id),
          //   refer_id: Number(affiliate_id),
          // },
        },
      });
    }
  } else if (user_level === "manager") {
    if (!affiliate_id) {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
          group_id: user_level === "manager" ? group_id : 0,
        },
      });
    } else {
      affiliateData = await prisma.affiliates.findMany({
        where: {
          id: id[0]?.refer_id,
          valid: 1,
          group_id: user_level === "manager" ? group_id : 0,
          OR: {
            id: Number(affiliate_id),
            refer_id: Number(affiliate_id),
          },
        },
      });
    }
  } else {
    affiliateData = await prisma.affiliates.findMany({
      select: {
        username: true,
        id: true,
      },
      where: {
        valid: 1,
      },
    });
  }

  let Commission;

  let data;
  const IDs = await prisma.affiliates.findMany({
    select: {
      id: true,
    },
    take: 10,
  });

  if (user_level === "admin" || user_level === "manager") {
    for (const item of IDs) {
      data = await prisma.dashboard.aggregate({
        _sum: {
          Clicks: true,
          Impressions: true,
          Leads: true,
          Demo: true,
          RealAccount: true,
          FTD: true,
          FTDAmount: true,
          Deposits: true,
          DepositsAmount: true,
          Bonus: true,
          Withdrawal: true,
          ChargeBack: true,
          PNL: true,
          Install: true,
          Commission: true,
          Volume: true,
        },
        where: {
          affiliate_id: item?.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });
    }
  } else {
    for (const item of IDs) {
      Commission = await prisma.commissions.aggregate({
        _sum: {
          Commission: true,
        },
        where: {
          affiliate_id: item.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });
    }
    for (const item of affiliateData) {
      data = prisma.dashboard.aggregate({
        _sum: {
          Clicks: true,
          Impressions: true,
          Leads: true,
          Demo: true,
          RealAccount: true,
          FTD: true,
          FTDAmount: true,
          Deposits: true,
          DepositsAmount: true,
          Bonus: true,
          Withdrawal: true,
          ChargeBack: true,
          PNL: true,
          Install: true,
          Commission: true,
          Volume: true,
        },
        where: {
          affiliate_id: item?.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });

      Commission = await prisma.commissions.aggregate({
        _sum: {
          Commission: true,
        },
        where: {
          affiliate_id: item?.id,
          Date: {
            gt: from,
            lt: to,
          },
        },
      });
    }
  }

  const lots = await prisma.data_stats.findMany({
    select: {
      turnover: true,
      trader_id: true,
      rdate: true,
      affiliate_id: true,
      profile_id: true,
      banner_id: true,
    },
    where: {
      affiliate_id: affiliate_id,
      rdate: {
        gt: from,
        lt: to,
      },
    },
  });

  for (const item of lots) {
    totalLots += item?.turnover ?? 0;
  }

  const Data = data as DashboardType;
  for (let n = 0; n < Object.keys(Data)?.length; n++) {
    viewsSum += Data?._sum?.Impressions || 0;
    clicksSum += Data?._sum?.Clicks || 0;
    totalLeads += Data?._sum?.Leads || 0;
    totalCPI += Data?._sum?.Install || 0;
    totalDemo += Data?._sum?.Demo || 0;
    totalReal += Data?._sum?.RealAccount || 0;
    newFTD += Data?._sum?.FTD || 0;
    total_deposits += Data?._sum?.Deposits || 0;
    total_depositsAmount += Data?._sum?.DepositsAmount || 0;
    ftdAmount += Data?._sum?.FTDAmount || 0;
    totalBonus += Data?._sum?.Bonus || 0;
    totalWithdrawal += Data?._sum?.Withdrawal || 0;
    totalChargeback += Data?._sum?.ChargeBack || 0;
    totalPNL += Data?._sum?.Clicks || 0;
    totalCommission += Data?._sum?.Commission || 0;
    totalVolume += Data?._sum?.Volume || 0;
  }

  const subAffiliateArray = (allAffiliates ?? []).map(
    (item: Record<string, unknown>) => {
      return {
        ...item,
        ...Data._sum,
      };
    }
  ) as Record<string, unknown>[];

  const arrRes = {
    data: subAffiliateArray,
    totals: {
      viewsSum,
      clicksSum,
      totalLots,
      totalCommission,
      totalBonus,
      totalPNL,
      totalChargeback,
      totalVolume,
      total_depositsAmount,
      totalReal,
      totalLeads,
      total_deposits,
      totalCPI,
      totalDemo,
      totalWithdrawal,
    },
    pageInfo: {
      ...pageParams,
      totalItems: totals._count.id,
    },
  };

  return arrRes;
};

export const getSubAffiliateReport = protectedProcedure
  .input(InputWithPageInfo)
  // .output(SubAffiliateReportSchema)
  .query(({ ctx, input }) => subAffiliateReport(ctx.prisma, input));

export const exportSubAffiliateReport = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        subAffiliateReport(ctx.prisma, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

import { profileReportSchema } from "@/server/api/routers/affiliates/reports";
import { protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import { getUnixTime } from "date-fns";
import { z } from "zod";
import {
  PageParamsSchema,
  SortingParamSchema,
  exportReportLoop,
  exportType,
  getPageOffset,
  getSortingInfo,
  pageInfo,
  reportColumns,
} from "./reports-utils";

type TraderStats = {
  _sum?: {
    spread?: number;
    turnover?: number;
  };
};

type TotalFraud = {
  _sum?: {
    id?: number;
  };
};

const Input = z.object({
  from: z.date(),
  to: z.date(),
  merchant_id: z.number().optional(),
  search_type: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const profileReportDataSchema = z.object({
  data: z.array(profileReportSchema),
  pageInfo,
  totals: z.any(),
});

interface OrderType {
  [key: string]: any;
}
const profileReportData = async (
  prisma: PrismaClient,
  {
    from,
    to,
    merchant_id,
    search_type,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);
  const sorting_info = getSortingInfo(sortingParam);

  const sortBy = sorting_info ? Object.keys(sorting_info[0] ?? "")[0] : "";
  const sortOrder = sorting_info ? Object.values(sorting_info[0] ?? "")[0] : "";

  const intMerchantCount = await prisma.merchants.aggregate({
    _sum: {
      id: true,
    },
  });
  const arrGroup = await prisma.affiliates.findMany({
    select: {
      group_id: true,
    },
    where: {
      id: 500,
    },
  });

  const group_id = arrGroup[0]?.group_id;

  console.log("arr group", arrGroup);
  console.log("int merchant count", intMerchantCount);

  let type_filter = {};

  if (group_id) {
    type_filter = {
      group_id: group_id,
    };
  }

  const orderBy: OrderType = {};
  const trafficOrder: OrderType = {};

  if (sortBy === "clicks" || sortBy === "views") {
    trafficOrder[`${sortBy}`] = sortOrder;
  }
  // Initialize total counters per affiliate.
  let totalImpressionsM = 0;
  let totalClicksM = 0;
  const totalCPIM = 0;
  let totalLeadsAccountsM = 0;
  let totalDemoAccountsM = 0;
  let totalRealAccountsM = 0;
  let totalFTDM = 0;
  let totalDepositsM = 0;
  let totalFTDAmountM = 0;
  let totalDepositAmountM = 0;
  let totalVolumeM = 0;
  let totalBonusM = 0;
  const totalLotsM = 0;
  let totalWithdrawalM = 0;
  let totalChargeBackM = 0;
  const totalNetRevenueM = 0;
  let totalComsM = 0;
  const netRevenueM = 0;
  let totalFruadM = 0;
  const totalFrozensM = 0;
  let totalRealFtdM = 0;
  let totalRealFtdAmountM = 0;
  const totalPNLAmountM = 0;
  let isCasinoOrSportBets = false;
  let showLeadsAndDemo = false;
  const showCasinoFields = 0;

  // Initialize total counters per affiliate-merchant.
  let formula = "";
  let totalLeads = 0;
  let totalDemo = 0;
  let totalReal = 0;
  const ftd = 0;
  const cpi = 0;
  const pnl = 0;
  let totalLots = 0;
  let lotdate = new Date();
  let volume = 0;
  let bonus = 0;
  let spreadAmount = 0;
  const turnoverAmount = 0;
  let withdrawal = 0;
  let chargeback = 0;
  let revenue = 0;
  const ftd_amount = 0;
  let depositingAccounts = 0;
  let sumDeposits = 0;
  const netRevenue = 0;
  const totalCom = 0;
  const real_ftd = 0;
  const real_ftd_amount = 0;
  let totalPNL = 0;
  let merchant_name = "";
  const totalTraffic: Record<string, number> = {};
  let merchantId = 0;
  let profile_id = 0;
  let affiliate_id = 0;
  const displayForex = 0;
  let boolTierCplCount = false;
  let earliestTimeForNetRev = new Date();
  const deal_pnl = 0;
  const groupMerchantsPerAffiliate = 0;

  const dateRanges = [
    {
      from,
      to,
    },
  ];
  // switch (search_type) {
  //   case "monthly":

  //     break;

  //   default:
  //     break;
  // }

  // console.log("date ranges ----->", dateRanges);
  const [ww, totals] = await Promise.all([
    prisma.affiliates_profiles.findMany({
      orderBy: sorting_info ? sorting_info[0] : {},
      where: {
        valid: 1,
      },
      include: {
        affiliate: true,
      },
      skip: offset,
      take: pageParams.pageSize,
    }),
    prisma.affiliates_profiles.aggregate({
      _count: {
        id: true,
      },
      where: {
        valid: 1,
      },
    }),
  ]);

  // const brandsRow = await prisma.merchants.findMany({
  //   select: {
  //     id: true,
  //     name: true,
  //     type: true,
  //     producttype: true,
  //     rev_formula: true,
  //     wallet_id: true,
  //   },
  //   where: {
  //     valid: 1,
  //     id: 1,
  //   },
  // });

  // console.log("brands row ----->", brandsRow);

  // const merchant_count = await prisma.merchants.aggregate({
  //   _sum: {
  //     id: true,
  //   },
  //   where: {
  //     valid: 1,
  //     id: merchant_id ? merchant_id : 0,
  //   },
  // });

  const merchant_ww = await prisma.merchants.findMany({
    where: {
      id: merchant_id ? merchant_id : 0,
    },
    select: {
      id: true,
      name: true,
      type: true,
      producttype: true,
      rev_formula: true,
      wallet_id: true,
    },
  });

  for (let i = 0; i <= Object.keys(merchant_ww).length; i++) {
    if (
      merchant_ww[i]?.producttype === "casino" ||
      merchant_ww[i]?.producttype === "sportbook" ||
      merchant_ww[i]?.producttype === "sportsbetting"
    ) {
      isCasinoOrSportBets = true;
      showLeadsAndDemo = true;
    }

    if (merchant_ww[i]?.producttype === "casino") {
    }

    formula = merchant_ww[i]?.rev_formula ?? "";
    merchant_name = merchant_ww[i]?.name ?? "";
    merchantId = merchant_ww[i]?.id ?? 0;
  }

  let where = "";

  if (!from && !to) {
    where = `sb.unixRdate BETWEEN ${getUnixTime(from)} AND ${getUnixTime(
      to
    )} AND `;
  }

  for (let i = 0; i <= Object.keys(ww).length; i++) {
    if ((ww[i]?.affiliate_id && ww[i]?.affiliate_id) || 0 > 0) {
      where = `sb.affiliate_id=${ww[i]?.affiliate_id ?? 0} AND `;
    }

    if (ww[i]?.id) {
      where = `sb.profile_id = ${ww[i]?.id ?? 0} AND`;
    }

    profile_id = ww[i]?.id ?? 0;
    affiliate_id = ww[i]?.affiliate.id || 0;
  }

  for (let i = 0; i <= Object.keys(merchant_ww).length; i++) {
    if (merchant_ww[i]?.id) {
      where = `sb.merchant_id=${merchant_ww[i]?.id ?? 0} AND `;
    }
  }

  const arrClicksAndImpressions = await prisma.traffic.groupBy({
    by: ["affiliate_id"],
    where: {
      type: "traffic",
      views: 1,
    },
    _sum: {
      clicks: true,
      views: true, // impressions
    },
  });

  let totalCPI = 0;
  const installs = await prisma.data_install.findMany({
    where: {
      affiliate_id: affiliate_id,
      merchant_id: merchant_id,
      rdate: {
        gt: from,
        lt: to,
      },
    },
  });

  for (let i = 0; i < installs.length; i++) {
    totalCPI++;
  }

  for (let i = 0; i < Object.keys(arrClicksAndImpressions).length; i++) {
    totalTraffic["totalViews"] = arrClicksAndImpressions[i]?._sum?.views ?? 0;
    totalTraffic["totalClicks"] = arrClicksAndImpressions[i]?._sum?.clicks ?? 0;
  }
  // const count = 1;
  // const frozen = await prisma.data_reg.aggregate({
  //   where: {
  //     status: "frozen",
  //   },
  //   _count: {
  //     id: true,
  //   },
  // });

  const regww = await prisma.data_reg.findMany({
    where: {
      rdate: {
        gte: from,
        lt: to,
      },
      profile_id: profile_id,
      merchant_id: merchantId,
    },
  });

  for (let i = 0; i < Object.keys(regww).length; i++) {
    const arrTierCplCountCommissionParams: Record<string, any> = {};
    const strAffDealType = await prisma.affiliates_deals.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        affiliate_id: regww[i]?.affiliate_id,
        merchant_id: regww[i]?.merchant_id,
      },
      take: 1,
    });

    for (let j = 0; j < Object.keys(strAffDealType).length; j++) {
      if (
        strAffDealType[j]?.tier_type !== null &&
        strAffDealType[j]?.tier_type === "cpl_count"
      ) {
        boolTierCplCount = true;
      }
    }

    if (regww[i]?.type === "lead") {
      totalLeads++;
    }

    if (regww[i]?.type === "demo") {
      totalDemo++;
    }

    if (regww[i]?.type === "real") {
      const arrTemp: Record<string, any> = {};
      if (!boolTierCplCount) {
        arrTemp["merchant_id"] = regww[i]?.merchant_id;
        arrTemp["affiliate_id"] = regww[i]?.affiliate_id;
        arrTemp["rdate"] = regww[i]?.rdate;
        arrTemp["banner_id"] = regww[i]?.banner_id;
        arrTemp["trader_id"] = regww[i]?.trader_id;
        arrTemp["profile_id"] = regww[i]?.profile_id;
      } else {
        if (
          Object.values(arrTierCplCountCommissionParams).includes(
            regww[i]?.affiliate_id
          )
        ) {
          arrTierCplCountCommissionParams["amount"]++;
        } else {
          arrTemp["merchant_id"] = regww[i]?.merchant_id;
          arrTemp["affiliate_id"] = regww[i]?.affiliate_id;
          arrTemp["rdate"] = regww[i]?.rdate;
          arrTemp["banner_id"] = regww[i]?.banner_id;
          arrTemp["trader_id"] = regww[i]?.trader_id;
          arrTemp["profile_id"] = regww[i]?.profile_id;
          arrTemp["amount"] = 1;
          arrTemp["tier_type"] = "cpl_count";

          arrTierCplCountCommissionParams[`${regww[i]?.affiliate_id ?? 0}`] = {
            from: from,
            to: to,
            onlyRevShare: 0,
            groupId: -1,
            arrDealTypeDefaults: [],
            arrTemp: arrTemp,
          };
        }
      }

      totalReal++;
    }
  }

  const sales_ww = await prisma.data_sales.findMany({
    where: {
      merchant_id: merchantId,
      affiliate_id: affiliate_id,
      profile_id: profile_id,
      rdate: {
        gte: from,
        lt: to,
      },
    },
  });

  for (let i = 0; i < Object.keys(sales_ww).length; i++) {
    if (earliestTimeForNetRev > (sales_ww[i]?.rdate || new Date())) {
      earliestTimeForNetRev = sales_ww[i]?.rdate ?? new Date();
    }

    if (sales_ww[i]?.type === "deposit") {
      depositingAccounts++;
      sumDeposits += sales_ww[i]?.amount || 0;
    }

    if (sales_ww[i]?.type === "bonus") {
      bonus += sales_ww[i]?.amount || 0;
    }
    if (sales_ww[i]?.type === "revenue") {
      revenue += sales_ww[i]?.amount || 0;
    }
    if (sales_ww[i]?.type === "withdrawal") {
      withdrawal += sales_ww[i]?.amount || 0;
    }
    if (sales_ww[i]?.type === "chargeback") {
      chargeback += sales_ww[i]?.amount || 0;
    }
    if (sales_ww[i]?.type === "volume") {
      volume += sales_ww[i]?.amount || 0;
    }
  }

  if (displayForex) {
    const traderStats = await prisma.data_stats.groupBy({
      by: ["affiliate_id"],
      where: {
        affiliate_id: affiliate_id,
        profile_id: profile_id,
      },
      _sum: {
        spread: true,
        turnover: true,
      },
    });
    const traders: TraderStats[] = traderStats as TraderStats[];

    for (let i = 0; i < Object.keys(traders).length; i++) {
      spreadAmount = traders[i]?._sum?.spread ?? 0;
      volume = traders[i]?._sum?.turnover ?? 0;
    }

    const traderStats_2 = await prisma.data_stats.findMany({
      where: {
        profile_id: profile_id,
        merchant_id: merchantId,
        rdate: {
          gte: from,
          lt: to,
        },
      },
      select: {
        turnover: true,
        trader_id: true,
        rdate: true,
        affiliate_id: true,
        banner_id: true,
        profile_id: true,
      },
    });

    for (let i = 0; i < Object.keys(traderStats_2).length; i++) {
      totalLots = traderStats_2[i]?.turnover ?? 0;
      lotdate = traderStats_2[i]?.rdate ?? new Date();
    }
  }

  // if (deal_pnl > 0) {
  // 	const traders = ctx.prisma.`${pnlTable}`.findMany
  // } else {
  // }

  const total_fraud = await prisma.payments_details.groupBy({
    by: ["id"],
    _sum: {
      id: true,
    },
    where: {
      status: "canceled",
      affiliate_id: affiliate_id,
    },
  });
  const fraud: TotalFraud[] = total_fraud as TotalFraud[];

  for (let i = 0; i < Object.keys(fraud).length; i++) {
    totalFruadM += fraud[i]?._sum?.id ?? 0;
  }

  totalImpressionsM += totalTraffic["totalViews"] ?? 0;
  totalClicksM += totalTraffic["totalClicks"] ?? 0;
  totalLeadsAccountsM += totalLeads;
  totalDemoAccountsM += totalDemo;
  totalRealAccountsM += totalReal;
  totalFTDM += ftd;
  totalDepositsM += depositingAccounts;
  totalDepositAmountM += sumDeposits;
  totalFTDAmountM += ftd_amount;
  totalVolumeM += volume;
  totalBonusM += bonus;
  totalWithdrawalM += withdrawal;
  totalChargeBackM += chargeback;
  totalComsM += totalCom;
  totalRealFtdAmountM += real_ftd_amount;
  totalRealFtdM += real_ftd;
  totalPNL += pnl;
  // });

  const merged = [];

  for (let i = 0; i < ww.length; i++) {
    merged.push({
      ...ww[i],
      ...arrClicksAndImpressions[i]?._sum,
      totalCPI,
      totalReal,
      ftd,
      totalCom,
      totalLeads,
      totalDemo,
      withdrawal,
      chargeback,
      volume,
      totalPNL,
    });
  }

  const arrRes = {
    data: merged,
    totals: {
      totalImpressionsM,
      totalClicksM,
      totalLeadsAccountsM,
      totalDemoAccountsM,
      totalRealAccountsM,
      totalFTDM,
      totalDepositsM,
      totalDepositAmountM,
      totalFTDAmountM,
      totalVolumeM,
      totalBonusM,
      totalWithdrawalM,
      totalChargeBackM,
      totalComsM,
      totalRealFtdAmountM,
      totalRealFtdM,
      totalPNL,
    },
    pageInfo: {
      ...pageParams,
      totalItems: totals._count.id,
    },
  };

  // console.log("arr res ------>", arrRes);
  return arrRes;
};

export const getProfileReportData = protectedProcedure
  .input(InputWithPageInfo)
  // .output(profileReportDataSchema)
  .query(({ ctx, input }) => {
    return profileReportData(ctx.prisma, input);
  });

export const exportProfileReportData = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        profileReportData(ctx.prisma, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

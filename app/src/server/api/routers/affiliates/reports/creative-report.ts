/* eslint-disable @typescript-eslint/no-unsafe-call */
import { merchant_id } from "@/server/api/routers/affiliates/const";
import type { CreativeReportSchema } from "@/server/api/routers/affiliates/reports";
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
import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { data_statsModel } from "prisma/zod";
import { z } from "zod";
// import { uploadFile } from "../config";

type RegType = {
  comms: number;
  total_leads: number;
  total_demo: number;
  total_real: number;
};

type MerchantIds = {
  _sum?: {
    Impressions?: number;
    Clicks?: number;
  };
};

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  merchant_id: z.number().optional(),
  banner_id: z.number().optional(),
  trader_id: z.number().optional(),
  unique_id: z.number().optional(),
  type: z.string().optional(),
  group_id: z.number().optional(),
});

const traderReportSchema = data_statsModel.extend({
  DataReg: z
    .object({
      saleStatus: z.string(),
      freeParam5: z.string(),
    })
    .optional(),
  affiliate: z.object({ group_id: z.number().optional() }).optional(),
  merchant: z.object({ merchant_id: z.number().optional() }).optional(),
});

const creativeReportTotalsSchema = z.object({
  totalFTD: z.number(),
  totalTotalDeposit: z.number(),
  totalDepositAmount: z.number(),
  totalVolumeAmount: z.number(),
  totalBonusAmount: z.number(),
  totalWithdrawalAmount: z.number(),
  totalChargeBackAmount: z.number(),
  totalNetRevenue: z.number(),
  totalTrades: z.number(),
  totalTotalCom: z.number(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});
const creativeReportResultSchema = z.object({
  data: z.array(traderReportSchema),
  pageInfo,
  totals: creativeReportTotalsSchema,
});

type SortingInfo =
  | Array<{
      [key: string]: string;
    }>
  | undefined;

interface OrderType {
  [key: string]: any;
}

const creativeReport = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    from,
    to,
    banner_id,
    type,
    group_id,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  console.log("pageParams", pageParams);
  const offset = getPageOffset(pageParams);
  const sorting_info = getSortingInfo(sortingParam);

  const sortBy = sorting_info ? Object.keys(sorting_info[0] ?? "")[0] : "";
  const sortOrder = sorting_info ? Object.values(sorting_info[0] ?? "")[0] : "";

  let sortBy_new = {};
  const orderBy_creative: OrderType = {};
  const orderBy_banner: OrderType = {};
  let sortBy_creative = "";
  if (
    sortBy === "BannerID" ||
    sortBy === "Impressions" ||
    sortBy === "Clicks"
  ) {
    orderBy_creative[`${sortBy}`] = sortOrder;
    sortBy_creative = sortBy;
  } else if (sortBy === "title" || sortBy === "merchant.name") {
    orderBy_banner[`${sortBy}`] = sortOrder;
  } else {
    sortBy_new = {
      id: "desc",
    };
  }

  // console.log("order by", orderBy);
  // if (sortOrder && sortOrder != "") {
  //   if (sortBy_new !== "") {
  //     orderBy = { sortBy_new: sortOrder };
  //   }
  // } else {
  //   if (sortBy_new !== "") orderBy = {};
  // }

  let creatives_stats_where = Prisma.empty;
  const country = "";
  const trader_id = "";
  const profile_id = "";
  if (merchant_id) {
    creatives_stats_where = Prisma.sql`AND MerchantID=${merchant_id}`;
  }

  if (banner_id) {
    creatives_stats_where = Prisma.sql` AND BannerID=${banner_id} `;
  }

  const ww = await prisma.$queryRaw<z.infer<typeof CreativeReportSchema>[]>(
    Prisma.sql`SELECT CONCAT(Date,MerchantID,AffiliateID,BannerID) as id, MerchantID as merchant_id, AffiliateID as affiliate_id, SUM(Impressions) AS totalViews, SUM(Clicks) AS totalClicks, BannerID as banner_id
                        FROM merchants_creative_stats WHERE (Date BETWEEN  ${from}  AND ${to} ) ${creatives_stats_where} GROUP BY BannerID`
  );

  const merchants = await prisma.merchants.findMany({
    where: {
      valid: 1,
      id: Number(merchant_id),
    },
  });

  const creativeItems = {
    demo: 0,
    leads: 0,
    totalLeads: 0,
    totalDemo: 0,
    totalReal: 0,
    ftd: 0,
    totalCPI: 0,
    ftd_amount: 0,
    depositingAccounts: 0,
    sumDeposits: 0,
    bonus: 0,
    cpaAmount: 0,
    withdrawal: 0,
    chargeback: 0,
    volume: 0,
    lots: 0,
    totalCom: 0,
    real_ftd: 0,
    real_ftd_amount: 0,
    real: 0,
  };
  const [bannersww, totals] = await Promise.all([
    prisma.merchants_creative.findMany({
      take: pageParams.pageSize,
      skip: offset,
      orderBy: Object.keys(orderBy_banner).length !== 0 ? orderBy_banner : {},
      select: {
        id: true,
        title: true,
        merchant_id: true,
        type: true,
        width: true,
        height: true,
        merchant: {
          select: {
            name: true,
          },
        },
        language: {
          select: {
            title: true,
          },
        },
      },
      where: {
        merchant_id: merchant_id,
        valid: 1,
      },
    }),
    prisma.merchants_creative.aggregate({
      _count: {
        merchant_id: true,
      },
    }),
  ]);

  // console.log("banners ww -------->", bannersww);

  let where_main: any = {};

  if (merchant_id) {
    where_main = {
      merchant_id: merchant_id,
    };
  }
  if (banner_id) {
    where_main = {
      banner_id: banner_id,
    };
  }

  if (profile_id) {
    where_main = {
      profile_id: profile_id,
    };
  }

  if (country) {
    where_main = {
      country: country,
    };
  }

  const trafficRow = await prisma.merchants_creative_stats.groupBy({
    // by: sortBy_creative ? [`${sortBy}`] : ["BannerID"],
    by: ["BannerID"],
    _sum: {
      Impressions: true,
      Clicks: true,
    },
    where: {
      ...where_main,
      // Date: {
      //   gt: from,
      //   lt: to,
      // },
    },
  });

  const regww = await prisma.$queryRaw<RegType[]>(Prisma.sql`SELECT
SUM(cm.Commission) as comms,
SUM(IF(dr.type='lead', 1, 0)) AS total_leads,
SUM(IF(dr.type='demo', 1, 0)) AS total_demo,
SUM(IF(dr.type='real', 1, 0)) AS total_real
FROM data_reg dr
LEFT JOIN commissions cm ON dr.trader_id = cm.traderID AND cm.Date BETWEEN ${from} AND ${to}
WHERE dr.merchant_id =  ${merchant_id} and dr.affiliate_id = ${affiliate_id} and dr.rdate BETWEEN ${from} AND ${to} GROUP BY dr.banner_id`);

  const arrRow = await prisma.data_sales.findMany({
    take: pageParams.pageSize,
    select: {
      product_id: true,
      banner_id: true,
      amount: true,
      rdate: true,
      affiliate_id: true,
      trader_id: true,
      id: true,
      data_reg: {
        select: {
          country: true,
        },
      },
    },
    where: {
      ...where_main,
      type: "deposit",
      // IN: {
      //   trader_id: traderIDs,
      // },
    },
  });

  for (const item of arrRow) {
    const real_ftd_amount = item.amount;
    creativeItems.real_ftd += 1;
    creativeItems.real_ftd_amount += real_ftd_amount;
    creativeItems.ftd += 1;
    creativeItems.ftd_amount += real_ftd_amount;
  }

  let sales_filter = {};

  if (group_id) {
    sales_filter = {
      group_id: group_id,
    };
  }

  if (affiliate_id) {
    sales_filter = {
      affiliate_id: affiliate_id,
    };
  }

  if (banner_id) {
    sales_filter = {
      banner_id: banner_id,
    };
  }

  const salesww = await prisma.data_sales.findMany({
    select: {
      amount: true,
      type: true,
      data_reg: {
        select: {
          merchant_id: true,
          affiliate_id: true,
          banner_id: true,
          trader_id: true,
          group_id: true,
          profile_id: true,
          country: true,
        },
      },
    },
    where: {
      ...sales_filter,
      NOT: {
        type: "PNL",
      },
      merchant_id: {
        gt: 0,
      },
      rdate: {
        gte: from,
        lte: to,
      },
    },
  });

  for (const item of salesww) {
    if (item.type === "deposit") {
      creativeItems.depositingAccounts += 1;
      creativeItems.sumDeposits += item.amount;
    }

    if (item.type === "bonus") {
      creativeItems.bonus += item.amount;
    }

    if (item.type === "withdrawal") {
      creativeItems.withdrawal += item.amount;
    }

    if (item.type === "chargeback") {
      creativeItems.chargeback += item.amount;
    }

    if (item.type === "volume") {
      creativeItems.volume += item.amount;
    }
  }

  const revww = await prisma.data_stats.findMany({
    select: {
      affiliate_id: true,
      banner_id: true,
      merchant_id: true,
      merchant: {
        select: {
          producttype: true,
        },
      },
      // data_reg: {
      //   select: {
      //     country: true,
      //   },
      // },
    },
    distinct: ["affiliate_id", "banner_id", "merchant_id", "country"],
    where: {
      ...where_main,
      rdate: {
        gt: from,
        lt: to,
      },
    },
  });

  for (const item of merchants) {
    const ts = await prisma.data_stats.groupBy({
      by: ["banner_id"],
      _sum: {
        spread: true,
        turnover: true,
      },
      where: {
        ...where_main,
        AND: [
          {
            merchant_id: item.id,
          },
          {
            merchant_id: {
              gt: 0,
            },
          },
        ],
      },
    });

    for (const item of ts) {
      if (item.banner_id === 0) {
      }
      creativeItems.volume += item?._sum?.turnover || 0;
    }
  }

  const view_clicks = trafficRow.map((item) => {
    return {
      Clicks: item._sum?.Clicks,
      Impressions: item._sum?.Impressions,
      BannerID: item.BannerID,
    };
  });

  const creativeArray = bannersww?.map((item, i) => {
    const { merchant, language, ...resItem } = item;

    return {
      ...creativeItems,
      ...resItem,
      ...view_clicks[i],
      leads: regww[item.id]?.total_leads,
      demo: regww[item.id]?.total_demo,
      real: regww[item.id]?.total_real,
      totalCom: regww[item.id]?.comms,
      merchant,
      language,
    };
  });

  const arrRes = {
    data: creativeArray,
    totals: creativeItems,
    pageInfo: {
      ...pageParams,
      totalItems: totals._count.merchant_id,
    },
  };

  return arrRes;
};

export const getCreativeReport = protectedProcedure
  .input(InputWithPageInfo)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return creativeReport(ctx.prisma, affiliate_id, input);
  });

export const exportCreativeReport = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const affiliate_id = checkIsUser(ctx);
    const { exportType, reportColumns, ...params } = input;

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        creativeReport(ctx.prisma, affiliate_id, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

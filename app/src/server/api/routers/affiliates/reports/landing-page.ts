import { protectedProcedure } from "@/server/api/trpc";
import { checkIsUser } from "@/server/api/utils";
import type { PrismaClient, data_sales_type } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { LandingPageReportSchema } from "../reports";
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

const LandingPageReportResultSchema = z.object({
  data: z.array(LandingPageReportSchema),
  pageInfo,
  totals: z.any(),
});

interface OrderType {
  [key: string]: any;
}

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  merchant_id: z.number().optional(),
  url: z.string().optional(),
  creative_type: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

export const landingPageData = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    from,
    to,
    merchant_id,
    url,
    creative_type,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const ftd = 0;
  let bonus = 0;
  let chargeback = 0;
  let withdrawal = 0;
  let volume = 0;
  let lead = 0;
  let demo = 0;
  let real = 0;
  let depositingAccounts = 0;
  let sumDeposits = 0;

  const offset = getPageOffset(pageParams);
  const sorting_info = getSortingInfo(sortingParam);
  const sortBy = sorting_info ? Object.keys(sorting_info[0] ?? "")[0] : "";
  const sortOrder = sorting_info ? Object.values(sorting_info[0] ?? "")[0] : "";

  console.log("base type filter ----->", sortBy);

  let orderBy: OrderType = {};
  const trafficeBy: OrderType = {};

  if (sortBy === "merchant.name") {
    orderBy = { merchant: { name: "asc" } };
  }
  if (sortBy === "clicks" || sortBy === "views") {
    trafficeBy[`${sortBy}`] = sortOrder;
  } else {
    orderBy[`${sortBy}`] = sortOrder;
  }

  const [bannersww, totals] = await Promise.all([
    prisma.merchants_creative.findMany({
      where: {
        merchant_id: merchant_id,
        valid: 1,
      },
      include: {
        language: {
          select: {
            title: true,
          },
        },
        merchant: {
          select: {
            name: true,
          },
        },
      },
      orderBy: orderBy,
      skip: offset,
      take: pageParams.pageSize,
    }),
    prisma.merchants_creative.aggregate({
      _count: {
        merchant_id: true,
      },
      where: {
        merchant_id: merchant_id,
        valid: 1,
      },
    }),
  ]);

  //clicks and impressions
  const trafficRow = await prisma.traffic.groupBy({
    by: ["banner_id", "id"],
    // TODO - fix this, maybe client side sorting?
    orderBy: [{ banner_id: "asc" }, { id: "asc" }],
    // by: trafficeBy ? [`${sortBy}`, "banner_id", "id"] : ["banner_id", "id"],
    _sum: {
      clicks: true,
      views: true,
    },
    where: {
      merchant_id: {
        gt: 0,
      },
      rdate: {
        gte: from,
        lt: to,
      },
    },
    skip: offset,
    take: pageParams.pageSize,
  });

  const regww = await prisma.data_reg.findMany({
    include: {
      merchant: {
        select: {
          name: true,
        },
      },
    },
    where: {
      merchant_id: {
        gt: 0,
      },
      rdate: {
        gte: from,
        lt: to,
      },
    },
    // orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
  });

  for (const item of regww) {
    if (item.type === "lead") {
      lead += 1;
    }
    if (item.type === "demo") {
      demo += 1;
    }
    if (item.type === "real") {
      real += 1;
    }
  }

  //Qualified

  const group_id = null;
  const trader_id = null;
  const selected_group_id = group_id
    ? Prisma.sql` and group_id = ${group_id}`
    : Prisma.empty;

  const FILTERbyTrader = trader_id
    ? Prisma.sql` and trader_id=  ${trader_id}`
    : Prisma.empty;

  const arrFtd = await prisma.$queryRaw(Prisma.sql`
			SELECT * FROM data_reg where type<>'demo' and FTDqualificationDate>'0000-00-00 00:00:00' and FTDqualificationDate >${from} and FTDqualificationDate < ${to} and affiliate_id = ${affiliate_id} and merchant_id = ${merchant_id}
			${selected_group_id}
			${FILTERbyTrader}
			`);

  interface SalesWWType {
    affiliate_id: number;
    merchant_id: number;
    initialftddate: string;
    rdate: Date;
    banner_id: number;
    trader_id: string;
    group_id: number;
    profile_id: number;
    amount: number;
    type: data_sales_type;
    country: string;
    tranz_id: number;
  }

  const banner_id = null;
  const cond_group_id = group_id
    ? Prisma.sql`AND tb1.group_id = ${group_id}`
    : Prisma.empty;

  const cond_banner_id = banner_id
    ? Prisma.sql` AND tb1.banner_id = ${banner_id}`
    : Prisma.empty;

  const cond_affiliate_id = affiliate_id
    ? Prisma.sql`AND tb1.affiliate_id = ${affiliate_id}`
    : Prisma.empty;

  const salesww = await prisma.$queryRaw<SalesWWType[]>`select * from (
			SELECT data_reg.merchant_id,data_reg.affiliate_id,data_reg.initialftddate,tb1.rdate,tb1.tranz_id,data_reg.banner_id,data_reg.trader_id,data_reg.group_id,data_reg.profile_id,tb1.amount, tb1.type AS data_sales_type  ,data_reg.country as country FROM data_sales as tb1
					  INNER JOIN merchants_creative mc on mc.id= tb1.banner_id
					 INNER JOIN data_reg AS data_reg ON tb1.merchant_id = data_reg.merchant_id AND tb1.trader_id = data_reg.trader_id AND data_reg.type <> 'demo'
					 WHERE tb1.merchant_id> 0 and mc.valid=1 and tb1.rdate BETWEEN ${from} AND ${to}
					 ${cond_banner_id} ${cond_group_id} ${cond_affiliate_id}
					  ) a group by merchant_id , tranz_id , data_sales_type
`;

  const SalesArray = [];

  for (const item of salesww) {
    if (item.type === "bonus") {
      bonus = item.amount ?? 0;
      SalesArray.push({
        bonus: item.amount ?? 0,
      });
    }
    if (item.type === "withdrawal") {
      withdrawal = item.amount ?? 0;
      SalesArray.push({
        withdrawal: item.amount ?? 0,
      });
    }

    if (item.type === "chargeback") {
      chargeback = item.amount ?? 0;
      SalesArray.push({
        chargeback: item.amount ?? 0,
      });
    }

    if (item.type === "volume") {
      volume = item.amount ?? 0;
      SalesArray.push({
        volume: item.amount ?? 0,
      });
    }

    if (item.type === "deposit") {
      depositingAccounts += 1;
      sumDeposits += item.amount;
    }
  }

  const revww: any = await prisma.data_stats.findMany({
    select: {
      affiliate_id: true,
      banner_id: true,
      merchant_id: true,
      merchant: {
        select: {
          producttype: true,
          name: true,
        },
      },
      // data_reg: {
      // 	select: {
      // 		country: true,
      // 	},
      // },
    },
    where: {
      rdate: {
        gt: from,
        lt: to,
      },
      merchant_id: {
        gt: 0,
      },
      banner_id: banner_id ? banner_id : 0,
    },
    // orderBy: orderBy,
    skip: offset,
    take: pageParams.pageSize,
  });

  const merchantww = await prisma.merchants.findMany({
    where: {
      producttype: "Forex",
      valid: 1,
    },
  });

  let traderStats: any[] = [];

  for (let i = 0; i < merchantww.length; i++) {
    const ts = await prisma.data_stats.groupBy({
      by: ["banner_id"],
      _sum: {
        spread: true,
        pnl: true,
        turnover: true,
      },
      where: {
        affiliate_id: affiliate_id,
        merchant_id: merchantww[i]?.id ? merchantww[i]?.id : 1,
        // banner_id: banner_id ? banner_id : 0,
        // group_id: group_id ? group_id : 0,
        rdate: {
          gt: from,
          lt: to,
        },
      },
    });
    traderStats = ts;
  }

  const traffic: any = Object.values(trafficRow);

  const arrRes = bannersww.map((item, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return {
      ...item,
      ...traffic[key]._sum,
      ...regww[key],
      ...revww[key],
      volume: traderStats[key]?._sum?.turnover ?? 0,
      chargeback: chargeback,
      demo: demo,
      real: real,
      lead: lead,
      ftd: ftd,
      accounts: depositingAccounts,
      cpi: 0,
      Qftd: 0,
    };
  });

  // console.log("creative array ---->", arrRes);

  return {
    data: arrRes,
    totals: {},
    pageInfo: {
      ...pageParams,
      totalItems: totals._count.merchant_id,
    },
  };
};

export const getLandingPageData = protectedProcedure
  .input(InputWithPageInfo)
  .output(LandingPageReportResultSchema)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return landingPageData(ctx.prisma, affiliate_id, input);
  });
export const exportLandingPageData = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;
    const affiliate_id = checkIsUser(ctx);

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        landingPageData(ctx.prisma, affiliate_id, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

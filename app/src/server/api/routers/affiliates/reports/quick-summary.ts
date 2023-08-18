import { merchant_id } from "@/server/api/routers/affiliates/const";
import { QuickReportSummarySchema } from "@/server/api/routers/affiliates/reports";
import {
  exportReportLoop,
  exportType,
  getPageOffset,
  getSortingInfo,
  pageInfo,
  PageParamsSchema,
  reportColumns,
  SortingParamSchema,
} from "@/server/api/routers/affiliates/reports/reports-utils";
import { protectedProcedure } from "@/server/api/trpc";
import { checkIsUser } from "@/server/api/utils";
import { convertPrismaResultsToNumbers } from "@/utils/prisma-convert";
import type { PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { formatISO } from "date-fns";
import { z } from "zod";
// import { uploadFile } from "../config";

const QuickReportSummaryResultSchema = z.object({
  data: z.array(QuickReportSummarySchema),
  pageInfo,
  totals: z.any(),
});

const Input = z.object({
  from: z.date(),
  to: z.date(),
  display: z.string().optional(),
  merchant_id: z.number().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const quickReportSummary = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    from,
    to,
    display = "",
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  console.log("from", from, "to", to);

  // TODO: no reason to use paginator, can use the prisma query directly as paginator does not support $queryRaw
  console.log("display type", display, merchant_id);

  const offset = getPageOffset(pageParams);
  const orderBy = getSortingInfo(sortingParam);

  let dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId ORDER BY d.MerchantId ASC`;
  let dasboardSQLwhere = Prisma.empty;

  if (display === "monthly") {
    dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId, YEAR(d.Date), MONTH(d.Date) ORDER BY YEAR(d.Date) ASC, MONTH(d.Date) ASC, d.MerchantId ASC`;
  }

  if (display === "weekly") {
    dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId, YEAR(d.Date), WEEK(d.Date,1) ORDER BY YEAR(d.Date) ASC, WEEK(d.Date,1) ASC, d.MerchantId ASC`;
  }

  if (display === "daily") {
    dasboardSQLperiod = Prisma.sql`GROUP BY d.MerchantId, d.Date ORDER BY d.Date ASC, d.MerchantId ASC`;
  }

  if (merchant_id) {
    dasboardSQLwhere = Prisma.sql` AND d.MerchantId = '${merchant_id}`;
  }

  if (affiliate_id) {
    dasboardSQLwhere = Prisma.sql` AND d.AffiliateID = ${affiliate_id}`;
  }

  // dasboardSQLwhere = Prisma.sql` LIMIT ${offset}, ${items_per_page}`;

  const [data, totals] = await Promise.all([
    prisma.$queryRaw<
      z.infer<typeof QuickReportSummarySchema>[]
    >(Prisma.sql`select
        d.Date,
        d.MerchantId AS merchant_id,
        YEAR(d.Date) AS Year,
        MONTH(d.Date) AS Month ,
        WEEK(d.Date) AS Week,
        sum(d.Impressions) as Impressions,
        sum(d.Clicks) as Clicks,
        sum(d.Install) as Install,
        sum(d.Leads) as Leads,
        sum(d.Demo) as Demo,
        sum(d.RealAccount) as RealAccount,
        sum(d.FTD) as FTD,
        sum(d.FTDAmount) as FTDAmount,
        sum(d.RawFTD) as RawFTD,
        sum(d.RawFTDAmount) as RawFTDAmount,
        sum(d.Deposits) as Deposits,
        sum(d.DepositsAmount) as DepositsAmount,
        sum(d.Bonus) as Bonus,
        sum(d.Withdrawal) as Withdrawal,
        sum(d.ChargeBack) as ChargeBack,
        sum(d.NetDeposit) as NetDeposit,
        sum(d.PNL) as PNL,
        sum(d.Volume) as Volume,
        sum(d.ActiveTrader) as ActiveTrader,
        sum(d.Commission) as Commission,
        sum(d.PendingDeposits) as PendingDeposits,
        sum(d.PendingDepositsAmount) as PendingDepositsAmount
        from Dashboard d
        INNER JOIN affiliates aff ON d.AffiliateID = aff.id
        WHERE
          d.Date >= ${formatISO(from, { representation: "date" })}
        AND d.Date <  ${formatISO(to, {
          representation: "date",
        })}
        ${dasboardSQLwhere}
        ${dasboardSQLperiod}
        LIMIT ${pageParams.pageSize} OFFSET ${offset}`),
    prisma.dashboard.aggregate({
      _count: {
        merchant_id: true,
      },
      where: {
        merchant_id: merchant_id,
        affiliate_id: affiliate_id,
        Date: {
          gte: formatISO(from),
          lt: formatISO(to),
        },
      },
    }),
  ]);

  // console.log("quick report data ----->", totals);

  return {
    data: data?.map(convertPrismaResultsToNumbers) || data,
    totals: {},
    pageInfo: {
      ...pageParams,
      // TODO
      totalItems: totals._count.merchant_id,
    },
  };
};

export const getQuickReportSummary = protectedProcedure
  .input(InputWithPageInfo)
  .output(QuickReportSummaryResultSchema)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return quickReportSummary(ctx.prisma, affiliate_id, input);
  });

export const exportQuickSummaryReport = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;
    const affiliate_id = checkIsUser(ctx);

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        quickReportSummary(ctx.prisma, affiliate_id, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

import { map } from "rambda";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { merchant_id } from "./const";
import { checkIsUser } from "@/server/api/utils";
import { serverStoragePath } from "@/server/utils";
import { imageProxy } from "@/components/utils";

export const getDashboard = protectedProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
    })
  )
  .query(async ({ ctx, input: { from, to } }) => {
    const affiliate_id = checkIsUser(ctx);
    const data = await ctx.prisma.dashboard.groupBy({
      by: ["merchant_id"],
      where: {
        merchant_id: merchant_id ? merchant_id : 1,
        affiliate_id,
        Date: {
          gt: from,
          lte: to,
        },
      },
      _sum: {
        Clicks: true,
        Impressions: true,
        Install: true,
        Leads: true,
        Demo: true,
        RealAccount: true,
        FTD: true,
        FTDAmount: true,
        Deposits: true,
        DepositsAmount: true,
        Bonus: true,
        RawFTD: true,
        RawFTDAmount: true,
        Withdrawal: true,
        ChargeBack: true,
        NetDeposit: true,
        PNL: true,
        ActiveTrader: true,
        Commission: true,
        PendingDeposits: true,
        PendingDepositsAmount: true,
      },
    });

    return data;
  });

export const getTopMerchantCreative = protectedProcedure.query(
  async ({ ctx }) => {
    const data = await ctx.prisma.merchants_creative.findMany({
      where: {
        merchant_id,
        valid: 1,
        affiliateReady: 1,
        featured: 1,
        NOT: {
          file: {
            contains: "%tmp%",
          },
        },
      },
      include: {
        merchant: {
          select: { name: true },
        },
        language: {
          select: { title: true },
        },
        category: { select: { categoryname: true } },
      },
      orderBy: {
        id: "desc",
      },
      take: 5,
    });

    return map(
      ({ file, ...data }) => ({
        ...data,
        file: imageProxy(serverStoragePath(file) || ""),
      }),
      data
    );
  }
);

const dateList = (
  from: Date,
  to: Date
): { year: number; month: number; label: string }[] => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const data = [];
  const startYear = from.getFullYear();
  const endYear = to.getFullYear();
  for (let i = startYear; i <= endYear; i++) {
    const endMonth = i != endYear ? 11 : to.getMonth();
    const startMonth = i === startYear ? from.getMonth() : 0;

    for (let j = startMonth; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      const temp = {
        year: i,
        month: j,
        label: months[j] || "ERROR",
      };
      data.push(temp);
    }
  }
  return data;
};

export const getPerformanceChart = protectedProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
    })
  )
  .query(async ({ ctx, input: { from, to } }) => {
    const affiliate_id = checkIsUser(ctx);
    return await Promise.all(
      dateList(from, to).map(async (item) => {
        const from = new Date(item.year, item.month, 1);
        const to = new Date(item.year, item.month + 1, 0);

        const data = await ctx.prisma.dashboard.groupBy({
          by: ["merchant_id"],
          where: {
            affiliate_id,
            merchant_id: merchant_id ? merchant_id : 1,
            Date: {
              gt: from,
              lte: to,
            },
          },
          _sum: {
            FTD: true,
            RealAccount: true,
          },
        });

        return {
          date: `${item.label}, ${item.year}`,
          Accounts: data[0] ? data[0]._sum.RealAccount : 0,
          ActiveTraders: data[0] ? data[0]._sum.FTD : 0,
        };
      })
    );
  });

export const getAllPerformanceChart = protectedProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
    })
  )
  .query(async ({ ctx, input: { from, to } }) => {
    const affiliate_id = checkIsUser(ctx);
    return await Promise.all(
      dateList(from, to).map(async (item) => {
        const from = new Date(item.year, item.month, 1);
        const to = new Date(item.year, item.month + 1, 0);

        const data = await ctx.prisma.dashboard.groupBy({
          by: ["merchant_id"],
          where: {
            merchant_id: merchant_id ? merchant_id : 1,
            affiliate_id,
            Date: {
              gt: from,
              lte: to,
            },
          },
          _sum: {
            Clicks: true,
            Impressions: true,
            Install: true,
            Leads: true,
            Demo: true,
            RealAccount: true,
            FTD: true,
            FTDAmount: true,
            Deposits: true,
            DepositsAmount: true,
            Bonus: true,
            RawFTD: true,
            RawFTDAmount: true,
            Withdrawal: true,
            ChargeBack: true,
            NetDeposit: true,
            PNL: true,
            ActiveTrader: true,
            Commission: true,
            PendingDeposits: true,
            PendingDepositsAmount: true,
          },
        });

        return {
          date: `${item.label}, ${item.year}`,
          Clicks: data[0] ? data[0]._sum.Clicks : 0,
          Impressions: data[0] ? data[0]._sum.Impressions : 0,
          Install: data[0] ? data[0]._sum.Install : 0,
          Leads: data[0] ? data[0]._sum.Leads : 0,
          Demo: data[0] ? data[0]._sum.Demo : 0,
          RealAccount: data[0] ? data[0]._sum.RealAccount : 0,
          FTD: data[0] ? data[0]._sum.FTD : 0,
          FTDAmount: data[0] ? data[0]._sum.FTDAmount : 0,
          Deposits: data[0] ? data[0]._sum.Deposits : 0,
          DepositsAmount: data[0] ? data[0]._sum.DepositsAmount : 0,
          Bonus: data[0] ? data[0]._sum.Bonus : 0,
          RawFTD: data[0] ? data[0]._sum.RawFTD : 0,
          RawFTDAmount: data[0] ? data[0]._sum.RawFTDAmount : 0,
          Withdrawal: data[0] ? data[0]._sum.Withdrawal : 0,
          ChargeBack: data[0] ? data[0]._sum.ChargeBack : 0,
          NetDeposit: data[0] ? data[0]._sum.NetDeposit : 0,
          PNL: data[0] ? data[0]._sum.PNL : 0,
          ActiveTrader: data[0] ? data[0]._sum.ActiveTrader : 0,
          Commission: data[0] ? data[0]._sum.Commission : 0,
          PendingDeposits: data[0] ? data[0]._sum.PendingDeposits : 0,
          PendingDepositsAmount: data[0]
            ? data[0]._sum.PendingDepositsAmount
            : 0,
        };
      })
    );
  });

export const getConversionChart = protectedProcedure
  .input(
    z.object({
      from: z.date(),
      to: z.date(),
    })
  )
  .query(async ({ ctx, input: { from, to } }) => {
    const affiliate_id = checkIsUser(ctx);
    return await Promise.all(
      dateList(from, to).map(async (item) => {
        const from = new Date(item.year, item.month, 1);
        const to = new Date(item.year, item.month + 1, 0);

        const data = await ctx.prisma.dashboard.groupBy({
          by: ["merchant_id"],
          where: {
            affiliate_id,
            merchant_id: merchant_id ? merchant_id : 1,
            Date: {
              gt: from,
              lte: to,
            },
          },
          _sum: {
            FTD: true,
            RealAccount: true,
          },
        });

        let conversions = 0;
        if (data) {
          if (data[0]?._sum.RealAccount && data[0]?._sum.FTD) {
            conversions = (data[0]?._sum.FTD / data[0]?._sum.RealAccount) * 100;
          }
        }
        return {
          date: `${item.label}, ${item.year}`,
          Conversions: conversions,
        };
      })
    );
  });

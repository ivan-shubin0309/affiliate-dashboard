import { TRPCError } from "@trpc/server";
import { indexBy, map } from "rambda";
import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { getConfig } from "@/server/get-config";
import { checkIsUser } from "@/server/api/utils";

export const getPaymentsPaid = protectedProcedure
  .input(
    z.object({
      search: z.string().optional(),
    })
  )
  .query(async ({ ctx, input: { search } }) => {
    const affiliate_id = checkIsUser(ctx);
    const where = {
      affiliate_id,
      // valid: 1,
      paymentID: { contains: search },
    };

    const [payments_details, payments_paid] = await Promise.all([
      ctx.prisma.payments_details.groupBy({
        by: ["paymentID"],
        where: { affiliate_id },
        // _sum: {
        //   amount: true,
        // },
        _count: {
          id: true,
        },
      }),
      await ctx.prisma.payments_paid.findMany({
        where,
        orderBy: [{ id: "desc" }],
      }),
    ]);

    const detailDict = indexBy("paymentID", payments_details);
    return map(
      ({ paymentID, ...data }) => ({
        paymentID,
        ...data,
        totalFTD: detailDict[paymentID]?._count.id,
        // amount: detailDict[paymentID]?._sum.amount,
      }),
      payments_paid
    );
  });

export const getPaymentDetails = protectedProcedure
  .input(z.object({ paymentId: z.string() }))
  .query(async ({ ctx, input: { paymentId } }) => {
    if (!paymentId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Invalid paymentID.`,
      });
    }

    const [payments_details, payments_paid, config] = await Promise.all([
      ctx.prisma.payments_details.findMany({
        where: { paymentID: paymentId },
      }),
      ctx.prisma.payments_paid.findUnique({
        where: { paymentID: paymentId },
      }),
      getConfig(ctx.prisma),
    ]);
    const affiliatesDetail = await ctx.prisma.affiliates.findFirst({
      where: { id: payments_paid?.affiliate_id },
    });
    const bonusesDetail = await ctx.prisma.payments_details.findMany({
      where: {
        month: payments_paid?.month,
        year: payments_paid?.year,
        reportType: "sub",
        paymentID: payments_paid?.paymentID,
        status: "approved",
      },
    });
    const commissionReport = await ctx.prisma.payments_details.aggregate({
      where: {
        month: payments_paid?.month,
        year: payments_paid?.year,
        reportType: "sub",
        paymentID: paymentId,
      },
      _sum: {
        amount: true,
      },
      _count: {
        id: true,
      },
    });
    const merchants = await ctx.prisma.merchants.findFirst({
      where: {
        id: parseInt(affiliatesDetail?.merchants ?? "0"),
      },
    });

    console.log(`muly:`, {
      config,
    });

    return {
      payments_details,
      payments_paid,
      affiliatesDetail,
      bonusesDetail,
      merchants,
      commissionReport,
      billingLogoPath: config.billingLogoPath,
    };
  });

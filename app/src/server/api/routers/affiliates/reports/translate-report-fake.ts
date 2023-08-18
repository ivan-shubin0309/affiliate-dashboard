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
import type { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { translateModel } from "../../../../../../prisma/zod";

const Input = z.object({
  from: z.date(),
  to: z.date(),
  search: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const TranslateReportFakeResultSchema = z.object({
  data: z.array(translateModel),
  pageInfo,
  totals: z.any(),
});

const translateReportFake = async (
  prisma: PrismaClient,
  {
    from,
    to,
    search,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const offset = getPageOffset(pageParams);

  const orderBy = getSortingInfo(sortingParam);
  const [data, totals] = await Promise.all([
    prisma.translate.findMany({
      take: pageParams.pageSize,
      skip: offset,
      where: {
        langENG: { contains: search },
        // rdate: { gte: from, lte: to },
      },
      orderBy,
    }),

    prisma.translate.aggregate({
      _count: {
        id: true,
      },
      where: {
        langENG: { contains: search },
        // rdate: { gte: from, lte: to },
      },
    }),
  ]);

  console.log(`muly:country report `, { data: data.length, totals });

  return {
    data,
    pageInfo: { ...pageParams, totalItems: totals._count.id },
    totals: undefined,
  };
};

export const getTranslateReportFake = protectedProcedure
  .input(InputWithPageInfo)
  .output(TranslateReportFakeResultSchema)
  .query(({ ctx, input }) => translateReportFake(ctx.prisma, input));

export const exportTranslateReportFake = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;

    // console.log("export type ---->", exportType);
    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        translateReportFake(ctx.prisma, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

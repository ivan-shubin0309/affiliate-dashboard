import { protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import {
  affiliatesModel,
  merchantsModel,
  pixel_logsModel,
  pixel_monitorModel,
} from "prisma/zod";
import { z } from "zod";
import {
  PageParamsSchema,
  SortingParamSchema,
  exportReportLoop,
  exportType,
  flattenObject,
  getSortingInfo,
  pageInfo,
  reportColumns,
} from "./reports-utils";

const Input = z.object({
  from: z.date().optional(),
  to: z.date().optional(),
  merchant_id: z.number().optional(),
  country: z.string().optional(),
  banner_id: z.string().optional(),
  group_id: z.string().optional(),
});

const InputWithPageInfo = Input.extend({
  pageParams: PageParamsSchema,
  sortingParam: SortingParamSchema,
});

const dataItemSchema = pixel_logsModel
  .extend({
    pixel_monitor_type: pixel_monitorModel.shape.type,
    pixel_monitor_method: pixel_monitorModel.shape.method,
    pixel_monitor_totalFired: pixel_monitorModel.shape.totalFired,

    pixel_monitor_affiliate_valid: affiliatesModel.shape.valid,
    pixel_monitor_affiliate_id: affiliatesModel.shape.id,
    pixel_monitor_affiliate_username: affiliatesModel.shape.username,
    pixel_monitor_affiliate_group_id: affiliatesModel.shape.group_id,

    pixel_monitor_merchant_id: merchantsModel.shape.id,
    // pixel_monitor_banner_id: merchantsModel.shape.banner_id,
  })
  .partial();

type DataItem = z.infer<typeof dataItemSchema>;

const pixelLogReportSchema = z.object({
  data: z.array(dataItemSchema),
  pageInfo,
  totals: z.any(),
});

const pixelLogReportData = async (
  prisma: PrismaClient,
  {
    from,
    to,
    merchant_id,
    country,
    banner_id,
    group_id,
    pageParams,
    sortingParam,
  }: z.infer<typeof InputWithPageInfo>
) => {
  console.log("from ----->", from, " to ------->", to, merchant_id);
  let type_filter = {};
  if (banner_id) {
    type_filter = {
      banner_id: banner_id,
    };
  }

  if (group_id) {
    type_filter = {
      group_id: group_id,
    };
  }

  if (country) {
    type_filter = {
      country: country,
    };
  }

  if (merchant_id) {
    type_filter = {
      merchant_id: merchant_id,
    };
  }

  /*
              SELECT pl.id as plid,
                pm.* ,
                pl.*,
                af.username, mr.name, af.group_id, mr.id, af.id as affiliate_id
              FROM pixel_logs AS pl
                left join pixel_monitor pm on
                  pm.id = pl.pixelCode
                left join merchants mr on
                  pm.merchant_id = mr.id
                left join affiliates af on
                  pm.affiliate_id = af.id
                                          WHERE 2=2 and " . $globalWhere
                                                  . " pl.dateTime BETWEEN '" . $from . "' AND '" . $to . "' "
                                                  . " AND pm.merchant_id >0 "

                                                  .$whereType

                                                  . $where

                                          . " ORDER BY pl.dateTime ASC;";

                //}
             */
  const sorting_info = getSortingInfo(sortingParam);

  const pixelReport = await prisma.pixel_logs.findMany({
    orderBy: sorting_info ? sorting_info[0] : {},
    where: {
      ...type_filter,
      dateTime: {
        gte: from,
        lt: to,
      },
    },
    include: {
      pixel_monitor: {
        select: {
          affiliate_id: true,
          banner_id: true,
          method: true,
          totalFired: true,
          type: true,
          id: true,
          merchant_id: true,
          pixelCode: true,
          product_id: true,
          rdate: true,
          valid: true,
          affiliate: {
            select: {
              username: true,
              group_id: true,
              id: true,
              valid: true,
            },
          },
          merchant: {
            select: {
              id: true,
            },
          },
          pixel_logs: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  // TODO https://github.com/TanStack/table/issues/4499
  // Table not handle correctly deep nested object with missing values
  // maybe we should flatten the object?!
  const arrRes = {
    data: pixelReport.map((item) => flattenObject(item)) as DataItem[],
    totals: 0,
    pageInfo: {
      ...pageParams,
      totalItems: pixelReport.length,
    },
  };

  return arrRes;
};

export const getPixelLogReport = protectedProcedure
  .input(InputWithPageInfo)
  // .output(pixelLogReportSchema)
  .query(({ ctx, input }) => pixelLogReportData(ctx.prisma, input));

export const exportPixelLogReportData = protectedProcedure
  .input(Input.extend({ exportType, reportColumns }))
  .mutation(async function ({ ctx, input }) {
    const { exportType, reportColumns, ...params } = input;

    const public_url: string | undefined = await exportReportLoop(
      exportType || "csv",
      reportColumns,
      async (pageNumber: number, pageSize: number) =>
        pixelLogReportData(ctx.prisma, {
          ...params,
          pageParams: { pageNumber, pageSize },
        })
    );

    return public_url;
  });

/*
.map(({ pixel_monitor, ...rest }) => ({
      pixel_monitor: pixel_monitor ?? {
        type: "lead" as const,
        method: "get" as const,
        banner_id: 0,
        totalFired: 0,
        merchant: { id: 0 },
        affiliate: { id: 0, valid: 0, group_id: 0, username: "" },
      },
      ...rest,
    }))
 */

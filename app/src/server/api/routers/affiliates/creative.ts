import { z } from "zod";

import type {
  merchants_creative_type,
  Prisma,
  PrismaClient,
} from "@prisma/client";
import { countBy, map, sortBy, uniq, uniqBy } from "rambda";
import { SelectSchema } from "../../../db-schema-utils";
import { protectedProcedure } from "../../trpc";
import { merchant_id } from "./const";
import {
  getPageOffset,
  pageInfo,
  PageParamsSchema,
} from "./reports/reports-utils";
import { getConfig } from "@/server/get-config";
import { checkIsUser } from "@/server/api/utils";
import { serverStoragePath } from "@/server/utils";
import { imageProxy } from "@/components/utils";
const Input = z.object({
  category: z.number().optional(),
  promotion: z.number().optional(),
  language: z.number().optional(),
  type: z.string().optional(), //merchants_creativeModel.shape.type.nullish(),
  size: z.string().optional(),
  search: z.string().optional(),
});
const InputWithPageInfo = Input.extend({ pageParams: PageParamsSchema });

const MerchantCreativeModel = z.object({
  id: z.number(),
  rdate: z.date().optional(),
  last_update: z.date().optional(),
  valid: z.number().optional(),
  admin_id: z.number().optional(),
  merchant_id: z.number().optional(),
  product_id: z.number().optional(),
  language_id: z.number().optional(),
  promotion_id: z.number().optional(),
  title: z.string().optional(),
  type: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  url: z.string(),
  directLink: z.string(),
  iframe_url: z.string().optional(),
  alt: z.string(),
  scriptCode: z.string().optional(),
  affiliate_id: z.number().optional(),
  category_id: z.number().optional(),
  featured: z.number().optional(),
  affiliateReady: z.number().optional(),
  language: z
    .object({
      title: z.string(),
    })
    .optional(),
  category: z
    .object({
      categoryname: z.string(),
    })
    .nullable(),
  file: z.string().optional().nullable(),
});

const MerchantCreativeResultSchema = z.object({
  data: z.array(MerchantCreativeModel),
  pageInfo,
  totals: z.any(),
});

export const getMerchantCreativeMeta = protectedProcedure
  .output(
    z.object({
      merchants_creative_categories: SelectSchema(z.number()),
      merchants_promotions: SelectSchema(z.number()),
      language: SelectSchema(z.number()),
      type: SelectSchema(z.string()),
      size: SelectSchema(z.string()),
    })
  )
  .query(async ({ ctx }) => {
    // SELECT * FROM affiliates WHERE id='500' AND valid='1'

    const affiliate_id = checkIsUser(ctx);
    const data = await ctx.prisma.merchants.findUnique({
      where: { id: merchant_id },
      select: {
        id: true,
        merchants_creative_categories: {
          where: { valid: true },
          select: { id: true, categoryname: true },
        },

        merchants_promotions: {
          where: { valid: 1, affiliate_id },
          select: {
            id: true,
            title: true,
          },
        },

        merchants_creative: {
          where: { valid: 1 },
          select: {
            id: true,
            // to distinct
            language: { select: { id: true, title: true } },

            // to distinct
            type: true,

            // to distinct
            width: true,
            height: true,
          },
        },
      },
    });

    if (!data) {
      throw new Error("Failed to get");
    }

    return {
      merchants_creative_categories: map(
        ({ id, categoryname }) => ({ id, title: categoryname }),
        data.merchants_creative_categories
      ),
      merchants_promotions: data.merchants_promotions,
      language: sortBy(
        ({ id, title }: { id: number; title: string }) => id,
        uniqBy(
          ({ id }): number => id,
          data.merchants_creative.map(({ language: { id, title } }) => ({
            id,
            title,
          }))
        )
      ),
      type: map(
        (i) => ({ id: i, title: i }),
        uniq(data.merchants_creative.map(({ type }) => type))
      ),
      size: sortBy(
        ({ id, title }) => {
          const [width, height] = id.split("x").map(Number);
          return (width || 0) * (height || 0);
        },
        Object.values(
          map(
            (count: number, value) => ({
              id: value,
              title: `${value} (${count})`,
            }),
            countBy(
              (text) => text,
              data.merchants_creative.map(
                ({ width, height }) => `${width}x${height}`
              )
            )
          )
        )
      ),
    };
  });

const merchantCreativeQuery = async (
  prisma: PrismaClient,
  affiliate_id: number,
  {
    category,
    promotion,
    language,
    type,
    size,
    search,
    pageParams,
  }: z.infer<typeof InputWithPageInfo>
) => {
  const [width, height] = size
    ? size.split("x").map(Number)
    : [undefined, undefined];
  const offset = getPageOffset(pageParams);

  const where: Prisma.merchants_creativeWhereInput = {
    merchant_id,
    product_id: 0,
    valid: 1,
    category_id: category,
    promotion_id: promotion,
    language_id: language,
    type: type ? (type as merchants_creative_type) : undefined,
    width,
    height,
    title: {
      contains: search,
    },
  };

  const [data, totals, config] = await Promise.all([
    map(
      ({ file, ...data }) => ({
        ...data,
        file: imageProxy(serverStoragePath(file) || ""),
      }),
      await prisma.merchants_creative.findMany({
        take: pageParams.pageSize,
        skip: offset,
        where,
        include: {
          language: {
            select: { title: true },
          },
          category: { select: { categoryname: true } },
        },
      })
    ),

    prisma.merchants_creative.aggregate({
      _count: {
        id: true,
      },
      where,
    }),

    getConfig(prisma),
  ]);

  const { legacy_host } = config;

  return {
    data: data.map((item) => ({
      directLink: `${legacy_host}/click.php?ctag=a${affiliate_id}-b${item.id}-p`,
      ...item,
    })),
    pageInfo: { ...pageParams, totalItems: totals._count.id },
    totals: undefined,
  };
};

export const getMerchantCreative = protectedProcedure
  .input(InputWithPageInfo)
  .output(MerchantCreativeResultSchema)
  .query(({ ctx, input }) => {
    const affiliate_id = checkIsUser(ctx);
    return merchantCreativeQuery(ctx.prisma, affiliate_id, input);
  });

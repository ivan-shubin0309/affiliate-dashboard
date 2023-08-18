import { env } from "@/env.mjs";
import { format } from "date-fns";
import fs, { writeFileSync } from "fs";
import os from "os";
import path from "path";
import { z } from "zod";
import { uploadFile } from "../config/cloud-storage";
import { generateCSVReport } from "../config/exportCSV";
import { generateJSONReport } from "../config/generateJSONReport";
import { generateXLSXReport } from "../config/generateXLSXReport";
import type { PrismaClient } from "@prisma/client";

// Common params for all reports
export const PageParamsSchema = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
});

export const SortingParamSchema = z
  .object({
    id: z.string(),
    desc: z.boolean(),
  })
  .array()
  .optional();

export const getPageOffset = (pageParams: PageParam) =>
  (pageParams.pageNumber - 1) * pageParams.pageSize;

export const getSortingInfo = (sortingParam: SortingParam) => {
  return sortingParam?.map((x) => {
    const res: {
      [key: string]: string;
    } = {};
    res[x.id] = x.desc ? "desc" : "asc";
    return res;
  });
};

export const pageInfo = z.object({
  pageNumber: z.number().int(),
  pageSize: z.number().int(),
  totalItems: z.number().int(),
});

export type PageParam = z.infer<typeof PageParamsSchema>;
export type PageInfo = z.infer<typeof pageInfo>;
export type SortingParam = z.infer<typeof SortingParamSchema>;

export interface PageResult {
  data: any[];
  pageInfo: PageInfo;
}

export const splitToPages = <Row>(data: Row[], pageParams: PageParam) => {
  const offset = getPageOffset(pageParams);
  const pageData = data.slice(offset, offset + pageParams.pageSize);
  const pageInfo = {
    pageNumber: pageParams.pageNumber,
    pageSize: pageParams.pageSize,
    totalItems: data.length,
  };
  return { data: pageData, pageInfo };
};

// Common params for all reports export
export const exportType = z.enum(["csv", "xlsx", "json"]);

const ReportColumn = z.object({
  header: z.string().optional(),
  accessorKey: z.string(),
});

export const reportColumns = z.array(ReportColumn);

export type ExportType = z.infer<typeof exportType>;

export type ColumnsType = z.infer<typeof ReportColumn>;

// Generic function to export data in csv, xlsx, json format
// Can be used for all reports
export const exportReportLoop = async (
  exportType: ExportType,
  columns: ColumnsType[],
  getPage: (page: number, items_per_page: number) => Promise<PageResult>
) => {
  let page = 1;
  const items_per_page = 5000;
  let hasMoreData = true;
  const tmpDir = os.tmpdir();
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }
  const tmpFile = path.join(tmpDir, Date.now().toString());

  while (hasMoreData) {
    // console.log("generic file name ------->", page, items_per_page);
    const { data, pageInfo } = await getPage(page, items_per_page);
    // TODO: write data to to csv, xlsx, json based on exportType

    // console.log("data ----->", data);
    // TODO: should not be needed
    const data_rows = data;

    if (exportType === "xlsx") {
      generateXLSXReport(columns, data_rows, tmpFile);
    } else if (exportType === "csv") {
      generateCSVReport(columns, data_rows, tmpFile);
    } else {
      generateJSONReport(columns, data, tmpFile);
    }

    hasMoreData = data.length >= items_per_page;
    page++;
  }
  const bucketName = "reports-download-tmp";
  const public_url = await uploadFile(bucketName, tmpFile);

  fs.unlinkSync(tmpFile);

  return public_url;
};

export const debugSaveData = (name: string, data: any) => {
  if (env.NODE_ENV !== "production") {
    writeFileSync(`./tmp/${name}.json`, JSON.stringify(data, null, 2));
  }
};

export const flattenObject = (
  obj: Record<string, any>,
  parentKey = ""
): Record<string, any> => {
  let result: Record<string, any> = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;

      if (typeof obj[key] === "object" && obj[key] !== null) {
        const flattened = flattenObject(obj[key], newKey);
        result = { ...result, ...flattened };
      } else {
        result[newKey] = obj[key];
      }
    }
  }

  return result;
};

export const formatSqlDate = (date: Date) => `"${format(date, "yyyy-MM-dd")}"`;

export const isFieldExists = async (
  prisma: PrismaClient,
  table: string,
  field: string
): Promise<boolean> => {
  const result = await prisma.$queryRaw<{ count: number }[]>`
  SELECT COUNT(COLUMN_NAME) as count
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = ${table}
  AND COLUMN_NAME = ${field}`;

  console.log(`muly:isFieldExists`, { table, field, result });

  return result && !!result[0]?.count;
};
